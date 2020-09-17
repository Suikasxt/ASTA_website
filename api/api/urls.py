"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from django.views.static import serve
from django.urls import include
from api import settings
from api import user, contest, blog, team

urlpatterns = [
	url(r'mdeditor/', include('mdeditor.urls')),
	url(r'^media/(?P<path>.*)$', serve, {"document_root": settings.MEDIA_ROOT}),
	url(r'^static/(?P<path>.*)$', serve, {"document_root": settings.STATIC_ROOT}),
	path('admin/', admin.site.urls),
	path('register/', user.register),
	path('login/', user.login),
	path('logout/', user.logout),
	path('user/', user.getInfo),
	path('sendToken/', user.sendToken),
	path('modify/', user.modify),
	path('resetPassword/', user.resetPassword),
	path('contest/', contest.detail),
	path('contest/list/', contest.list),
	path('blog/', blog.detail),
	path('blog/list/', blog.list),
	path('blog/edit/', blog.edit),
	path('blog/delete/', blog.delete),
	path('comment/add/', blog.addComment),
	path('comment/list/', blog.commentList),
	path('team/', team.detail),
	path('team/list/', team.list),
	path('team/admin/', team.admin),
	path('team/apply/', team.apply),
]
