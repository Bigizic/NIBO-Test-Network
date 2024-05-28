"""
handles question operations
"""
from .models import QuestionModel

class QuestionOperations():
    """Implementation
    """

    def get_question(self, question_id: str) -> dict:
        """Retrieves a question when the question id is provided
        - @params:
            -   question_id: id of the quedstion been searched
        - Return:
            - question object if found
        """
        obj = QuestionModel.objects.get(pk=question_id)
        return obj.to_dict() if obj else None

    def fetch_all_exam_by_educator_id(self, educator_id) -> dict:
        """Retrives questions relating to an educator
        - @params:
            -   educator_id: id of the educator being searched
        - Return:
            - Questions relating to an educator else None
        """
        return QuestionModel.objects.filter(admin_id=educator_id)
