from django.http import HttpResponse
from django.shortcuts import render, redirect
from database.models import User
from django.contrib import auth
from api import tools

def register(request):
	if (request.POST == None):
		return HttpResponse("Only POST is allowed.", status = 400)
	if (request.POST.get('email') == None):
		return HttpResponse("Email missing.", status = 400)
	if (request.POST.get('username') == None):
		return HttpResponse("Username missing.", status = 400)
	if (request.POST.get('password') == None):
		return HttpResponse("Password missing.", status = 400)
	if (request.POST.get('id') == None):
		return HttpResponse("ID missing.", status = 400)
	if (request.POST.get('name') == None):
		return HttpResponse("Name missing.", status = 400)
	if (request.POST.get('className') == None):
		return HttpResponse("ClassName missing.", status = 400)
	
	try:
		id = int(request.POST.get('id'))
	except:
		return HttpResponse("ID should be an integer.", status = 400)
		
		
	email = request.POST.get('email')
	username = request.POST.get('username')
	password = request.POST.get('password')
	name = request.POST.get('name')
	className = request.POST.get('className')
	if (len(User.objects.filter(email = email)) > 0):
		return HttpResponse("Email exists.", status = 400)
	if (len(User.objects.filter(username = username)) > 0):
		return HttpResponse("Username exists.", status = 400)
	if (len(User.objects.filter(id = id)) > 0):
		return HttpResponse("ID exists.", status = 400)
	
	user = User.objects.create_user(username=username, password=password, email = email, id = id, name = name, className = className)
	return HttpResponse("Register successfully.")



def login(request):
	if (request.POST == None):
		return HttpResponse("Only POST is allowed.", status = 400)
	if (request.POST.get('username') == None):
		return HttpResponse("Username missing.", status = 400)
	if (request.POST.get('password') == None):
		return HttpResponse("Password missing.", status = 400)
		
	username = request.POST.get('username')
	password = request.POST.get('password')
	user = auth.authenticate(username=username, password=password)
	if user:
		auth.login(request, user)
		return HttpResponse("Login successfully.")
	else:
		return HttpResponse("Invalid username or password.", status = 400)
		
			
def getInfo(request):
	if (request.GET and request.GET.get('username')):
		username = request.GET.get('username')
	else:
		if (request.user.is_authenticated):
			return HttpResponse(tools.userToJson(request.user, True), content_type = 'application/json', status = 200)
		else:
			return HttpResponse("Data missing.", status = 400)
			
	user = User.objects.filter(username = username)
	if (len(user) == 1):
		return HttpResponse(tools.userToJson(user[0]), content_type = 'application/json', status = 200)
	else:
		return HttpResponse("User not found.", status = 400)

def logout(request):
	try:
		logout(request)
	except:
		return HttpResponse("Failed loging out.", status = 400)
	else:
		return HttpResponse("Log out successfully.", status = 200)
		
def modify(request):
	if (not request.user.is_authenticated):
		return HttpResponse("Please log in.", status = 400)
	
	user = request.user
	if (request.FILES and request.FILES.get('avatar')):
		avatar = request.FILES.get('avatar')
		if (avatar.size >= 2*1024*1024):
			return HttpResponse("Avatar should be less than 2MB.", status = 400)
		user.avatar = avatar
		user.save()
	
	return HttpResponse(tools.userToDict(user)['avatar'])
	