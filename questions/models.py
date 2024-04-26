from base_model.models import BaseModel
from django.db import models

class QuestionModel(BaseModel, model.Model):
    """Question model
    """
    admin_id = models.CharField(max_length=100)
    exam_id = model.CharField(max_length=100)
    question_text = model.TextField()
    question_answers = model.TextField()
    correct_answers = model.TextField()
    points = models.IntegerField(default=0)
    upload_path = models.TextField()
