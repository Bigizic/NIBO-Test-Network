from django.urls import path
from .views import QuestionView

urlpatterns = [
    path('create_question/', QuestionView().add_questions, name="create_qestion"),
    
]
