"""A class that contains get, delete and check if exist operations on the
educator database
"""
from .models import EducatorModel
import bcrypt
from datetime import datetime
from dateutil.parser import isoparse
from django.core.serializers import serialize
import json
from typing import Union, List
import uuid


class EducatorOperations():
    """ Implementation """

    def __init__(self):
        pass

    def get(self, educator_id: str) -> EducatorModel:
        """gets an educator via id from the educator database
        Returns:
            - educator object
        """
        obj = EducatorModel.objects.get(pk=educator_id)
        return obj.to_dict() if obj else None

    def delete(self, educator_id: str) -> True:
        """Deletes an educator if there's a match in the database
        Returns:
            - True if examienr has been deleted else false
        """
        if (self.get(educator_id)):
            EducatorModel.objects.filter(pk=educator_id).delete()
            return True
        return False

    def exist(self, email: str) -> Union[EducatorModel, bool]:
        """ Checks if an educator exists by both details
        Returns:
            - Bool
        """
        if email:
            exists = EducatorModel.objects.filter(email=email).first()
            return exists.to_dict() if exists else False
        return False

    def update(self, model, **kwargs):
        """Updates an educator model based on the key word arguments
        """
        allowed_args = [
            'password',
            'logout_time',
            'login_time',
        ]
        pk = model['id']
        try:
            ins = EducatorModel.objects.get(pk=pk)
        except EducatorModel.DoesNotExist:
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
            ins = EducatorModel.objects.get(pk=pk)
        except EducatorModel.DoesNotExist:
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

    def get_exams(self, educator_id: str) -> List[dict]:
        """ Fetch exams based on decrypted educator id
        """
        # Exam model declaration
        from exams.models import ExamModel

        exam_obj = ExamModel.objects.filter(admin_id=educator_id)
        someData = serialize('json', exam_obj)
        someData = json.loads(someData)
        new_list = []
        upcoming_exam_count = 0
        active_exam_count = 0
        new_list_len = 0
        for items in someData:
            ids = items['pk']
            fields = items['fields']
            fields['id'] = ids
            fields['start_date'] = isoparse(fields['start_date'])
            fields['end_date'] = isoparse(fields['end_date'])
            fields['educator_name'] = self.get(fields['admin_id'])['fullname']
            current_date = datetime.now(fields['start_date'].tzinfo).date()
            if fields['start_date'].date() >= current_date:
                fields['current_date'] = current_date
                upcoming_exam_count += 1
            if fields['status'] == 'active':
                active_exam_count += 1
            new_list.append({k: v for k, v in fields.items()})
            new_list_len = len(new_list)
        new_list.append(upcoming_exam_count)
        new_list.append({'active_exam_count': active_exam_count})
        new_list.append({'f_exam_count': new_list_len - upcoming_exam_count})

        return new_list if exam_obj else None
