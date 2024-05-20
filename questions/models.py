from base_model.models import BaseModel
from educator.utils import EducatorOperations
from exams.utils import ExamOperations
from django.db import models

class QuestionModel(BaseModel, models.Model):
    """Question model
    """
    admin_id = models.CharField(max_length=100, null=False)
    exam_id = models.CharField(max_length=100, null=False)
    question_text = models.TextField(null=False)
    question_answers = models.TextField(null=False)
    correct_answers = models.TextField(null=False)
    answers_type = models.CharField(max_length=9, null=False)
    # points = models.IntegerField(default=0, null=False)
    upload_path = models.TextField(null=True)

    class Meta:
        db_table = 'questions'

    def __init__(self, *args, **kwargs):
        """ Constructor """
        super().__init__(*args, **kwargs)

    def __str__(self) -> str:
        """String representation of question model
        Return:
            - A string representation like this:
                - Question:\n
                    - Exam name: Mathematics 103\n
                    - Admin name: Badmus\n
                    - question: a question\n
                    - no of answers: 4\n
                    - no of correct answer: 1\n
                    - answers type: radio or checkbox\n
                    - has local storage: no\n
        """
        admin_name = EducatorOperations().get(self.admin_id.split("'")[0])
        exam_name = ExamOperations().fetch_exam_by_id(
                    self.exam_id.split("'")[1]).to_dict()
        print(self.question_answers)
        len_no_of_ans = "sm"
        res = 'Question: \n    - Exam name: {}\n    - Admin name: {}\n\
        - Question: {}\n\
        - No of answers:'.format(
            exam_name,
            admin_name,
            self.question_text,
        )
