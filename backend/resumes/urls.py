from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_resume, name='upload_resume'),
    path('my-resumes/', views.my_resumes, name='my_resumes'),
    path('latest/', views.latest_resume, name='latest_resume'),
]
