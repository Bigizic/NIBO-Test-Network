from .models import QuestionModel as QM
import base64
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
                url_decoded_data = urllib.parse.unquote(
                    request.body.decode().split('EX')[1])
                bytes_data = base64.b64decode(url_decoded_data)
                data = json.loads(bytes_data.decode())
                print(data)
