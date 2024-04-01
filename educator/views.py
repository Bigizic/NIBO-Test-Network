from .utils import EducatorOperations as EXOP
from .models import EducatorModel
from base_model.models import BaseModel as BDM
from base_model.caching import FIFO as CACHE
import base64
from datetime import datetime, timezone
from django.contrib import messages
from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, JsonResponse
from django.http import Http404
from exams.models import ExamModel as EXMOD
from exams.utils import ExamOperations as EXMODOP
from io import BytesIO
import json
import pyotp
import qrcode
from students.models import StudentModel
from typing import Union
import urllib.parse
import uuid


def generate_qr_code(data: str):
    qr = qrcode.QRCode(version=1,
                       error_correction=qrcode.constants.ERROR_CORRECT_L,
                       box_size=10, border=4)
    qr.add_data(data)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")

    # Convert image to BytesIO object
    img_buffer = BytesIO()
    qr_img.save(img_buffer)

    # Encode image as Base64 string
    img_str = base64.b64encode(img_buffer.getvalue()).decode()

    return img_str


class EducatorView():
    def __init__(self):
        pass

    def check_logged_in_status(self, request) -> bool:
        """Returns
            - status of request.session.educator_logged_in
            - redirect to login page with Cache key 'error'
        """
        status = request.session.get('educator_logged_in')
        e_id = request.session.get('educator_id')
        if status and e_id:
            return True
        return False

    def teardown(self, request) -> render:
        """Redirects to signInSignUp page if
        educator is not logged in
        """
        if not self.check_logged_in_status(request):
            CACHE.put('error', "Login again")
            return redirect('educator_signin_signup')
        pass

    def educator_exams(self, request) -> Union[bool, dict]:
        """fetch exams related to an educator
        """
        status = self.check_logged_in_status(request)
        if status:
            tmp_educator_id = request.session.get('educator_id')
            if not tmp_educator_id:
                return False
            decrypt_id = EducatorModel().id_decryption(tmp_educator_id)
            fetch_exams = EXOP().get_exams(decrypt_id)
            if fetch_exams:
                if isinstance(fetch_exams[-3], int):
                    upcoming_exams_counter = fetch_exams[-3]
                fetch_exam = fetch_exams[:-3]
                new_fetch_exams = {
                    'exams': fetch_exam,
                    'upec': upcoming_exams_counter,
                    'active_exam_count': fetch_exams[-2]['active_exam_count'],
                    'fc': fetch_exams[-1].get('f_exam_count'),
                }
                return new_fetch_exams
            return False

    def group_educator_exams(self, request, list_of_dict: list) -> list:
        """iterates in the list of dicts and group the dicts
        that has similar start and end dates in a list
        """
        if isinstance(list_of_dict, dict):
            list_exams = list_of_dict['exams']
            # this is a first pointer to the start date
            start_dates = []
            for dicts in list_exams:
                first_s_date = dicts['start_date'].date()
                if first_s_date not in start_dates:
                    start_dates.append(first_s_date)

            grouped_list = [[dicts for dicts in list_exams
                            if dicts['start_date'].date() == std]
                            for std in start_dates]
            return grouped_list
        return None

    def educator_details(self, request) -> Union[bool, dict]:
        """ Returns a dictionary of the logged in examiner """
        status = self.check_logged_in_status(request)
        tmp_educator_id = request.session.get('educator_id')
        if not tmp_educator_id:
            return False
        decrypt_id = EducatorModel().id_decryption(tmp_educator_id)
        fetch_educator = EXOP().get(uuid.UUID(decrypt_id))
        if fetch_educator['id'] != decrypt_id and status:
            raise Http404("educator not found")
        if fetch_educator and status:
            fetch_educator['fullname'] = fetch_educator['fullname'].title()
            fetch_educator['id'] = EducatorModel().id_encryption(
                                    fetch_educator['id'])
            fetch_educator['template_title'] = 'Educator Dashboard'
            if fetch_educator['fullname'].split(' '):
                fpp = fetch_educator['fullname'].split(' ')[1][0]
            else:
                fpp = fetch_educator['fullname'][1]
            fetch_educator['pp'] = '{}{}'.format(
                                    fetch_educator['fullname'][0], fpp)
            fetch_educator['logout_records'] = ''
            fetch_educator['login_records'] = ''
            return fetch_educator
        return False

    def dashboard(self, request, educator_id: str) -> Union[render, redirect]:
        """ Dashboard view for educator """
        if self.check_logged_in_status(request):
            tmp_educator_details = self.educator_details(request)
            tmp_exam_d = self.educator_exams(request)
            active_exam_count = None
            if tmp_exam_d:
                if tmp_exam_d.get('active_exam_count'):
                    active_exam_count = tmp_exam_d.get('active_exam_count')
                CACHE.get('redirect')
            context = {
                'educator': tmp_educator_details,
                'exams': tmp_exam_d['exams'] if tmp_exam_d else None,
                'redirect': CACHE.get('redirect'),
                'active_exam_count': active_exam_count,
                'upcoming_count': tmp_exam_d['upec'] if tmp_exam_d else None,
                'finished_count': tmp_exam_d.get('fc') if tmp_exam_d else None,
            }
            return render(request, 'dashboard.html', context)
        return self.teardown(request)

    def dashboard_helper(self, request):
        """Dashboard helper incase a user eneter
        /dashboard/ and their session is active, redirect them
        to dashboard route with their session id
        """
        if self.check_logged_in_status(request):
            educator_id = request.session.get('educator_id')
            url = reverse('educator_dashboard', kwargs={
                'educator_id': educator_id
            })
            return redirect(url)
        return self.teardown(request)

    def signin_signup(self, request, message: str = None) -> render:
        """Displays educator web page """
        if request.method == 'GET':
            if self.check_logged_in_status(request):
                educator_id = request.session.get('educator_id')
                CACHE.put('redirect', "you're redirected")
                url = reverse('educator_dashboard', kwargs={
                    'educator_id': educator_id,
                })
                return redirect(url)
            CACHE.get('redirect')
            context = {
                'error': CACHE.get('error'),
                'title': 'Welcome Educator',
                'rediret': CACHE.get('redirect'),
            }
            return render(request, 'signupSignin.html', context)

    def students(self, request, educator_id: str) -> render:
        """Contains information about students relating to an admin
        """
        if request.method == 'GET':
            if self.check_logged_in_status(request):
                educator_details = self.educator_details(request)
                educator_details['template_title'] = 'My Students'
                CACHE.get('redirect')
                context = {
                    'educator': educator_details,
                    'rediret': CACHE.get('redirect'),
                }
                return render(request, 'students.html', context)
            return self.teardown(request)

    def create_student(self, request, educator_id: str) -> HttpResponse:
        """ Creates a student account linked with logged in educator """
        pass

    def exams(self, request, educator_id: str) -> render:
        """Contains information about exams relating to an admin
        """
        if request.method == 'GET':
            if self.check_logged_in_status(request):
                educator_details = self.educator_details(request)
                edu_exams = self.educator_exams(request)
                educator_details['template_title'] = 'Manage exams'
                CACHE.get('redirect')
                # group dicts in a list with matching start-date and end-date
                grouped_exams = self.group_educator_exams(request, edu_exams)

                context = {
                    'warning': CACHE.get('warning'),
                    'success': CACHE.get('success'),
                    'educator': educator_details,
                    'rediret': CACHE.get('redirect'),
                    'exams': edu_exams['exams'] if edu_exams else None,
                    'grouped_exams': grouped_exams if grouped_exams else None,
                    'upcoming_counter': edu_exams['upec'] if edu_exams else None,
                }
                return render(request, 'exams.html', context)
            return self.teardown(request)

    def delete_exam(self, request, exam_id: str) -> Union[redirect, JsonResponse]:
        """ Deletes an exam relating to logged in educator"""
        if request.method == 'PUT':
            educator_details = self.educator_details(request)
            if not educator_details:
                CACHE.put('error', 'login again')
                return redirect('educator_signin_signup')
            educator_details['template_title'] = 'Manage_exams'
            if self.check_logged_in_status(request):
                if EXMODOP().delete_exam(exam_id):
                    return JsonResponse({'message': 'exam_deleted'}, status=204)
                else:
                    return JsonResponse({'message': 'exam_does_not_exist'}, status=404)
            CACHE.put('error', 'login again')
            return redirect('educator_signin_signup')

    def edit_exam(self, request, educator_id: str, exam_id: str) -> render:
        """ Edits an exam for logged in educator """
        if request.method == 'POST':
            educator_details = self.educator_details(request)
            if not educator_details:
                CACHE.put('error', "Login again")
                return redirect('educator_signin_signup')
            educator_details['template_title'] = 'Manage exams'

            if self.check_logged_in_status(request):
                if request.body:
                    url_decoded_data = urllib.parse.unquote(
                                       request.body.decode().split('EX')[1])
                    bytes_data = base64.b64decode(url_decoded_data)
                    data = json.loads(bytes_data.decode())
                    allowed_inputs = ['duration', 'no_of_students',
                                      'no_of_questions', 'grade',
                                      'time_limit']
                    for k, v in data.items():
                        if len(v) > 650:
                            request.method = 'GET'
                            CACHE.put('warning', 'inputs too long'), timezone
                            return self.exams(request, educator_details['id'])
                        if len(v) < 1:
                            request.method = 'GET', timezone
                            CACHE.put('warning', 'Error missing fields')
                            return self.exams(request, educator_details['id'])
                        if k in allowed_inputs:
                            data[k] = int(v)
                    data['start_date'] = datetime.strptime(
                                         data['start_date'],
                                         "%Y-%m-%d").replace(tzinfo=timezone.utc)
                    data['end_date'] = datetime.strptime(
                                        data['end_date'],
                                        '%Y-%m-%d').replace(tzinfo=timezone.utc)
                    tmp_e_id = request.session.get('educator_id')
                    data['exam_title'] = data['title']
                    data['exam_description'] = data['description']
                    data['number_of_students'] = data['no_of_students']
                    data['number_of_questions'] = data['no_of_questions']
                    data.pop('title')
                    data.pop('description')
                    data.pop('no_of_students')
                    data.pop('no_of_questions')
                    edit_exam = EXMODOP().edit_exam(exam_id, data)
                    if edit_exam:
                        request.method = 'GET'
                        CACHE.put('success', 'Successfully updated')
                        return self.exams(request, educator_id)
                    else:
                        request.method = 'GET'
                        CACHE.put('warning', 'Cannot update exam')
                        return self.exams(request, educator_id)
            return self.teardown(request)

    def create_exam(self, request, educator_id: str) -> Union[redirect, render]:
        """Creteas an exam linked with logged in examine """
        if request.method == 'POST':
            educator_details = self.educator_details(request)
            if not educator_details:
                CACHE.put('error', "Login again")
                return redirect('educator_signin_signup')
            educator_details['template_title'] = 'Manage exams'

            if self.check_logged_in_status(request):
                if request.body:
                    url_decoded_data = urllib.parse.unquote(
                                       request.body.decode().split('EX')[1])
                    bytes_data = base64.b64decode(url_decoded_data)
                    data = json.loads(bytes_data.decode())
                    allowed_inputs = ['durations', 'no_of_students',
                                      'no_of_questions', 'grade',
                                      'time_limit']
                    for k, v in data.items():
                        if len(v) > 650:
                            request.method = 'GET'
                            CACHE.put('warning', 'inputs too long')
                            return self.exams(request, educator_details['id'])
                        if len(v) < 1:
                            request.method = 'GET'
                            CACHE.put('warning', 'Error missing fields')
                            return self.exams(request, educator_details['id'])
                        if k in allowed_inputs:
                            data[k] = int(v)
                    data['start_date'] = datetime.strptime(
                                         data['start_date'], "%Y-%m-%d")
                    data['end_date'] = datetime.strptime(
                                        data['end_date'], '%Y-%m-%d')
                    tmp_e_id = request.session.get('educator_id')
                    new_data = {
                        'exam_title': data['title'],
                        'admin_id': EducatorModel().id_decryption(tmp_e_id),
                        'exam_description': data['description'],
                        'start_date': data['start_date'],
                        'end_date': data['end_date'],
                        'duration': data['duration'],
                        'number_of_students': data['no_of_students'],
                        'number_of_questions': data['no_of_questions'],
                        'grade': data['grade'],
                        'time_limit': data['time_limit'],
                    }
                    # check exam exists before creating
                    exists = EXMODOP().exists(new_data)
                    if exists:
                        request.method = 'GET'
                        CACHE.put('warning', 'Exam exists')
                        return self.exams(request, educator_details['id'])
                    else:
                        new_exam = EXMOD.objects.create(**new_data)
                        educator_details = self.educator_details(request)
                        educator_exams = self.educator_exams(request)
                        educator_details['template_title'] = 'Manage exams'
                        CACHE.get('redirect')
                        context = {
                            'warning': CACHE.get('warning'),
                            'educator': educator_details,
                            'rediret': CACHE.get('redirect'),
                            'exams': educator_exams['exams'],
                            'upcoming_counter': educator_exams['upec'],
                        }
                        return render(request, 'exams.html', context)
            return self.teardown(request)

    def create_account(self, request):
        """ Handles account creation for admin """
        if request.method == 'GET':
            if self.check_logged_in_status(request):
                educator_id = request.session.get('educator_id')
                url = reverse('educator_dashboard', kwargs={
                    'educator_id': educator_id
                })
                return redirect(url)
        if request.method == 'POST':
            if self.check_logged_in_status(request):
                educator_id = request.session.get('educator_id')
                url = reverse('educator_dashboard', kwargs={
                    'educator_id': educator_id
                })
                CACHE.put('redirect', "you're redirected")
                return redirect(url)
            if request.body:
                # data = json.loads(request.body.decode())
                url_decoded_data = urllib.parse.unquote(
                                   request.body.decode().split('Basic')[1])
                bytes_data = base64.b64decode(url_decoded_data)
                data = json.loads(bytes_data.decode())
                # data = {x.split(':')[0]: x.split(':')[1] for x in datas}
                neweducator = {}
                for k, v in data.items():
                    par = ['fullname']
                    if k in par and len(v) < 6:
                        v = None
                    if k == 'email' and len(v) < 5:
                        v = None
                    if k == 'password' and len(v) < 8:
                        v = None
                    neweducator[k] = v
                if not neweducator:
                    CACHE.put('error', "Missing Fields")
                    return redirect('educator_signin_signup')
                if None in neweducator.values():
                    CACHE.put('error', "Missing Fields or input is too short")
                    return redirect('educator_signin_signup')
                neweducator['login_time'] = datetime.utcnow()
                if all(len(x) > 500 for x in neweducator.values()):
                    CACHE.put('error', "Data too long")
                    return redirect('educator_signin_signup')
                # check if educator with such username exist
                if EXOP().exist(neweducator['email']):
                    CACHE.put('error', "Email has been used")
                    return redirect('educator_signin_signup')
                # create new educator
                hashed_password = EXOP().setpassword(neweducator['password'])
                educator = EducatorModel.objects.create(
                    fullname=neweducator['fullname'],
                    email=neweducator['email'],
                    password=hashed_password,
                    login_time=neweducator['login_time'],
                    two_factor=pyotp.random_base32(),
                )
                # for login_records update
                EXOP().update_records(educator.to_dict(), 'login')
                educator = educator.id
                educator_id = EducatorModel().id_encryption(str(educator))
                request.session['educator_logged_in'] = True
                # Convert UUID to string
                request.session['educator_id'] = str(educator_id)
                # return redirect('educator_dashboard')
                GREEN = 'Explore your new dashboard'
                url = reverse('educator_dashboard', kwargs={
                    'educator_id': str(educator_id)
                })
                return redirect(url)
        CACHE.put('error', 'An error occured try again later')
        return redirect('educator_signin_signup')

    def login(self, request):
        """ Handles admin login """
        if request.method == 'GET':
            if self.check_logged_in_status(request):
                educator_id = request.session.get('educator_id')
                url = reverse('educator_dashboard', kwargs={
                    'educator_id': educator_id
                })
                return redirect(url)

        if request.method == 'POST':
            if self.check_logged_in_status(request):
                educator_id = request.session.get('educator_id')
                url = reverse('educator_dashboard', kwargs={
                    'educator_id': educator_id
                })
                return redirect(url)

            if request.body:
                # data = json.loads(request.body.decode())
                url_decoded_data = urllib.parse.unquote(
                                   request.body.decode().split('Basic')[1])
                bytes_data = base64.b64decode(url_decoded_data)
                data = json.loads(bytes_data.decode())
                email = data.get('email')
                password = data.get('password')
                # check if an admin with email exists
                fetch_educator = EXOP().exist(email)
                if fetch_educator:
                    # compare passwords
                    educator_pwd = fetch_educator['password']
                    educator = str(fetch_educator['id'])
                    educator_id = EducatorModel().id_encryption(educator)
                    if EXOP().compare_password(password, educator_pwd):
                        GREEN = 'signed in'
                        request.session['educator_logged_in'] = True
                        request.session['educator_id'] = educator_id
                        EXOP().update(fetch_educator,
                                      login_time=datetime.utcnow())
                        tmp_fetch_educator = EXOP().get(fetch_educator['id'])
                        EXOP().update_records(tmp_fetch_educator, 'login')
                        url = reverse('educator_dashboard', kwargs={
                            'educator_id': educator_id
                        })
                        return redirect(url)
                    else:
                        CACHE.put('error', 'Incorrect details')
                        return redirect('educator_signin_signup')
                CACHE.put('error', 'No educator found')
                return redirect('educator_signin_signup')
        CACHE.put('error', 'An error occured try again later')
        return redirect('educator_signin_signup')

    def logout(self, request):
        """Logs out a logged in educator """
        if self.check_logged_in_status(request):
            educator_id = request.session.get('educator_id')
            decoded_educator_id = EducatorModel().id_decryption(educator_id)
            fetch_educator = EXOP().get(decoded_educator_id)
            if fetch_educator:
                EXOP().update(fetch_educator, logout_time=datetime.utcnow())
                temp_fetch_educator = EXOP().get(decoded_educator_id)
                # for logout_records update
                EXOP().update_records(temp_fetch_educator, 'logout')
            request.session['educator_logged_in'] = False
            request.session['educator_id'] = None
            return redirect('educator_signin_signup')
        return redirect('educator_signin_signup')
