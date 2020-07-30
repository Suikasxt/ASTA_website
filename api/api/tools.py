from database.models import User
import json

def userToJson(user, detail = True):
	result = {}
	if detail:
		result['id'] = user.id
		result['username'] = user.username
		result['name'] = user.name
		result['className'] = user.className
	else:
		result['username'] = user.username
	return json.dumps(result)