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
