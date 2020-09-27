import datetime
from django.http import HttpResponse
from django.shortcuts import render, redirect
from database.models import User, Contest, Team, Tag, Blog, Application
from django.contrib import auth
from django.db.models import Q
from api import tools
import json

def list(request):
	#队伍列表，给了比赛、用户的情况下只给出属于这个比赛、这个用户加入了的队伍
	if (request.GET and request.GET.get('contest') and request.GET.get('username')):
		try:
			list = tools.getTeamByUserContest(request.GET.get('username'), int(request.GET.get('contest')))
		except:
			return HttpResponse("Data error.", status = 400)
			
	elif (request.GET and request.GET.get('username')):
		try:
			list = User.objects.get(name = request.GET.get('username')).belong.all()
		except:
			return HttpResponse("Data error.", status = 400)
			
	elif (request.GET and request.GET.get('contest')):
		try:
			list = contest.get(id = int(request.GET.get('contest'))).team_set.all()
		except:
			return HttpResponse("Contest error.", status = 400)
	else:
		list = Team.objects.all()
		
		
	result = []
	
	user = None
	if (request.user and request.user.is_authenticated):
		user = request.user
	
	#加一个当前用户是否在队伍的候选人中
	for item in list:
		info = tools.teamToDict(item)
		if (user):
			if (len(item.candidates.all().filter(username = user.username)) > 0):
				info['application'] = True
		result.append(info)
	return HttpResponse(json.dumps(result), content_type = 'application/json')


def detail(request):
	item = None
	#根据 队伍id 或者 用户和比赛信息（一个用户在一场比赛里只会加入一个队伍）获取队伍详细信息
	if (request.GET and request.GET.get('id')):
		try:
			item = Team.objects.get(id = int(request.GET.get('id')))
		except:
			return HttpResponse("Team not found.", status = 400)
	elif (request.GET and request.GET.get('username') and request.GET.get('contest')):
		try:
			id = int(request.GET.get('contest'))
		except:
			return HttpResponse("Contest id error.", status = 400)
		list = tools.getTeamByUserContest(request.GET.get('username'), id)
		if (len(list) > 0):
			item = list[0]
		print(item)
		
	if (item == None):
		return HttpResponse("Team not found.", status = 400)
	
	#判断是否为队长，队长能获取更多信息（申请等）
	if (request.user.is_authenticated and item.captain.username == request.user.username):
		result = tools.teamToJson(item, True)
	else:
		result = tools.teamToJson(item, False)
	return HttpResponse(result, content_type = 'application/json')
	
	
def admin(request):
	#管理队伍，内容比较多
	if ((not request.user.is_authenticated) or request.user.is_authenticated == False):
		return HttpResponse("Please log in.", status = 400)
	user = request.user
	
	contest = None
	if (request.POST and request.POST.get('contest')):
		try:
			contest = Contest.objects.get(id = int(request.POST.get('contest')))
		except:
			return HttpResponse("Contest not found.", status = 400)
	
	team = None
	if (request.POST and request.POST.get('team')):
		try:
			team = Team.objects.get(id = int(request.POST.get('team')))
		except:
			return HttpResponse("Team not found.", status = 400)
	
	if (request.POST and request.POST.get('name')):
		if (team == None):
			#如果提供了名字，没有给队伍定位，视为新建一个队伍
			if (contest == None):
				return HttpResponse("Contest missing.", status = 400)
			if datetime.datetime.now() > contest.registerTimeUp:
				return HttpResponse("Time for registration is up.", status = 400)
			if len(tools.getTeamByUserContest(request.GET.get('username'), contest.id))>0:
				return HttpResponse("Already in a team now.", status = 400)
				
			team = Team(captain = user, contest = contest)
			team.save()
			team.members.add(user)
		else:
			if (request.user.is_authenticated and team.captain.username == request.user.username):
				team.name = request.POST.get('name')
				team.save()
	
	if (team == None):
		return HttpResponse("Team not found.", status = 400)
	
	#判断是不是队长，如果不是队长就只能做退出操作
	if (request.user.is_authenticated and team.captain.username != request.user.username):
		if (request.POST and request.POST.get('quit')):
			team.members.remove(request.user)
			return HttpResponse("Quit successfully.", status = 200)
		else:
			return HttpResponse("You are not the captain.", status = 400)
	
	
	
	#修改简介
	if (request.POST and request.POST.get('introduction')):
		team.introduction = request.POST.get('introduction')
		team.save()
	
	#通过入队申请
	if (request.POST and request.POST.get('accept')):
		try:
			targetUser = User.objects.get(id = int(request.POST.get('accept')))
		except:
			return HttpResponse("User not found.", status = 400)
		
		if datetime.datetime.now() > team.contest.registerTimeUp:
			return HttpResponse("Time for registration is up.", status = 400)
		
		if team.members.count() >= team.contest.limitOfMember:
			return HttpResponse("The team is full.", status = 400)
		team.members.add(targetUser)
		targetUser.apply.clear()
	
	#拒绝入队申请
	if (request.POST and request.POST.get('refuse')):
		try:
			targetUser = User.objects.get(id = int(request.POST.get('refuse')))
		except:
			return HttpResponse("User not found.", status = 400)
		team.candidates.remove(targetUser)
	
	#踢出队伍
	if (request.POST and request.POST.get('dismiss')):
		try:
			targetUser = User.objects.get(id = int(request.POST.get('dismiss')))
		except:
			return HttpResponse("User not found.", status = 400)
		team.members.remove(targetUser)
	
	#解散队伍
	if (request.POST and request.POST.get('disband')):
		team.delete()
		
	return HttpResponse('Change successfully')


def apply(request):
	#申请入队，做一些可行性判断就可以
	if ((not request.user) or request.user.is_authenticated == False):
		return HttpResponse("Please log in.", status = 400)
	if (not (request.POST and request.POST.get('id'))):
		return HttpResponse("ID missing.", status = 400)
		
	try:
		team = Team.objects.get(id = int(request.POST.get('id')))
	except:
		return HttpResponse("Team not found.", status = 400)
	
	
	contest = team.contest
	if (len(tools.getTeamByUserContest(request.user.username, contest.id))):
		return HttpResponse("Already in a team now.", status = 400)
	
	if datetime.datetime.now() > contest.registerTimeUp:
		return HttpResponse("Time for registration is up.", status = 400)
	
	if team.members.count() >= contest.limitOfMember:
		return HttpResponse("The team is full.", status = 400)
	
	membership = team.candidates.all().filter(id = request.user.id)
	if (request.POST and request.POST.get('cancel') == 'true'):
		if (len(membership) == 0):
			return HttpResponse("Application not found.", status = 400)
		team.candidates.remove(request.user)
		return HttpResponse("Application is canceled.")
	else:
		if (len(membership) > 0):
			return HttpResponse("Application already exists.", status = 400)
		team.candidates.add(request.user)
		return HttpResponse("Apply successfully.")