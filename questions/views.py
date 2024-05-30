from .models import QuestionModel as QM
import asyncio
import base64
from base_model.caching import FIFO as CACHE
from django.shortcuts import render, redirect, reverse
from django.http import StreamingHttpResponse
from django.template.loader import render_to_string
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
        educator_id: str) -> StreamingHttpResponse:
        """fetches question from database and sends fetched data as a stream to
        html
        Return:
            - fetched question in json format
        """
        educator_ID = QM().id_decryption(educator_id)
        fetch = QOP().fetch_all_question_by_exam_id_and_educator_id(exam_id, educator_ID)
        chunk_size = 1  # Number of items to send in each chunk

        def get_chunk(fetch, start, chunk_size):
            chunk = fetch[start:start + chunk_size]
            return chunk

        start = int(request.GET.get('start', 0))
        chunk = get_chunk(fetch, start, chunk_size)

        if chunk:
            data = {
                'questions': chunk,
                'next_start': start + chunk_size
            }
            return StreamingHttpResponse(data)
        else:
            return StreamingHttpResponse({'questions': [], 'next_start': None})
