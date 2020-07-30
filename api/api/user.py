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
	if (request.GET == None or request.GET.get('username') == None):
		if (request.user):
			return HttpResponse(tools.userToJson(request.user), content_type = 'application/json', status = 200)
		else:
			return HttpResponse("Data missing.", status = 400)
	
	user = User.objects.filter(username = username)
	if (len(user) == 1):
		return HttpResponse("Log in successfully.", status = 200)
	else:
		return HttpResponse("User not found.", status = 400)

def logout(request):
	try:
		logout(request)
	except:
		return HttpResponse("Failed loging out.", status = 400)
	else:
		return HttpResponse("Log out successfully.", status = 200)