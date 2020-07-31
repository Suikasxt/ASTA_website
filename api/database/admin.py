from django.contrib import admin
from database.models import Team, User, Contest, Blog, Tag

# Register your models here.
admin.site.register(Team)
admin.site.register(User)
admin.site.register(Contest)
admin.site.register(Blog)
admin.site.register(Tag)