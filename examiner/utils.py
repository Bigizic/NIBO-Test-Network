"""A class that contains get, delete and check if exist operations on the
examiner database
"""
from .models import ExaminerModel
import bcrypt
from typing import Union

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