from django.http import HttpResponse
from django.shortcuts import render, redirect
from database.models import Contest, Team, Tag, Blog
from django.contrib import auth
from api import tools
import json

def list(request):
	if (request.GET and request.GET.get('tag')):
		try:
			list = Tag.objects.get(name = request.GET.get('tag')).blog_set.all()
		except:
			return HttpResponse("Data error.", status = 400)
	else:
		list = Blog.objects.all().order_by('-timestamp')
	result = []
	for item in list:
		result.append({'id': item.id, 'title': item.title, 'author': item.author.name, 'time': item.timestamp.strftime('%Y-%m-%d')})
	return HttpResponse(json.dumps(result), content_type = 'application/json')

def detail(request):
	if (request.GET == None or request.GET.get('id') == None):
		return HttpResponse("ID missing.", status = 400)
	id = request.GET.get('id')
	list = Blog.objects.filter(id = id)
	if (len(list) == 0):
		return HttpResponse("Blog not found.", status = 400)
	item = list[0]
	result = { 'id': item.id, 'title': item.title, 'content': item.content, 'author': item.author.name, 'time': item.timestamp.strftime('%Y-%m-%d') }
	return HttpResponse(json.dumps(result), content_type = 'application/json')