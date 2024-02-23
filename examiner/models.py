from base_model.models import BaseModel
import bcrypt
from django.db import models
import uuid


class ExaminerModel(BaseModel, models.Model):
    """ Examiner database
    """
    fullname = models.CharField(max_length=300)
    username = models.CharField(max_length=200)
    password = models.CharField(max_length=300)
    two_factor = models.CharField(max_length=200, default=None, null=True)
    login_time = models.TextField()
    logout_time = models.TextField(default=None, null=True)

    class Meta:
        db_table = 'examiner'

    def __init__(self, *args, **kwargs):
        """ Constructor """
        super().__init__(*args, **kwargs)

    def __setattr__(self, attribute: str, value: str):
        """Sets sepecific attributes before saving in the database
        """
        if attribute == "password":
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(value.encode(), salt).decode()
            super().__setattr__(attribute, hashed_password)
        else:
            super().__setattr__(attribute, value)

    def __str__(self) -> str:
        """String representation of examiner model
        Return:
            - A string representation like this:
                - Examiner: Mr Wale Badmus last login: Sat Feb 2024 at 13:45
        """
        return f'Examiner: {self.fullname} >>>> last login: {self.login_time}'