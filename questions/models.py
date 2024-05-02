from base_model.models import BaseModel
from django.db import models

class QuestionModel(BaseModel, models.Model):
    """Question model
    """
    admin_id = models.CharField(max_length=100, null=False)
    exam_id = models.CharField(max_length=100, null=False)
    question_text = models.TextField(null=False)
    question_answers = models.TextField(null=False)
    correct_answers = models.TextField(null=False)
    answers_type = models.CharField(max_length=9, null=False)
    # points = models.IntegerField(default=0, null=False)
    upload_path = models.TextField(null=True)
