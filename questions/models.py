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

    def __str__(self) -> dict:
        """String representation of question model
        Return:
            - A string representation like this:
                - Question: a question\n
                    - Exam name: Mathematics 103\n
                    - Admin name: Badmus\n
                    - no of answers: 4\n
                    - no of correct answer: 1\n    upload_path = models.TextField(null=True)

                    - answers type: radio or checkbox\n
                    - has local storage: no\n
        """
        admin_name = EducatorOperations().get(self.admin_id.split("'")[0])
        exam_name = ExamOperations().fetch_exam_by_id(
                    self.exam_id.split("'")[1]).to_dict()
        
        return {
            'Question': self.question_text,
            'Exam_name': exam_name['exam_title'],
            'Admin_name': admin_name['fullname'],
            'No_of_answers': change_str_to_list(self.question_answers[1:-1]),
            'No_of_correct_answer': change_str_to_list(self.correct_answers[1:-1]),
            'Answer_type': self.answers_type,
            'Has_local_storage': True if self.upload_path else False,
        }
