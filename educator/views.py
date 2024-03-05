import base64
from datetime import datetime
from django.contrib import messages
from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, JsonResponse
from django.http import Http404
import json
from io import BytesIO
from .models import EducatorModel
from base_model.models import BaseModel as BDM
from students.models import StudentModel
import pyotp
from typing import Union
import urllib.parse
import uuid
from .utils import EducatorOperations as EXOP
import qrcode


NOTIFICATION = None
GREEN = None


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
        """Returns status of request.session.educator_logged_in
        """
        status = request.session.get('educator_logged_in')
        e_id = request.session.get('educator_id')
        if status and e_id:
            return True
        return False

    def dashboard(self, request, educator_id: str) -> Union[render, redirect]:
        """ Dashboard view for educator """
        global NOTIFICATION
        global GREEN
        if request.method == 'GET':
            status = self.check_logged_in_status(request)
            tmp_educator_id = request.session.get('educator_id')
            if not tmp_educator_id:
                NOTIFICATION = "Login again"
                return redirect('educator_homepage')
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
                context = {
                    'success': GREEN,
                    'educator': fetch_educator,
                }
                return render(request, 'dashboard.html', context)
            return redirect('educator_homepage')

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
        return redirect('educator_homepage')

    def homepage(self, request, message: str = None) -> render:
        """Displays educator web page """
        global NOTIFICATION
        if self.check_logged_in_status(request):
            educator_id = request.session.get('educator_id')
            url = reverse('educator_dashboard', kwargs={
                'educator_id': educator_id
            })
            return redirect(url)
        """su = pyotp.totp.TOTP(random_pyotp).provisioning_uri(
                             name='educator',
                             issuer_name='Nibo-Test-Network')
        qr_image = generate_qr_code(su)"""
        context = {
            'error': NOTIFICATION,
            'title': 'Welcome Educator',
        }
        return render(request, 'signupSignin.html', context)

    def students(self, request, educator_id: str) -> render:
        """Contains information about students relating to an admin
        """
        if request.method == 'GET':
            if self.check_logged_in_status(request):
                tmp_educator_id = request.session.get('educator_id')
            if not tmp_educator_id:
                NOTIFICATION = "Login again"
                return redirect('educator_homepage')
            decrypt_id = EducatorModel().id_decryption(tmp_educator_id)
            fetch_educator = EXOP().get(uuid.UUID(decrypt_id))
            if fetch_educator['id'] != decrypt_id and status:
                raise Http404("educator not found")
            if fetch_educator:
                fetch_educator['fullname'] = fetch_educator['fullname'].title()
                fetch_educator['id'] = EducatorModel().id_encryption(
                                       fetch_educator['id'])
                fetch_educator['template_title'] = 'My Students'
                context = {
                    'educator': fetch_educator,
                }
                return render(request, 'students.html', context)

    def create_student(self, request, educator_id: str) -> HttpResponse:
        """ Creates a student account linked with logged in educator """
        pass

    def exams(self, request, educator_id: str) -> render:
        """Contains information about exams relating to an admin
        """
        if request.method == 'GET':
            if self.check_logged_in_status(request):
                tmp_educator_id = request.session.get('educator_id')
            if not tmp_educator_id:
                NOTIFICATION = "Login again"
                return redirect('educator_homepage')
            decrypt_id = EducatorModel().id_decryption(tmp_educator_id)
            fetch_educator = EXOP().get(uuid.UUID(decrypt_id))
            if fetch_educator['id'] != decrypt_id and status:
                raise Http404("educator not found")
            if fetch_educator:
                fetch_educator['fullname'] = fetch_educator['fullname'].title()
                fetch_educator['id'] = EducatorModel().id_encryption(
                                       fetch_educator['id'])
                fetch_educator['template_title'] = 'My Exams'
                context = {
                    'educator': fetch_educator,
                }
                return render(request, 'exams.html', context)

    def create_exam(self, request, educator_id: str) -> HttpResponse:
        """Creteas an exam linked with logged in examine """
        if request.method == 'POST':
            if self.check_logged_in_status(request):
                return HttpResponse('<h1>Exams Created</h1>')

    def create_account(self, request):
        """ Handles account creation for admin """
        global NOTIFICATION
        global GREEN
        if self.check_logged_in_status(request):
            educator_id = request.session.get('educator_id')
            url = reverse('educator_dashboard', kwargs={
                'educator_id': educator_id
            })
            return redirect(url)
        if request.method == 'POST':
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
                    NOTIFICATION = "Missing Fields"
                    return redirect('educator_homepage')
                if None in neweducator.values():
                    NOTIFICATION = "Missing Fields or input is too short"
                    return redirect('educator_homepage')
                neweducator['login_time'] = datetime.utcnow()
                if all(len(x) > 500 for x in neweducator.values()):
                    NOTIFICATION = "Data too long"
                    return redirect('educator_homepage')
                # check if educator with such username exist
                if EXOP().exist(neweducator['email']):
                    NOTIFICATION = "Email has been used"
                    return redirect('educator_homepage')
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
        NOTIFICATION = 'An error occured try again later'
        return redirect('educator_homepage')

    def login(self, request):
        """ Handles admin login """
        global NOTIFICATION
        global GREEN
        if self.check_logged_in_status(request):
            educator_id = request.session.get('educator_id')
            url = reverse('educator_dashboard', kwargs={
                'educator_id': educator_id
            })
            return redirect(url)
        if request.method == 'POST':
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
                        NOTIFICATION = 'Incorrect details'
                        return redirect('educator_homepage')
        NOTIFICATION = 'An error occured try again later'
        return redirect('educator_homepage')

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
            global GREEN
            global NOTIFICATION
            GREEN = None
            NOTIFICATION = None
            return redirect('educator_homepage')
        return redirect('educator_homepage')
