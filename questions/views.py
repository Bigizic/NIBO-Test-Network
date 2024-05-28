from .models import QuestionModel as QM
import base64
from base_model.caching import FIFO as CACHE
from django.shortcuts import render, redirect, reverse
from exams.utils import ExamOperations
import json
import urllib.parse


class QuestionView():
    """Implementation of the question view class and it's methods
    """

    def add_questions(self, request):
        """adds questions
        """
        if request.method == 'POST':
            if request.body:
                educator_id = request.session.get('educator_id')
                url_decoded_data = urllib.parse.unquote(
                    request.body.decode().split('EX')[1])
                bytes_data = base64.b64decode(url_decoded_data)
                data = json.loads(bytes_data.decode())

                for question in data:
                    exam_id = [y.get('examId') for x in question.values() for y in x if y.get('examId')]
                    question_text = [y.get('question') for x in question.values() for y in x if y.get('question')]
                    options = [y.get('options') for x in question.values() for y in x if y.get('options')]
                    correct_answers = [y.get('correctAnswer') for x in question.values() for y in x if y.get('correctAnswer')]
                    answers_type = [y.get('answerType') for x in question.values() for y in x if y.get('answerType')]
                    new_question = QM.objects.create(
                        admin_id=QM().id_decryption(educator_id),
                        exam_id=exam_id,
                        question_text=question_text,
                        question_answers=options,
                        correct_answers=correct_answers,
                        answers_type=answers_type,
                    )
                    tmp_exam_id = exam_id
                # update exam "has question" field where id matches
                ExamOperations().edit_exam(tmp_exam_id, {'has_question': True})
                CACHE.put('success', 'successfully created')
                url = reverse('educator_exams', kwargs={
                    'educator_id': educator_id,
                })
                return redirect(url)
