import os
import csv
import codecs
import zipfile
import hashlib
import json
from api import settings
from django.contrib import admin
from django.http import HttpResponse
from database.models import Team, User, Contest, Blog, Tag, Token, Comment, Membership, Application, RsrvProject, RsrvTimeAvailable, RsrvTimeUsed

def Download_Selected(modeladmin, request, queryset):
	csvPath = settings.MEDIA_ROOT + 'teams.csv'
	csvFile = open(csvPath, 'w', newline='')
	csvWriter = csv.writer(csvFile)
	csvWriter.writerow(('ID', 'TeamName', 'Introduction', 'Username', 'Name', 'Class', 'StudentID', 'Email'))
	for team in queryset:
		csvWriter.writerow((team.id, team.name, team.introduction, team.captain.username, team.captain.name, team.captain.className, team.captain.studentId, team.captain.email))
		for member in team.members.all():
			if member.id!=team.captain.id:
				csvWriter.writerow(('', '', '', member.username, member.name, member.className, member.studentId, member.email))

	csvFile.close()
	
	csvFile = open(csvPath, 'rb')
	respone = HttpResponse(csvFile, content_type='application/octet-stream')
	respone['Content-Disposition'] = 'attachment; filename=teams.csv'
	return respone

Download_Selected.short_description = "Download information selected"

class teamAdmin(admin.ModelAdmin):
	actions = [Download_Selected]
	search_fields = ('selected',)
	
# Register your models here.
admin.site.register(Team, teamAdmin)
admin.site.register(User)
admin.site.register(Contest)
admin.site.register(Blog)
admin.site.register(Tag)
admin.site.register(Token)
admin.site.register(Comment)
admin.site.register(Membership)
admin.site.register(Application)
admin.site.register(RsrvProject)
admin.site.register(RsrvTimeAvailable)
admin.site.register(RsrvTimeUsed)