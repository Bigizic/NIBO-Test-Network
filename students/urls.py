from django.contrib import admin
from django.urls import path
from .views import StudentView

urlpatterns = [
    path('', StudentView().login, name="student_login"),
    path('login/', StudentView().login, name="studen_login"),
]