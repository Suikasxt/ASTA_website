from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
	id = models.IntegerField(primary_key=True)
	name = models.CharField(max_length = 20, default = '')
	className = models.CharField(max_length = 10, default = '')

class Contest:
	name = models.CharField(max_length = 100, default = '')
	introduction = models.CharField(max_length = 4096, default = '')
	id = models.CharField(max_length = 100, default = '')

class Team:
	name = models.CharField(max_length = 100, default = '')
	introduction = models.CharField(max_length = 1024, default = '')
	captain = models.ForeignKey(to = User, on_delete = models.SET_NULL, null = True)

#描述用户和队伍之间的归属关系
class Belong:
	user = models.ForeignKey(to = User, on_delete = models.SET_NULL, null = True)
	team = models.ForeignKey(to = Team, on_delete = models.SET_NULL, null = True)
	successful = models.BooleanField(default = False)#为否表示任处于申请状态

class Notice:
	