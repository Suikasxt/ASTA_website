from django.db import models
from django.contrib.auth.models import AbstractUser
import django.utils.timezone as timezone

# Create your models here.
class User(AbstractUser):
	avatar = models.ImageField(upload_to='avatars', default = 'avatars/default.png')
	id = models.IntegerField(primary_key=True)
	email = models.CharField(max_length = 60, default = '')
	name = models.CharField(max_length = 20, default = '')
	className = models.CharField(max_length = 10, default = '')
class Token(models.Model):
	email = models.CharField(max_length = 60, default = '', primary_key=True)
	key = models.CharField(max_length = 1024, default = '')
	updateTime = models.DateTimeField(default = timezone.now)

class Contest(models.Model):
	name = models.CharField(max_length = 100, default = '')
	introduction = models.CharField(max_length = 1024, default = '')
	detail = models.CharField(max_length = 4096, default = '')
	timestamp = models.DateTimeField(auto_now_add = True)

class Team(models.Model):
	name = models.CharField(max_length = 100, default = '')
	introduction = models.CharField(max_length = 1024, default = '')
	captain = models.ForeignKey(to = User, on_delete = models.SET_NULL, null = True)
	contest = models.ForeignKey(to = Contest, on_delete = models.SET_NULL, null = True)
	members = models.ManyToManyField(to = User, blank = True, through = 'Membership', related_name = 'belong')
	candidates = models.ManyToManyField(to = User, blank = True, through = 'Application', related_name = 'apply')

#描述用户和队伍之间的归属关系、申请情况
class Membership(models.Model):
	user = models.ForeignKey(to = User, on_delete = models.CASCADE, null = True)
	team = models.ForeignKey(to = Team, on_delete = models.CASCADE, null = True)
class Application(models.Model):
	user = models.ForeignKey(to = User, on_delete = models.CASCADE, null = True)
	team = models.ForeignKey(to = Team, on_delete = models.CASCADE, null = True)
	
	
class Tag(models.Model):
	name = models.CharField(max_length = 100, primary_key=True)

class Blog(models.Model):
	title = models.CharField(max_length = 128, default = '')
	author = models.ForeignKey(to = User, on_delete = models.SET_NULL, null = True)
	content = models.CharField(max_length = 9192, default = '')
	timestamp = models.DateTimeField(auto_now_add = True)
	tags = models.ManyToManyField(to = Tag, blank = True)

class Comment(models.Model):
	content = models.CharField(max_length = 1024, default = '')
	timestamp = models.DateTimeField(auto_now_add = True)
	author = models.ForeignKey(to = User, on_delete = models.SET_NULL, null = True)
	blog = models.ForeignKey(to = Blog, on_delete = models.SET_NULL, null = True)