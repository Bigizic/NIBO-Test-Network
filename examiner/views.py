import base64
from datetime import datetime
from django.shortcuts import render, redirect
from django.http import HttpResponse
import json
from io import BytesIO
from .models import ExaminerModel
import pyotp
import qrcode


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

    def page_warning(self, message: str) -> HttpResponse:
        """ Renders examiner homepage with a warning """
        return HttpResponse("<h1>You've incomplete fields</h1>")

    def dashboard(self, request) -> HttpResponse:
        """ Dashboard view for examiner """
        return HttpResponse("<h1>Examiner dashboard</h1>")

    def homepage(self, request) -> HttpResponse:
        """Displays Examiner web page """
        random_pyotp = pyotp.random_base32()
        su = pyotp.totp.TOTP(random_pyotp).provisioning_uri(
                             name='Examiner',
                             issuer_name='Nibo-Test-Network')
        qr_image = generate_qr_code(su)
        context = {
            'su': random_pyotp,
            'qr_image': qr_image,
        }
        return render(request, 'homepage.html', context)

    def create_account(self, request) -> HttpResponse:
        """ Handles account creation for admin """
        if request.method == 'POST':
            if request.body:
                # data = json.loads(request.body.decode())
                print(request.body)
                bytes_data = request.body.decode()
                print(bytes_data)
                datas = bytes_data.split('&')
                data = {x.split('=')[0]: x.split('=')[1] for x in datas}
                newExaminer = {
                    'fullname': data.get('fullname'),
                    'username': data.get('username'),
                    'password': data.get('signupPassword'),
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
            return redirect('examiner_dashboard')
