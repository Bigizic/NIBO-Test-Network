from django.contrib import admin
from django.urls import path
from .views import ExaminerView
from base_model.views import error_404, error_500
from django.conf.urls import handler404, handler500

handler404 = error_404
handler500 = error_500


urlpatterns = [
    path('', ExaminerView().homepage, name="examiner_homepage"),
    path('create_account/', ExaminerView().create_account, name="create_admin_account"),
    path('login/', ExaminerView().login, name="admin_login"),
    path('dashboard/', ExaminerView().dashboard_helper, name="examiner_dashboard_helper"),
    path('dashboard/<examiner_id>/', ExaminerView().dashboard, name="examiner_dashboard"),
    path('student/<examiner_id>/', ExaminerView().students, name="examiner_students"),
    path('create_student/<examiner_id>/', ExaminerView().create_student, name="examiner_create_student"),
    path('exam/<examiner_id>/', ExaminerView().exams, name="examiner_exams"),
    path('create_exam/<examiner_id>/', ExaminerView().create_exam, name="examiner_create_exam"),
    path('logout', ExaminerView().logout, name="examiner_logout"),
]