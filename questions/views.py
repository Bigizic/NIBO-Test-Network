from .models import QuestionModel as QM
import base64
from base_model.caching import FIFO as CACHE
from django.shortcuts import render, redirect, reverse
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
                print(data)
                print('\n\n\n\n')
                for question in data:
                    exam_id = [y.get('examId') for x in question.values() for y in x if y.get('examId')]
                    question_text = [y.get('question') for x in question.values() for y in x if y.get('question')]
                    options = [y.get('options') for x in question.values() for y in x if y.get('options')]
                    correct_answers = [y.get('correctAnswer') for x in question.values() for y in x if y.get('correctAnswer')]
                    answers_type = [y.get('answerType') for x in question.values() for y in x if y.get('answerType')]
                    print({
                        'admin_id': educator_id,
                        'exam_id': exam_id,
                        'question_text': question_text,
                        'question_answers': options,
                        'correct_answers': correct_answers,
                        'answers_type': answers_type,
                    })
                CACHE.put('success', 'successfully created')
                url = reverse('educator_exams', kwargs={
                    'educator_id': educator_id,
                })
                return redirect(url)
