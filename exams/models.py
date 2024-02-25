from base_model.models import BaseModel
from django.db import models
from examiner.utils import ExaminerOperations


class ExamModel(BaseModel, models.Model):
    """ Exam database
    """
    exam_title = models.CharField(max_length=300)
    admin_id = models.CharField(max_length=300)
    exam_description = models.CharField(max_length=3000, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    duration = models.IntegerField()  # Duration in minutes
    number_of_students = models.IntegerField(default=0)
    number_of_questions = models.IntegerField(default=0)
    grade = models.IntegerField()  # Exam overall weight
    # active, inactive
    status = models.CharField(default='inactive', max_length=20)
    exam_session = models.CharField(max_length=10)  # 2020/2021

    class Meta:
        db_table = 'exams'

    def __init__(self, *args, **kwargs):
        """ Constructor """
        super().__init__(*args, **kwargs)

    def __str__(self) -> str:
        """String representation of exam model
        Return:
            - A string representation like this:
                - [Exam: Advanced Mathematics Created by: Mr Marcus Badmus]
                {
                    session : 2023/2024,
                    grade_level: year 1,
                    date created: 20 Feb 2024 at 13:45,
                    duration: 120 mins,
                    status: active,
                    date_interval: starts 24 feb 2024 to end 24 feb 2024
                }
        """
        start_format = self.start_date.strftime('%d %b %Y at %H:%M')
        end_format = self.end_date.strftime('%d %b %Y at %H:%M')
        formated_data = {
            'session': self.exam_session,
            'exam_overall_weight': self.grade,
            'date_created': self.created_at.strftime('%d %b %Y at %H:%M'),
            'exam duration': f'{self.duration} mins',
            'status': self.status,
            'date_interval': f'starts {start_format} to end {end_format}'
        }
        examiner_id = ExaminerOperations.get(self.admin_id)
        formated_title = f'Exam: {self.exam_title} Created by: '
        return f'[{formated_title} {examiner_id.fullname}] {formated_data}'