"""
URL configuration for NIBO_builder project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path, include
from os import environ


if environ.get('ADMIN_ROUTE'):
    ADMIN_ROUTE = '{}/'.format(environ.get('ADMIN_ROUTE'))
else:
    ADMIN_ROUTE = 'educator/'

urlpatterns = [
    path('', include('homepage.urls')),
    path('django_admin', admin.site.urls),
    path(ADMIN_ROUTE, include('educator.urls')),
    path('exam/', include('exams.urls')),
    path('question/', include('questions.urls')),
    path('student/', include('students.urls')),
    path('question/', include('questions.urls')),
]
