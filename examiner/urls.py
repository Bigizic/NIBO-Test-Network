from django.contrib import admin
from django.urls import path
from os import environ
from .views import ExaminerView

urlpatterns = [
    path('', ExaminerView().homepage, name="examiner_homepage"),
    path('create_account/', ExaminerView().create_account, name="create_admin_account"),
    path('login/', ExaminerView().login, name="admin_login"),
    path('dashboard/', ExaminerView().dashboard, name="examiner_dashboard"),
]