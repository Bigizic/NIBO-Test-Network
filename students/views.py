from django.shortcuts import render
from django.http import HttpResponse


class StudentView():
    """ Handles student views """

    def __init__(self):
        pass

    def login(self, request) -> HttpResponse:
        """Handles student login """
        return HttpResponse('<h1>Login Student</h1>')
