from django.http import HttpResponse
from django.shortcuts import render, redirect
from database.models import User, Contest, Team, Tag, Blog, Application
from django.contrib import auth
from django.db.models import Q
from api import tools
import json

def list(request):
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
	for item in list:
		info = tools.teamToDict(item)
		if (user):
			if (len(item.candidates.all().filter(username = user.username)) > 0):
				info['application'] = True
		result.append(info)
	return HttpResponse(json.dumps(result), content_type = 'application/json')


def detail(request):
	item = None
	if (request.GET and request.GET.get('id')):
		id = int(request.GET.get('id'))
		list = Team.objects.filter(id = id)
		if (len(list) > 0):
			item = list[0]
	elif (request.GET and request.GET.get('username') and request.GET.get('contest')):
		list = tools.getTeamByUserContest(request.GET.get('username'), int(request.GET.get('contest')))
		if (len(list) > 0):
			item = list[0]
		print(item)
		
	if (item == None):
		return HttpResponse("Team not found.", status = 400)
		
	if (request.user.is_authenticated and item.captain.username == request.user.username):
		result = tools.teamToJson(item, True)
	else:
		result = tools.teamToJson(item, False)
	return HttpResponse(result, content_type = 'application/json')
	
	
def admin(request):
	if ((not request.user.is_authenticated) or request.user.is_authenticated == False):
		return HttpResponse("Please log in.", status = 400)
	user = request.user
	
	contest = None
	if (request.POST and request.POST.get('contest')):
		contestList = Contest.objects.filter(id = int(request.POST.get('contest')))
		if (contestList == None or len(contestList) == 0):
			return HttpResponse("Contest not found.", status = 400)
		else:
			contest = contestList[0]
	
	team = None
	if (request.POST and request.POST.get('team')):
		teamList = Team.objects.filter(id = int(request.POST.get('team')))
		if (teamList == None or len(teamList) == 0):
			return HttpResponse("Team not found.", status = 400)
		else:
			team = teamList[0]
	
	if (request.POST and request.POST.get('name')):
		if (team == None):
			if (Contest == None):
				return HttpResponse("Contest missing.", status = 400)
			team = Team(captain = user, contest = contest)
			team.save()
			team.members.add(user)
		team.name = request.POST.get('name')
		team.save()
	
	if (team == None):
		return HttpResponse("Team not found.", status = 400)
	
	
	if (team.captain.username != request.user.username):
		if (request.POST and request.POST.get('quit')):
			team.members.remove(request.user)
			return HttpResponse("Quit successfully.", status = 200)
		else:
			return HttpResponse("You are not the captain.", status = 400)
	
	
	
	
	if (request.POST and request.POST.get('introduction')):
		team.introduction = request.POST.get('introduction')
		team.save()
	if (request.POST and request.POST.get('accept')):
		try:
			targetUser = User.objects.get(username = request.POST.get('accept'))
		except:
			return HttpResponse("User not found.", status = 400)
		team.members.add(targetUser)
		targetUser.apply.clear()
		
	if (request.POST and request.POST.get('refuse')):
		try:
			targetUser = User.objects.get(username = request.POST.get('refuse'))
		except:
			return HttpResponse("User not found.", status = 400)
		team.candidates.remove(targetUser)
			
	if (request.POST and request.POST.get('dismiss')):
		try:
			targetUser = User.objects.get(username = request.POST.get('dismiss'))
		except:
			return HttpResponse("User not found.", status = 400)
		team.members.remove(targetUser)
		
	if (request.POST and request.POST.get('disband')):
		team.delete()
		
	return HttpResponse('Change successfully')


def apply(request):
	if ((not request.user) or request.user.is_authenticated == False):
		return HttpResponse("Please log in.", status = 400)
	if (not (request.POST and request.POST.get('id'))):
		return HttpResponse("ID missing.", status = 400)
		
	teamList = Team.objects.filter(id = int(request.POST.get('id')))
	if (len(teamList) == 0):
		return HttpResponse("Team not found.", status = 400)
	team = teamList[0]
	contest = team.contest
	if (len(tools.getTeamByUserContest(request.user.username, contest.id))):
		return HttpResponse("Already in a team now.", status = 400)
	
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