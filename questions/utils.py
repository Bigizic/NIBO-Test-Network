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

    def fetch_all_question_by_educator_id(self, educator_id) -> dict:
        """Retrives questions relating to an educator
        - @params:
            -   educator_id: id of the educator being searched
        - Return:
            - Questions relating to an educator else None
        """
        return QuestionModel.objects.filter(admin_id=educator_id)

    def fetch_all_question_by_exam_id(self, exam_id: str) -> QuestionModel:
        """Fetches question relating to an exam
        - @Params:
            - exam_id: id to identify exam
        - Return:
            - Question relating to exam
        """
        if exam_id:
            res = QuestionModel.objects.filter(exam_id=f"['{exam_id}']")
            if len(res) > 0:
                return res
        return None

    def fetch_all_question_by_exam_id_and_educator_id(self, exam_id: str,
        educator_id: str) -> dict:
        """Fetches question relating to an educator and exam
        - @Params:
            - exam_id: id to identify exam
            - educator_id: id to identify educator
        - Return:
            - Questions relating to an educator and exam
        """
        if exam_id and educator_id:
            return QuestionModel.objects.filter(exam_id=f"['{exam_id}']",
                    admin_id=educator_id)
        return None

    def edit_question(self, question_id: str, new_data: dict) -> bool:
        """Edits a question given it's id and key-word parameter to udpate
        - @params:
            - question_id: id to identify question
            - new_data: dictcontaining question attribute and
                new value to be edited
        - Return:
            - True if sucessful otherwise False
        """
        if question_id and kwargs:
            # ==== get question by id ====
            fetch_question = QuestionModel.objects.get(pk=question_id)
            fetched = fetch_question.to_dict()
            updated = False
            if fetched:
                for k, v in new_data.items():
                    for keys, vals in fetched.items():
                        if k == keys and v != vals:
                            setattr(fetch_question, k, v)
                            updated = True
                fetch_question.save()
        return updated

    def delete_question(self, question_id) -> bool:
        """Deletes a question given it's id
        - @params:
            - question_Id: id to identify the question
        - Return:
            - True if deleted otherwise False
        """
        fetch_question = QuestionModel.objects.get(pk=question_id)
        if fetch_question:
            fetch_question.delete()
            return True
        return False
