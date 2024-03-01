from django.shortcuts import render

# Create your views here.

class HomepageView():

    def __init__(self):
        pass

    def home(self, request) -> render:
        """ Renders homepage """
        return render(request, 'home.html')