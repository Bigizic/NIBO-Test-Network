from base_model.models import BaseModel
from educator.utils import EducatorOperations
from exams.utils import ExamOperations
from django.db import models


def change_str_to_list(word: str) -> int:
    """Parse and Changes a string in this format
        [ words ]
    to a list
    Return:
        - lenth of created list
    """
    result = []
    temp = {}
    indict = False
    key = None
    if word[0] == '[' and word[-1] == ']':
        for char in word[1:-1]:
            if char == '{':
                indict = True
                temp = {}
            elif char == '}':
                indict == False
                result.append(temp)
            elif char in ":," and indict:
                continue
            elif indict:
                if key is None:
                    key = char
                else:
                    temp[key] = char
                    key = None
    return len(result)





class QuestionModel(BaseModel, models.Model):
    """Question model
    """
    admin_id = models.CharField(max_length=100, null=False)
    exam_id = models.CharField(max_length=100, null=False)
    question_text = models.TextField(null=False)
    question_answers = models.TextField(null=False)
    correct_answers = models.TextField(null=False)
    answers_type = models.CharField(max_length=9, null=False)
    # points = models.IntegerField(default=0, null=False)    upload_path = models.TextField(null=True)

    upload_path = models.TextField(null=True)

    class Meta:
        db_table = 'questions'

    def __init__(self, *args, **kwargs):
        """ Constructor """
        super().__init__(*args, **kwargs)

    def __str__(self) -> str:
        """String representation of question model
        Return:
            - A string representation of all class attributes
        """
        admin_name = EducatorOperations().get(self.admin_id.split("'")[0])
        exam_name = ExamOperations().fetch_exam_by_id(
                    self.exam_id.split("'")[1]).to_dict()

        mm = self.__dict__.copy()
        del mm['_state']
        return str(mm)
