from database.models import User, Team, Blog, Tag
import json

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

def getTeamByUserContest(username, contestId):
	return User.objects.get(username = username).belong.filter(contest__id = contestId)