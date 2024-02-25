from django.contrib import admin
from django.urls import path
from .views import ExaminerView

urlpatterns = [
    path('', ExaminerView().homepage, name="examiner_homepage"),
    path('create_account/', ExaminerView().create_account, name="create_admin_account"),
    path('login/', ExaminerView().login, name="admin_login"),
    path('dashboard/', ExaminerView().dashboard_helper, name="examiner_dashboard_helper"),
    path('dashboard/<examiner_id>/', ExaminerView().dashboard, name="examiner_dashboard"),
    path('create_student/', ExaminerView().create_student, name="examiner_create_student"),
    path('logout', ExaminerView().logout, name="examiner_logout")
]