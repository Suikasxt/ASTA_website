from database.models import User, Team
import json

def userToDict(user, detail = False):
	result = {}
	if detail:
		result['id'] = user.id
		result['username'] = user.username
		result['email'] = user.email
		result['name'] = user.name
		result['className'] = user.className
	else:
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
			result['members'].append(userToDict(member))
	
	return result
	
def teamToJson(team, detail = False):
	return json.dumps(teamToDict(team, detail))
	

def getTeamByUserContest(username, contestId):
	return User.objects.get(username = username).belong.filter(contest__id = contestId)