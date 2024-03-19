from base_model.models import BaseModel
from django.db import models
from educator.utils import EducatorOperations


class ExamModel(BaseModel, models.Model):
    """ Exam database
    """
    exam_title = models.CharField(max_length=300)
    admin_id = models.CharField(max_length=300)
    exam_description = models.CharField(max_length=700, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    duration = models.IntegerField()  # Duration in minutes
    number_of_students = models.IntegerField(default=0)
    number_of_questions = models.IntegerField(default=0)
    grade = models.IntegerField()  # Exam overall weight
    # active, inactive
    status = models.CharField(default='inactive', max_length=20)
    time_limit = models.IntegerField(null=True)  # 20mins 

    class Meta:
        db_table = 'exams'

    def __init__(self, *args, **kwargs):
        """ Constructor """
        super().__init__(*args, **kwargs)

    def __str__(self) -> str:
        """String representation of exam model
        Return:
            - str representation for easy viewing
        """
        start_format = self.start_date.strftime('%d %b %Y at %H:%M')
        end_format = self.end_date.strftime('%d %b %Y at %H:%M')
        formated_data = {
            'description': self.exam_description,
            'exam_overall_weight': self.grade,
            'date_created': self.created_at.strftime('%d %b %Y at %H:%M'),
            'exam duration': f'{self.duration} mins',
            'status': self.status,
            'date_interval': f'starts {start_format} to end {end_format}',
            'student_allowed_time': self.time_limit,
        }
        examiner_id = EducatorOperations().get(self.admin_id)
        formated_title = f'{self.exam_title} Created by: '
        return "{} {} {}".format(formated_title,
                                 examiner_id['fullname'],
                                 formated_data)
