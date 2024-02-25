from base_model.models import BaseModel
from examiner.models import ExaminerModel
import bcrypt
from django.db import models


class StudentModel(BaseModel, models.Model):
    """ Student database """
    fullname = models.CharField(max_length=300)
    student_number = models.CharField(max_length=300)
    password = models.CharField(max_length=300)
    grade_level = models.CharField(max_length=300, default=None, null=True)
    admin_id = models.CharField(max_length=300)
    exam_numbers = models.JSONField(null=True)
    number_of_exams_registered = models.IntegerField(default=0)
    login_time = models.DateTimeField(null=True)
    logout_time = models.DateTimeField(null=True)

    class Meta:
        db_table = 'students'

    def __init__(self, *args, **kwargs):
        """ Constructor """
        super().__init__(*args, **kwargs)

    """def __setattr__(self, attribute: str, value: str):
        Sets sepecific attributes before saving in the database
        
        if attribute == "password":
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(value.encode(), salt).decode()
            super().__setattr__(attribute, hashed_password)
        else:
            super().__setattr__(attribute, value)"""

    def __str__(self) -> str:
        """String representation of student model
        Return:
            - A string representation like this:
                - [Student: Wale Badmus] {
                    'grade_level': year 2,
                    'exam_numbers': [dewdffef-121323-123123, 1232123-123123],
                    'number_of_exams_registered': 3,
                    'login_time': 12-02-2024-14:15, 12-02-2024-15:45,
                    'logout_time': 12-02-2024-14:30, 12-02-2024-16:00,
                }
        """
        data = {
            'grade_level': self.grade_level,
            'exam_numbers': self.exam_numbers,
            'number_of_exams_registered': self.number_of_exams_registered,
            'login_time': self.login_time.strftime('%a %b %Y at %H:%M'),
            'logout_time': self.logout_time.strftime('%a %b %Y at %H:%M'),
        }
        return f"[Student: {self.fullname}]{data}"