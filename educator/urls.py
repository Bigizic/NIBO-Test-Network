from django.contrib import admin
from django.urls import path
from .views import EducatorView
from base_model.views import error_404, error_500
from django.conf.urls import handler404, handler500

handler404 = error_404
handler500 = error_500


urlpatterns = [
    path('', EducatorView().signin_signup, name="educator_signin_signup"),

    path('create_account/', EducatorView().create_account,
         name="create_educator_account"),

    path('login/', EducatorView().login, name="educator_login"),

    path('dashboard/', EducatorView().dashboard_helper,
         name="educator_dashboard_helper"),

    path('dashboard/<educator_id>/', EducatorView().dashboard,
         name="educator_dashboard"),

    path('student/<educator_id>/', EducatorView().students,
         name="educator_students"),

    path('logout', EducatorView().logout, name="educator_logout"),
]
