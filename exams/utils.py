#!/usr/bin/env python3
"""A model that handles exam operations like delete, find, get, search
"""

from .models import ExamModel
from datetime import datetime
from dateutil.parser import isoparse
from django.core.serializers import serialize
from educator.utils import EducatorOperations as EDO
import json
from typing import Union, List


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

    def get_exams(self, educator_id: str) -> List[dict]:
        """ Fetch exams based on decrypted educator id
        """
        # Exam model declaration
        from exams.models import ExamModel
        from questions.utils import QuestionOperations as QOP

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
            fields['educator_name'] = EDO().get(fields['admin_id'])['fullname']
            current_date = datetime.now(fields['start_date'].tzinfo).date()
            # ==== update has_question if no questions found for educator ====
            # ==== also update "has_question" to 0 if all question partening to
            # a particular exam has been deleted ====
            if (fields['has_question'] == '1' and not
                QOP().fetch_all_question_by_exam_id(ids)):
                up = self.edit_exam(ids, {'has_question': 0})
                print(up)
            # ==== end ====

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
