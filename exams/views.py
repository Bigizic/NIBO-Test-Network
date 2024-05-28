# from .utils import EducatorOperations as EXOP
# from .models import EducatorModel
from .models import ExamModel as EXMOD
from .utils import ExamOperations as EXMODOP
from base_model.models import BaseModel as BDM
from base_model.caching import FIFO as CACHE
import base64
from datetime import datetime, timezone
from django.contrib import messages
from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, JsonResponse
from django.http import Http404
from educator.views import EducatorView as EDV
from io import BytesIO
import json
import pyotp
import qrcode
from questions.utils import QuestionOperations as QOP
from students.models import StudentModel
from typing import Union
import urllib.parse
import uuid


class ExamView():
    """Exam view implementation
    """

    def exams(self, request, educator_id: str) -> render:
        """Contains information about exams relating to an educator
        """
        if request.method == 'GET':
            if EDV().check_logged_in_status(request):
                educator_details = EDV().educator_details(request)
                edu_exams = EDV().educator_exams(request)
                educator_details['template_title'] = 'Manage exams'
                CACHE.get('redirect')
                # group dicts in a list with matching start-date and end-date
                grouped_exams = EDV().group_educator_exams(request, edu_exams)

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
            return EDV().teardown(request)

    def delete_exam(self, request, exam_id: str) -> Union[redirect, JsonResponse]:
        """ Deletes an exam relating to logged in educator"""
        if request.method == 'PUT':
            educator_details = EDV().educator_details(request)
            if not educator_details:
                CACHE.put('error', 'login again')
                return redirect('educator_signin_signup')
            educator_details['template_title'] = 'Manage_exams'
            if EDV().check_logged_in_status(request):
                if EXMODOP().delete_exam(exam_id):
                    return JsonResponse({'message': 'exam_deleted'}, status=204)
                else:
                    return JsonResponse({'message': 'exam_does_not_exist'}, status=404)
            CACHE.put('error', 'login again')
            return redirect('educator_signin_signup')

    def edit_exam(self, request, educator_id: str, exam_id: str) -> render:
        """ Edits an exam for logged in educator """
        if request.method == 'POST':
            educator_details = EDV().educator_details(request)
            if not educator_details:
                CACHE.put('error', "Login again")
                return redirect('educator_signin_signup')
            educator_details['template_title'] = 'Manage exams'

            if EDV().check_logged_in_status(request):
                if request.body:
                    url_decoded_data = urllib.parse.unquote(
                                       request.body.decode().split('EX')[1])
                    bytes_data = base64.b64decode(url_decoded_data)
                    data = json.loads(bytes_data.decode())
                    allowed_inputs = ['no_of_students',
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
            return EDV().teardown(request)

    def create_exam(self, request, educator_id: str) -> Union[redirect, render]:
        """Creteas an exam linked with logged in examine """
        if request.method == 'POST':
            educator_details = EDV().educator_details(request)
            if not educator_details:
                CACHE.put('error', "Login again")
                return redirect('educator_signin_signup')
            educator_details['template_title'] = 'Manage exams'

            if EDV().check_logged_in_status(request):
                if request.body:
                    url_decoded_data = urllib.parse.unquote(
                                       request.body.decode().split('EX')[1])
                    bytes_data = base64.b64decode(url_decoded_data)
                    data = json.loads(bytes_data.decode())
                    allowed_inputs = ['no_of_students',
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
                        'admin_id': EXMOD().id_decryption(tmp_e_id),
                        'exam_description': data['description'],
                        'start_date': data['start_date'],
                        'end_date': data['end_date'],
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
                        educator_details = EDV().educator_details(request)
                        educator_exams = EDV().educator_exams(request)
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
            return EDV().teardown(request)

