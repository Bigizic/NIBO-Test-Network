from .models import QuestionModel as QM
import base64
from base_model.caching import FIFO as CACHE
from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, JsonResponse
from exams.utils import ExamOperations
import json
import urllib.parse
from .utils import QuestionOperations as QOP


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
                    tmp_exam_id = exam_id[0]
                # update exam "has question" field where id matches
                ExamOperations().edit_exam(tmp_exam_id, {'has_question': 1})
                CACHE.put('success', 'successfully created')
                url = reverse('educator_exams', kwargs={
                    'educator_id': educator_id,
                })
                return redirect(url)

    def fetch_question(self, request, exam_id: str,
        educator_id: str) -> JsonResponse:
        """fetches question from database and sends json response as response
        Return:
            - fetched question in json format
        """
        result = {}
        count = 0
        data = []
        educator_ID = QM().id_decryption(educator_id)
        fetch = QOP().fetch_all_question_by_exam_id_and_educator_id(exam_id,
                 educator_ID)
        if fetch:
            for i in fetch:
                result['id'] = i.id
                result['created_at'] = i.created_at
                result['updated_at'] = i.updated_at
                result['admin_id'] = i.admin_id
                result['exam_id'] = i.exam_id
                result['question_text'] = i.question_text
                result['question_answers'] = i.question_answers
                result['correct_answers'] = i.correct_answers
                result['answers_type'] = i.answers_type
                result['upload_path'] = i.upload_path
                data.append({f'question_{count}': result})
                count += 1
            return HttpResponse(data)
        return JsonResponse(404)
