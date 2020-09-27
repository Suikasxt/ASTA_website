from django.http import HttpResponse
from django.shortcuts import render, redirect
from database.models import Contest, Team, Tag, Blog
from django.contrib import auth
from api import tools
import json
import datetime

def list(request):
	#比赛列表，没有任何限制
	list = Contest.objects.all().order_by('-timestamp')
	result = []
	for item in list:
		result.append({	'id': item.id,\
				'name': item.name,\
				'introduction': item.introduction,\
				'time': item.timestamp.strftime('%Y-%m-%d'),\
				'register': datetime.datetime.now() <= item.registerTimeUp })
	return HttpResponse(json.dumps(result), content_type = 'application/json')

def detail(request):
	#根据id反馈比赛信息
	if (request.GET == None or request.GET.get('id') == None):
		return HttpResponse("ID missing.", status = 400)
	id = request.GET.get('id')
	list = Contest.objects.filter(id = id)
	if (len(list) == 0):
		return HttpResponse("Contest not found.", status = 400)
	item = list[0]
	result = {	'name': item.name,\
			'detail': item.detail,\
			'nofMember': item.limitOfMember,\
			'registerTime': item.registerTimeUp.strftime('%Y-%m-%d'),}
	
	return HttpResponse(json.dumps(result), content_type = 'application/json')