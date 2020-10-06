from database.models import User, Team, Blog, Tag, RsrvProject, RsrvTimeAvailable, RsrvTimeUsed
import json
import datetime

#一些简单的工具，主要是把类转成字典或者json字符串的工具

def timestamp2datetime(dateTime):
	return datetime.datetime.fromtimestamp(dateTime/1000)
def datetime2timestamp(dateTime):
	return int(dateTime*1000)

def userToDict(user, detail = False):
	result = {}
	if detail:
		result['id'] = user.id
		result['studentId'] = user.studentId
		result['email'] = user.email
		result['name'] = user.name
		result['className'] = user.className
		result['isStaff'] = user.is_staff
		
	result['avatar'] = 'media/' + str(user.avatar)
	result['username'] = user.username
	return result
	
def userToJson(user, detail = False):
	return json.dumps(userToDict(user, detail))
	

def usedTimeToDict(usedTime):
	result = {}
	result['id'] = usedTime.id
	result['startTime'] = datetime2timestamp(usedTime.startTime.timestamp())
	result['endTime'] = datetime2timestamp(usedTime.endTime.timestamp())
	result['user'] = usedTime.user.id
	return result

def avaiTimeToDict(avaiTime):
	result = {}
	result['id'] = avaiTime.id
	result['startTime'] = datetime2timestamp(avaiTime.startTime.timestamp())
	result['endTime'] = datetime2timestamp(avaiTime.endTime.timestamp())
	return result
	
def rsrvProjectToDict(project, detail = False):
	result = {}
	result['id'] = project.id
	result['name'] = project.name
	if detail:
		result['introduction'] = project.intro
	if project.contest:
		result['contest'] = project.contest.id
	return result
	
def teamToDict(team, detail = False):
	result = {'id': team.id, 'name': team.name, 'introduction': team.introduction, 'captain': team.captain.username, 'members': [], 'candidates': []}
	if detail:
		candidateList = team.candidates.all()
		for candidate in candidateList:
			result['candidates'].append(userToDict(candidate, True))
	
	memberList = team.members.all()
	for member in memberList:
		if not member==team.captain:
			result['members'].append(userToDict(member, detail))
	
	return result
	
def teamToJson(team, detail = False):
	return json.dumps(teamToDict(team, detail))
	
def blogToDict(blog):
	result = {}
	result['id'] = blog.id
	result['title'] = blog.title
	result['content'] = blog.content
	result['author'] = blog.author.username
	result['time'] = blog.timestamp.strftime('%Y-%m-%d %H:%M:%S')
	result['tags'] = []
	tags = blog.tags.all()
	for tag in tags:
		result['tags'].append(tag.name)
	return result

def getTeamByUsernameContestid(username, contestID):
	return User.objects.get(username = username).belong.filter(contest__id = contestID)
def getTeamByUserContest(user, contest):
	return user.belong.filter(contest = contest)
