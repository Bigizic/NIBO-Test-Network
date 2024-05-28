from django.urls import path
from .views import ExamView


urlpatterns = [
    path('<educator_id>/', ExamView().exams, name="educator_exams"),

    path('create_exam/<educator_id>/', ExamView().create_exam,
         name="educator_create_exam"),

     path('delete_exam/<exam_id>/', ExamView().delete_exam,
          name="educator_delete_exam"),

     path('<educator_id>/edit_exam/<exam_id>/', ExamView().edit_exam,
          name="educator_edit_exam"),
]
