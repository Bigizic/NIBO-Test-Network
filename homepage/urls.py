from django.contrib import admin
from django.urls import path
from .views import HomepageView


urlpatterns = [
    path('', HomepageView().home, name="homepage"),
]