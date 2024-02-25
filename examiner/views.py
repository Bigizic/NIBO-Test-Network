import base64
from datetime import datetime
from django.contrib import messages
from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, JsonResponse
from django.http import Http404
import json
from io import BytesIO
from .models import ExaminerModel
from base_model.models import BaseModel as BDM
from students.models import StudentModel
import pyotp
from typing import Union
import urllib.parse
import uuid
from .utils import ExaminerOperations as EXOP
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


class ExaminerView():
    def __init__(self):
        pass

    def check_logged_in_status(self, request) -> bool:
        """Returns status of request.session.examiner_logged_in
        """
        status = request.session.get('examiner_logged_in')
        e_id = request.session.get('examiner_id')
        if status and e_id:
            return True
        return False

    def dashboard(self, request, examiner_id: str) -> Union[render, redirect]:
        """ Dashboard view for examiner """
        global GREEN
        if request.method == 'GET':
            status = self.check_logged_in_status(request)
            tmp_examiner_id = request.session.get('examiner_id')
            decrypt_id = ExaminerModel().id_decryption(tmp_examiner_id)
            fetch_examiner = EXOP().get(uuid.UUID(decrypt_id))
            if fetch_examiner['id'] != decrypt_id and status:
                print("BUTXH")
                raise Http404("Examiner not found")
            if fetch_examiner and status:
                context = {'success': GREEN}
                return render(request, 'dashboard.html', context)
            return redirect('examiner_homepage')

    def dashboard_helper(self, request):
        """Dashboard helper incase a user eneter
        /dashboard/ and their session is active, redirect them
        to dashboard route with their session id
        """
        if self.check_logged_in_status(request):
            examiner_id = request.session.get('examiner_id')
            url = reverse('examiner_dashboard', kwargs={
                'examiner_id': examiner_id
            })
            return redirect(url)
        return redirect('examiner_homepage')

    def homepage(self, request, message: str = None) -> render:
        """Displays Examiner web page """
        global NOTIFICATION
        if self.check_logged_in_status(request):
            examiner_id = request.session.get('examiner_id')
            url = reverse('examiner_dashboard', kwargs={
                'examiner_id': examiner_id
            })
            return redirect(url)
        random_pyotp = pyotp.random_base32()
        su = pyotp.totp.TOTP(random_pyotp).provisioning_uri(
                             name='Examiner',
                             issuer_name='Nibo-Test-Network')
        qr_image = generate_qr_code(su)
        context = {
            'su': random_pyotp,
            'qr_image': qr_image,
            'error': NOTIFICATION,
        }
        return render(request, 'homepage.html', context)

    def create_student(self, request) -> HttpResponse:
        """ Creates a student account linked with logged in examiner """
        pass

    def create_account(self, request):
        """ Handles account creation for admin """
        global NOTIFICATION
        global GREEN
        if self.check_logged_in_status(request):
            examiner_id = request.session.get('examiner_id')
            url = reverse('examiner_dashboard', kwargs={
                'examiner_id': examiner_id
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
                newExaminer = {}
                for k, v in data.items():
                    par = ['fullname']
                    if k in par and len(v) < 6:
                        v = None
                    if k == 'username' and len(v) < 3:
                        v = None
                    if k == 'password' and len(v) < 8:
                        v = None
                    newExaminer[k] = v
                if not newExaminer:
                    NOTIFICATION = "Missing Fields"
                    return redirect('examiner_homepage')
                if None in newExaminer.values():
                    NOTIFICATION = "Missing Fields or input is too short"
                    return redirect('examiner_homepage')
                newExaminer['login_time'] = datetime.utcnow()
                newExaminer['two_factor'] = data.get('two_factor')
                if all(len(x) > 300 for x in newExaminer.values()):
                    NOTIFICATION = "Data too long"
                    return redirect('examiner_homepage')
                # check if examiner with such username exist
                if EXOP().exist(newExaminer['username']):
                    NOTIFICATION = "Username has been used"
                    return redirect('examiner_homepage')
                # create new examiner
                hashed_password = EXOP().setpassword(newExaminer['password'])
                examiner = ExaminerModel.objects.create(
                    fullname=newExaminer['fullname'],
                    username=newExaminer['username'],
                    password=hashed_password,
                    two_factor=newExaminer['two_factor'],
                    login_time=newExaminer['login_time'],
                )
                # for login_records update
                EXOP().update_records(examiner.to_dict(), 'login')
                examiner = examiner.id
                examiner_id = ExaminerModel().id_encryption(str(examiner))
                request.session['examiner_logged_in'] = True
                # Convert UUID to string
                request.session['examiner_id'] = str(examiner_id)
                # return redirect('examiner_dashboard')
                GREEN = 'Explore your new dashboard'
                url = reverse('examiner_dashboard', kwargs={
                    'examiner_id': str(examiner_id)
                })
                return redirect(url)
        NOTIFICATION = 'An error occured try again later'
        return redirect('examiner_homepage')

    def login(self, request):
        """ Handles admin login """
        global NOTIFICATION
        global GREEN
        if self.check_logged_in_status(request):
            examiner_id = request.session.get('examiner_id')
            url = reverse('examiner_dashboard', kwargs={
                'examiner_id': examiner_id
            })
            return redirect(url)
        if request.method == 'POST':
            if request.body:
                # data = json.loads(request.body.decode())
                url_decoded_data = urllib.parse.unquote(
                                   request.body.decode().split('Basic')[1])
                bytes_data = base64.b64decode(url_decoded_data)
                data = json.loads(bytes_data.decode())
                username = data.get('username')
                password = data.get('password')
                # check if an admin with username exists
                fetch_examiner = EXOP().exist(username)
                if fetch_examiner:
                    # compare passwords
                    examiner_pwd = fetch_examiner['password']
                    examiner = str(fetch_examiner['id'])
                    examiner_id = ExaminerModel().id_encryption(examiner)
                    if EXOP().compare_password(password, examiner_pwd):
                        GREEN = 'signed in'
                        request.session['examiner_logged_in'] = True
                        request.session['examiner_id'] = examiner_id
                        EXOP().update(fetch_examiner,
                                      login_time=datetime.utcnow())
                        tmp_fetch_examiner = EXOP().get(fetch_examiner['id'])
                        EXOP().update_records(tmp_fetch_examiner, 'login')
                        url = reverse('examiner_dashboard', kwargs={
                            'examiner_id': examiner_id
                        })
                        return redirect(url)
                    else:
                        NOTIFICATION = 'Incorrect details'
                        return redirect('examiner_homepage')
        NOTIFICATION = 'An error occured try again later'
        return redirect('examiner_homepage')

    def logout(self, request):
        """Logs out a logged in examiner """
        if self.check_logged_in_status(request):
            examiner_id = request.session.get('examiner_id')
            decoded_examiner_id = ExaminerModel().id_decryption(examiner_id)
            fetch_examiner = EXOP().get(decoded_examiner_id)
            if fetch_examiner:
                EXOP().update(fetch_examiner, logout_time=datetime.utcnow())
                temp_fetch_examiner = EXOP().get(decoded_examiner_id)
                # for logout_records update
                EXOP().update_records(temp_fetch_examiner, 'logout')
            request.session['examiner_logged_in'] = False
            request.session['examiner_id'] = None
            global GREEN
            global NOTIFICATION
            GREEN = None
            NOTIFICATION = None
            return redirect('examiner_homepage')
        return redirect('examiner_homepage')
