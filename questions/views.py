from .models import QuestionModel as QM
import base64
from base_model.caching import FIFO as CACHE
from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, JsonResponse, Http404
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
                    print(options)
                    print(type(options))
                    new_question = QM.objects.create(
                        admin_id=QM().id_decryption(educator_id),
                        exam_id=exam_id,
                        question_text=question_text,
                        question_answers=json.dumps(options),
                        correct_answers=json.dumps(correct_answers),
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
        count = 0
        data = []
        educator_ID = QM().id_decryption(educator_id)
        fetch = QOP().fetch_all_question_by_exam_id_and_educator_id(exam_id,
                 educator_ID)
        if fetch:
            for i in fetch:
                result = {
                    'id': str(i.id),
                    'created_at': str(i.created_at),
                    'updated_at': str(i.updated_at),
                    'admin_id': str(i.admin_id),
                    'exam_id': str(i.exam_id[2:-2]),
                    'question_text': str(i.question_text[1:-1]),
                    'question_answers': str(i.question_answers[2:-2]),
                    'correct_answers': str(i.correct_answers[2:-2]),
                    'answers_type': str(i.answers_type[1:-1]),
                    'upload_path': str(i.upload_path),
                }
                data.append(result)
            print(data)
            return JsonResponse(data, safe=False)
        raise Http404
