from django.http import HttpResponse
from django.shortcuts import render, redirect
from database.models import Contest, Team, Tag, Blog, Comment
from django.contrib import auth
from api import tools
import json

def list(request):
	if (request.GET and request.GET.get('tag')):
		try:
			Query = Tag.objects.get(name = request.GET.get('tag')).blog_set
		except:
			return HttpResponse(json.dumps([]), content_type = 'application/json')
	else:
		Query = Blog.objects
		
	if (request.GET and request.GET.get('author')):
		Query = Query.filter(author__username = request.GET['author'])
	
	list = Query.all().order_by('-timestamp')
	result = []
	for item in list:
		result.append(tools.blogToDict(item))
	return HttpResponse(json.dumps(result), content_type = 'application/json')

def detail(request):
	if (request.GET == None or request.GET.get('id') == None):
		return HttpResponse("ID missing.", status = 400)
	id = request.GET.get('id')
	try:
		item = Blog.objects.get(id = id)
	except:
		return HttpResponse("Blog not found.", status = 400)
	return HttpResponse(json.dumps(tools.blogToDict(item)), content_type = 'application/json')

def edit(request):
	if (not request.user.is_authenticated):
		return HttpResponse("Please log in.", status = 400)
	if (request.POST == None):
		return HttpResponse("Only POST is allowed.", status = 400)
		
	if (not request.POST.get('content')):
		return HttpResponse("Content missing.", status = 400)
	if (not request.POST.get('title')):
		return HttpResponse("Title missing.", status = 400)
	if (request.POST.get('tags') == None):
		return HttpResponse("Tags missing.", status = 400)
	
	title = request.POST.get('title')
	content = request.POST.get('content')
	tags = json.loads(request.POST.get('tags'))
	if (request.POST.get('id') == None):
		blog = Blog(author = request.user)
		blog.save()
	else:
		try:
			blog = Blog.objects.filter(id = int(request.POST.get('id')))[0]
		except:
			return HttpResponse("Blog not found.", status = 400)
	
	if (blog.author != request.user):
		return HttpResponse("Permission denied.", status = 400)
	
	blog.title = title
	blog.content = content
	blog.tags.clear()
	blog.save()
	for tagText in tags:
		tagFind = Tag.objects.filter(name = tagText)
		if len(tagFind) > 0:
			tag = tagFind[0]
		else:
			tag = Tag(name = tagText)
			tag.save()
		blog.tags.add(tag)
		
	return HttpResponse("Publish successfully.", status = 200)

def delete(request):
	if (not request.user.is_authenticated):
		return HttpResponse("Please log in.", status = 400)
	if (request.POST == None):
		return HttpResponse("Only POST is allowed.", status = 400)
	
	try:
		blog = Blog.objects.filter(id = int(request.POST.get('id')))[0]
	except:
		return HttpResponse("Blog not found.", status = 400)
	
	if (blog.author != request.user):
		return HttpResponse("Permission denied.", status = 400)
	
	blog.delete()
	return HttpResponse("Delete successfully.", status = 200)
	


def commentList(request):
	list = []
	if (request.GET and request.GET.get('blog')):
		try:
			blog = Blog.objects.filter(id = int(request.GET.get('blog')))[0]
		except:
			return HttpResponse("Blog not found.", status = 400)
		list = blog.comment_set.all()
	else:
		list = Comment.objects.all()
	result = []
	for item in list:
		result.append({'author': item.author.username, 'content': item.content, 'time': item.timestamp.strftime('%Y-%m-%d %H:%M:%S'), 'avatar': 'media/' + str(item.author.avatar)})
	return HttpResponse(json.dumps(result), content_type = 'application/json')
	
def addComment(request):
	if (not request.user.is_authenticated):
		return HttpResponse("Please log in.", status = 400)
	if (request.POST == None):
		return HttpResponse("Only POST is allowed.", status = 400)
	
	if (not request.POST.get('content')):
		return HttpResponse("Content missing.", status = 400)
	try:
		blog = Blog.objects.filter(id = int(request.POST.get('blog')))[0]
	except:
		return HttpResponse("Blog not found.", status = 400)
		
	Comment(author = request.user, blog = blog, content = request.POST.get('content')).save()
	return HttpResponse("Add successfully.", status = 200)