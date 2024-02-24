from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views import View
from django.db import models
import json
from .models import ExaminerModel


class Examiner(View):
    def __init__(self):
        pass

    def page_warning(self, message:str) -> HttpResponse:
        """ Renders examiner web page with a warning """
        return HttpResponse("<h1>You've incomplete fields</h1>")

    def dashboard(self, request) -> HttpResponse:
        """ Dashboard view for examiner """
        return HttpResponse("<h1>Examiner dashboard</h1>")
        
    def get(self, request) -> HttpResponse:
        """Displays Examiner web page
        """
        return render(request, 'examiner/html/examiner_panel.html')

    def post(self, request) -> HttpResponse:
        if request.method == 'POST':
            if request.body:
                data = json.loads(request.body.decode())
                newExaminer = {
                    'fullname': data.get('fullname'),
                    'username': data.get('username'),
                    'password': data.get('password'),
                    'login_time': data.get('login_time'),
                }
                if None in newExaminer.values():
                    return self.page_warning("Missing Fields")
                newExaminer['two_factor'] = data.get('two_factor')
                if all(len(x) > 300 for x in newExaminer.values()):
                    return self.page_warning("Data too long")

                # create new examiner
                ExaminerModel(
                    fullname=newExaminer['fullname'],
                    username=newExaminer['username'],
                    password=newExaminer['password'],
                    two_factor=newExaminer['two_factor'],
                    login_time=newExaminer['login_time'],
                ).save()
                return HttpResponse("<h1>Examiner dashboard</h1>")

        return self.get(request)
    

class Exam(View):
    def __init__(self):
        pass

    def get(self, request, exam_id: str) -> HttpResponse:
        return HttpResponse('<h1>Start Exam</h1><h2>{exam_id}</h2>')


class Student(View):
    def __init__(self):
        pass

    def get(self, request) -> HttpResponse:
        return HttpResponse('<h1>login student</h1>')

    def post(self, request) -> HttpResponse:
        print(request.body)
        return HttpResponse('<h1>create student</h1>')


class Question(View):
    def __init__(self):
        pass


class ExamAttempt(View):
    def __init__(self):
        pass