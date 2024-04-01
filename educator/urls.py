from django.contrib import admin
from django.urls import path
from .views import EducatorView
from base_model.views import error_404, error_500
from django.conf.urls import handler404, handler500

handler404 = error_404
handler500 = error_500


urlpatterns = [
    path('', EducatorView().signin_signup, name="educator_signin_signup"),

    path('create_account/', EducatorView().create_account,
         name="create_educator_account"),

    path('login/', EducatorView().login, name="educator_login"),

    path('dashboard/', EducatorView().dashboard_helper,
         name="educator_dashboard_helper"),

    path('dashboard/<educator_id>/', EducatorView().dashboard,
         name="educator_dashboard"),

    path('student/<educator_id>/', EducatorView().students,
         name="educator_students"),

    path('create_student/<educator_id>/', EducatorView().create_student,
         name="educator_create_student"),

    path('exam/<educator_id>/', EducatorView().exams, name="educator_exams"),

    path('create_exam/<educator_id>/', EducatorView().create_exam,
         name="educator_create_exam"),

     path('delete_exam/<exam_id>/', EducatorView().delete_exam,
          name="educator_delete_exam"),

     path('<educator_id>/edit_exam/<exam_id>/', EducatorView().edit_exam,
          name="educator_edit_exam"),

    path('logout', EducatorView().logout, name="educator_logout"),
]
