"""A class that contains get, delete and check if exist operations on the
examiner database
"""
from .models import ExaminerModel
import bcrypt
from datetime import datetime
from typing import Union
import uuid

class ExaminerOperations():
    """ Implementation """

    def __init__(self):
        pass

    def get(self, examiner_id: str) -> ExaminerModel:
        """gets an examiner via id from the examiner database
        Returns:
            - Examiner object
        """
        obj = ExaminerModel.objects.get(pk=examiner_id)
        return obj.to_dict() if obj else None

    def delete(self, examiner_id: str) -> True:
        """Deletes an examiner if there's a match in the database
        Returns:
            - True if examienr has been deleted else false
        """
        if (self.get(examiner_id)):
            ExaminerModel.objects.filter(pk=examiner_id).delete()
            return True
        return False

    def exist(self, username: str) -> Union[ExaminerModel, bool]:
        """ Checks if an examiner exists by both details
        Returns:
            - Bool
        """
        if username:
            exists = ExaminerModel.objects.filter(username=username).first()
            return exists.to_dict() if exists else False
        return False

    def update(self, model, **kwargs):
        """Updates an Examiner model based on the key word arguments
        """
        allowed_args = [
            'password',
            'logout_time',
            'login_time',
        ]
        pk = model['id']
        try:
            ins = ExaminerModel.objects.get(pk=pk)
        except ExaminerModel.DoesNotExist:
            return False
        for k, v in kwargs.items():
            if k in allowed_args:
                setattr(ins, k, v)
        ins.save()
        return True

    def update_records(self, model, command):
        """Update certain records """
        pk = model['id']
        try:
            ins = ExaminerModel.objects.get(pk=pk)
        except ExaminerModel.DoesNotExist:
            return False
        logout_time = model.get('logout_time')
        login_time = model.get('login_time')

        if logout_time and logout_time is not None:
            # handles logout
            if command == 'logout':
                logout_records = model['logout_records']
                if logout_records:
                    logout_records += ", {}".format(str(logout_time))
                else:
                    logout_records = str(logout_time)
                setattr(ins, 'logout_records', logout_records)
        if login_time and login_time is not None:
            # handles login
            if command == 'login':
                login_records = model['login_records']
                if login_records:
                    login_records += ", {}".format(str(login_time))
                else:
                    login_records = str(login_time)
                setattr(ins, 'login_records', login_records)
        ins.save()
        return True

    def setpassword(self, value: str) -> str:
        """ return a bcrypt encoded hash of a value
        """
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(value.encode(), salt).decode()
        return hashed_password

    def compare_password(self, user_password: str, db_password: str) -> bool:
        """Compares clients password with db password
        Returns:
            - bool
        """
        return bcrypt.checkpw(user_password.encode(), db_password.encode())