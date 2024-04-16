#!/usr/bin/env python3
"""A model that handles exam operations like delete, find, get, search
"""

from .models import ExamModel
from typing import Union


class ExamOperations():
    """Implementation
    """

    def __init__(self):
        pass

    def exists(self, data) -> Union[ExamModel, bool]:
        """Checks if an exam exist by comparing data
        to an exact match in the database
        Returns:
            - True if there's an exact match
            - False Otherwise
        """
        exists = ExamModel.objects.filter(**data)
        return exists if exists else False

    def delete_exam(self, exam_id) -> bool:
        """Deletes an exam given it's id
        """
        fetch_exam = ExamModel.objects.get(pk=exam_id)
        if self.exists(fetch_exam.to_dict()):
            fetch_exam.delete()
            return True
        return False

    def fetch_exam_by_id(self, exam_id: str) -> ExamModel:
        """Retrieves an exam by pk id
        """
        fetch = ExamModel.objects.get(pk=exam_id)
        return fetch if fetch else None

    def edit_exam(self, exam_id: str, new_data: dict) -> bool:
        """Edits an exam given it's id and new fields to update
        """
        fetch = self.fetch_exam_by_id(exam_id)
        fetch_exam = fetch.to_dict()
        updated = False
        if fetch_exam:
            """ compare current database records to new_data and find which
            field needs to be updated
            parameters:
                - new data keys = k
                - new data values = v
                - fetch exam keys = keys
                - fetch exam values = vals
            """
            for k, v in new_data.items():
                for keys, vals in fetch_exam.items():
                    if k == keys and v != vals:
                        setattr(fetch, k, v)
                        updated = True
            fetch.save()
        return updated
