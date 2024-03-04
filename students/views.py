from django.shortcuts import render, redirect
from django.http import HttpResponse
from educator.views import EducatorView as EDV


NOTIFICATION = None


class StudentView():
    """ Handles student views """

    def __init__(self):
        pass

    def check_student_logged_in_status(self, request) -> bool:
        """ Checks if student is logged in
        """
        status = request.session.get('student_logged_in')
        s_id = request.session.get('student_id')
        if status and s_id:
            return True
        return False

    def homepage(self, request) -> render:
        """Renders student homepage
        """
        if EDV().check_logged_in_status(request):
            educator_id = request.session.get('educator_id')
            url = reverse('educator_dashboard', kwargs={
                'educator_id': educator_id
            })
            return redirect(url)

        if self.check_student_logged_in_status(request):
            student_id = request.session.get('student_id')
            url = reverse('student_dashboard', kwargs={
                'student_id': student_id
            })
            return redirect(url)

        context = {
            'error': NOTIFICATION,
            'title': 'Welcome Student',
        }
        return render(request, 'login.html', context)

    def login(self, request) -> HttpResponse:
        """Handles student login """
        if request.method == 'POST':
            return HttpResponse('<h1>Student Dashboard</h1>')
