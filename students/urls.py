from django.contrib import admin
from django.urls import path
from .views import StudentView

urlpatterns = [
    path('', StudentView().homepage, name="student"),
    path('login/', StudentView().login, name="studen_login"),
]