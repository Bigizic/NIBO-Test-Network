from base_model.models import BaseModel
import bcrypt
from django.db import models
import uuid


class ExaminerModel(BaseModel, models.Model):
    """ Examiner database
    """
    fullname = models.CharField(max_length=300)
    username = models.CharField(max_length=300)
    password = models.CharField(max_length=300)
    two_factor = models.CharField(max_length=300, default=None, null=True)
    login_time = models.DateTimeField()
    logout_time = models.DateTimeField(default=None, null=True)
    logout_records = models.TextField(null=True)
    login_records = models.TextField(null=True)

    class Meta:
        db_table = 'examiner'

    def __init__(self, *args, **kwargs):
        """ Constructor """
        super().__init__(*args, **kwargs)

    def __str__(self) -> str:
        """String representation of examiner model
        Return:
            - A string representation like this:
                - Examiner: Mr Wale Badmus last login: 20 Feb 2024 at 13:45
        """
        formatted_login_time = self.login_time.strftime('%d %b %Y at %H:%M')
        formatted_name = self.fullname.replace('+', ' ')
        return f'Examiner: {formatted_name} >>>> last login: {formatted_login_time}'