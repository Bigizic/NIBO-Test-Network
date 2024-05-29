from django.urls import path
from .views import QuestionView

urlpatterns = [
    path('create_question/', QuestionView().add_questions, name="create_qestion"),
    path('fetch_question/<exam_id>/<educator_id>',
         QuestionView().fetch_question, name="fetch_questions"),
]
