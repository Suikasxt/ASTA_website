from django.http import HttpResponse
from django.shortcuts import render, redirect
from database.models import User, Token
from django.contrib import auth
from api import tools, settings
from itsdangerous import URLSafeTimedSerializer as utsr
from django.core.mail import send_mail
import django.utils.timezone as timezone
import datetime
import base64

class TokenCtl:
	def __init__(self, security_key):
		self.security_key = security_key
		self.salt = base64.encodebytes(security_key.encode('utf8'))

	# 生成token
	def generate_validate_token(self, email):
		serializer = utsr(self.security_key)
		return serializer.dumps(email, self.salt)

	# 验证token
	def confirm_validate_token(self, token, expiration=3600):
		serializer = utsr(self.security_key)
		return serializer.loads(token, salt=self.salt, max_age=expiration)
		
token_confirm = TokenCtl(settings.SECRET_KEY)

def sendToken(request):
	if (request.GET and request.GET.get('email')):
		#try:
		email = request.GET.get('email')
		token = token_confirm.generate_validate_token(email)
		
		content = "Your token is:<br/><b>{}</b><br/>Thank you for registering.".format(token)
		send_mail(
			'Welcome to ASTA',
			'Token from ASTA',
			None,
			[email],
			html_message = content,
		)
		
		data = Token.objects.filter(email = email)
		if (len(data) > 0):
			data = data[0]
			data.key = token
			data.updateTime = timezone.now()
			data.save()
		else:
			data = Token(email = email, key = token)
			data.save()
			
		return HttpResponse("Send successfully.", status = 200)
		#except:
		#	return HttpResponse("Failed sending token.", status = 400)
	else:
		return HttpResponse("Email missing.", status = 400)
		
def tokenComfirm(email, token):
	data = Token.objects.filter(email = email, key = token)
	print(email)
	print(token)
	print(data)
	if (len(data) > 0):
		if (data[0].updateTime > timezone.now() - datetime.timedelta(minutes=30)):
			return True
	return False

	
def register(request):
	if (request.POST == None):
		return HttpResponse("Only POST is allowed.", status = 400)
	if (request.POST.get('email') == None):
		return HttpResponse("Email missing.", status = 400)
	if (request.POST.get('username') == None):
		return HttpResponse("Username missing.", status = 400)
	if (request.POST.get('password') == None):
		return HttpResponse("Password missing.", status = 400)
	if (request.POST.get('token') == None):
		return HttpResponse("Token missing.", status = 400)
	
	studentId = 0
	if (request.POST.get('studentId')):
		try:
			studentId = int(request.POST.get('studentId'))
		except:
			return HttpResponse("ID should be an integer.", status = 400)
			
	className = ''
	if (request.POST.get('className')):
		className = request.POST.get('className')
	name = ''
	if (request.POST.get('name')):
		name = request.POST.get('name')
		
		
	email = request.POST.get('email')
	username = request.POST.get('username')
	password = request.POST.get('password')
	token = request.POST.get('token')
	
	if (not tokenComfirm(email, token)):
		return HttpResponse("Token error.", status = 400)
	if (len(User.objects.filter(email = email)) > 0):
		return HttpResponse("Email exists.", status = 400)
	if (len(User.objects.filter(username = username)) > 0):
		return HttpResponse("Username exists.", status = 400)
	
	user = User.objects.create_user(username=username, password=password, email = email, studentId = studentId, name = name, className = className)
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
		response = HttpResponse(tools.userToJson(user[0]), content_type = 'application/json', status = 200)
		response['Cache-Control'] = 'public, max-age=600'
		return response
	else:
		return HttpResponse("User not found.", status = 400)

def logout(request):
	try:
		logout(request)
	except:
		return HttpResponse("Failed loging out.", status = 400)
	else:
		response = HttpResponse("Log out successfully.", status = 200)
		response.delete_cookie('sessionid')
		return response
		
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
		return HttpResponse('media/' + str(user.avatar), status = 200)
		
	username = user.username
	name = user.name
	className = user.className
	studentId = user.studentId
	if (request.POST and request.POST.get('username') != None and request.POST.get('username') != user.username):
		tmp = User.objects.filter(username = request.POST.get('username'))
		if (len(tmp) > 0):
			return HttpResponse("username already exists.", status = 400)
		username = request.POST.get('username')
	if (request.POST and request.POST.get('name') != None):
		name = request.POST.get('name')
	if (request.POST and request.POST.get('className') != None):
		className = request.POST.get('className')
	if (request.POST and request.POST.get('studentId') != None):
		studentId = int(request.POST.get('studentId'))
	user.username = username
	user.name = name
	user.className = className
	user.studentId = studentId
	user.save()
		
		
	
	return HttpResponse("Modify successfully.", status = 200)

def resetPassword(request):
	if (request.POST == None):
		return HttpResponse("Only POST is allowed.", status = 400)
	if (request.POST.get('email') == None):
		return HttpResponse("Email missing.", status = 400)
	if (request.POST.get('password') == None):
		return HttpResponse("Password missing.", status = 400)
	if (request.POST.get('token') == None):
		return HttpResponse("Token missing.", status = 400)
	email = request.POST.get('email')
	password = request.POST.get('password')
	token = request.POST.get('token')
	
	if (tokenComfirm(email, token)):
		user = User.objects.filter(email = email)
		if (len(user) > 0):
			user[0].set_password(password)
			user[0].save()
			return HttpResponse("Modify successfully.", status = 200)
		else:
			return HttpResponse("User not found.", status = 400)
	else:
		return HttpResponse("Token error.", status = 400)