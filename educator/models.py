from base_model.models import BaseModel
import bcrypt
from django.db import models
import uuid


class EducatorModel(BaseModel, models.Model):
    """ Educator database
    """
    fullname = models.CharField(max_length=500)
    email = models.CharField(max_length=500)
    password = models.CharField(max_length=500)
    two_factor = models.CharField(max_length=300, default=None, null=True)
    login_time = models.DateTimeField()
    logout_time = models.DateTimeField(default=None, null=True)
    logout_records = models.TextField(null=True)
    login_records = models.TextField(null=True)

    class Meta:
        db_table = 'educator'

    def __init__(self, *args, **kwargs):
        """ Constructor """
        super().__init__(*args, **kwargs)

    def __str__(self) -> str:
        """String representation of examiner model
        Return:
            - A string representation like this:
                - Educator: Mr Wale Badmus last login: 20 Feb 2024 at 13:45
        """
        formatted_login_time = self.login_time.strftime('%d %b %Y at %H:%M')
        formatted_name = self.fullname.replace('+', ' ')
        return 'Educator: {} >>>> last login: {}'.format(
               formatted_name, formatted_login_time)
