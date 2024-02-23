from datetime import datetime
from django.shortcuts import render, redirect
from django.http import HttpResponse
import json
from .models import ExaminerModel


class ExaminerView():
    def __init__(self):
        pass

    def page_warning(self, message:str) -> HttpResponse:
        """ Renders examiner homepage with a warning """
        return HttpResponse("<h1>You've incomplete fields</h1>")

    def dashboard(self, request) -> HttpResponse:
        """ Dashboard view for examiner """
        return HttpResponse("<h1>Examiner dashboard</h1>")
        
    def homepage(self, request) -> HttpResponse:
        """Displays Examiner web page """
        return render(request, 'homepage.html')

    def create_account(self, request) -> HttpResponse:
        """ Handles account creation for admin """
        if request.method == 'POST':
            if request.body:
                # data = json.loads(request.body.decode())
                bytes_data = request.body.decode()
                datas = bytes_data.split('&')
                data = {item.split('=')[0]: item.split('=')[1] for item in datas}
                newExaminer = {
                    'fullname': data.get('fullname'),
                    'username': data.get('username'),
                    'password': data.get('password'),
                    'login_time': datetime.utcnow(),
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
                return redirect('examiner_dashboard')

    def login(self, request) -> HttpResponse:
        """ Handles admin login """
        if request.method == 'POST':
            return HttpResponse("<h1>Examiner dashboard</h1>")

