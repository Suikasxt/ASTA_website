import datetime
from django.http import HttpResponse
from django.shortcuts import render, redirect
from database.models import User, Contest, Team, RsrvProject, RsrvTimeAvailable, RsrvTimeUsed
from django.contrib import auth
from django.db.models import Q
from api import tools
import json


def list(request):
	#获取项目列表
	list = RsrvProject.objects.all()
	result = []
	for item in list:
		result.append(tools.rsrvProjectToDict(item))
	return HttpResponse(json.dumps(result), content_type = 'application/json')

def detail(request):
	# 用project的id找到该project对象
	try:
		project = RsrvProject.objects.get(id = int(request.GET.get('id')))
	except:
		return HttpResponse("Project not found.", status = 400)
	return HttpResponse(json.dumps(tools.rsrvProjectToDict(project, True)), content_type = 'application/json')
	
def getData(request):
	SecondADay = 86400
	GetDay = 7
	# 不判定用户登录状态，不登录也可以查看
	# 用project的id找到该project对象
	try:
		project = RsrvProject.objects.get(id = int(request.GET.get('id')))
	except:
		return HttpResponse("Project not found.", status = 400)
	
	# 用timestamp算出startTime、endTime，转成datatime格式
	try:
		startTime = tools.timestamp2datetime(int(request.GET.get('startTime')))
		#提供则使用endTime，否则默认为startTime后7天
		if (request.GET and request.GET.get('endTime')):
			endTime = int(request.GET.get('endTime'))
		else:
			endTime = startTime + (SecondADay * GetDay)
		endTime = tools.timestamp2datetime(endTime)
	except:
		return HttpResponse("Wrong start time or end time.", status = 400)
		
	# 用start_time, end_time与project对象得到availableTime列表
	avaiTimeList = RsrvTimeAvailable.objects.filter(project = project, startTime__gte = startTime, endTime__lte = endTime)
	# 用available列表得到相应的UsedTime列表
	result = { 'available': [], 'used': [] }
	for avaiTime in avaiTimeList:
		result['available'].append(tools.avaiTimeToDict(avaiTime))
		usedTimeList = RsrvTimeUsed.objects.filter(availableTime = avaiTime)
		for usedTime in usedTimeList:
			result['used'].append(tools.usedTimeToDict(usedTime))
	# 封装并回传
	return HttpResponse(json.dumps(result), content_type = 'application/json')


def apply(request):
	# 登录了才能申请
	if (request.user and request.user.is_authenticated):
		user = request.user
	else:
		return HttpResponse("Please log in.", status = 400)
	
	# 用availableTime的id找到该开放时间对象
	try:
		avaiTime = RsrvTimeAvailable.objects.get(id = int(request.POST.get('id')))
	except:
		return HttpResponse("Available time not found.", status = 400)
	project = avaiTime.project
	
	
	# 用timestamp算出startTime、endTime
	try:
		startTime = tools.timestamp2datetime(int(request.POST.get('startTime')))
		endTime = tools.timestamp2datetime(int(request.POST.get('endTime')))
	except:
		return HttpResponse("Wrong start time or end time.", status = 400)
	
	# 检查是否有未使用的申请时间
	if (project.contest):
		team = tools.getTeamByUserContest(user, project.contest)
		# 跟队伍挂钩的项目必须组了队才能申请
		if (len(team) == 0):
			return HttpResponse("Not in a team now.", status = 400)
		else:
			team = team[0]
			timeUsedList = RsrvTimeUsed.objects.filter(availableTime__project = project, endTime__gt = datetime.datetime.now(), user__in = team.members.all())
			if (len(timeUsedList) >= 1):
				return HttpResponse("Already have a reservation.", status = 400)
	else:
		timeUsedList = RsrvTimeUsed.objects.filter(project = project, endTime__gt = datetime.datetime.now(), user = user)
		if (len(timeUsedList) >= 1):
			return HttpResponse("Already have a reservation.", status = 400)
	
	# 检查跟已预约时间是否冲突
	timeUsedList = avaiTime.rsrvtimeused_set.all()
	for timeUsed in timeUsedList:
		if timeUsed.startTime < endTime and timeUsed.endTime > startTime:
			return HttpResponse("Conflict with existing reservation.", status = 400)
	
	# 建立新的已预约时间
	newTimeUsed = RsrvTimeUsed(availableTime = avaiTime, startTime = startTime, endTime = endTime, user = request.user)
	newTimeUsed.save()
	return HttpResponse('Apply successfully')

def cancel(request):
	#登录了才能取消自己的申请
	if (request.user and request.user.is_authenticated):
		user = request.user
	else:
		return HttpResponse("Please log in.", status = 400)
	
	# 用id找到该已预约时间对象
	try:
		usedTime = RsrvTimeUsed.objects.get(id = int(request.POST.get('usedTimeID')))
	except:
		return HttpResponse("Reserved time not found.", status = 400)
	
	# 如果预约已经结束就不能删除
	if (usedTime.endTime < datetime.datetime.now()):
		return HttpResponse("Can't cancel a past reservation.", status = 400)
	
	# 判断权限
	if (usedTime.user != request.user):
		return HttpResponse("Permission denied.", status = 400)
	
	usedTime.delete()
	return HttpResponse('Cancel successfully')
	
	

	
