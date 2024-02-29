from django.urls import path, include
from . import views

urlpatterns = [
    path("",views.shorlist,name = "api-shortlist"),
    path("download/",views.download_resume,name = "api-download"),
    path("details/",views.get_all_details,name = "api-details"),

]