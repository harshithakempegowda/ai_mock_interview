from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.start_interview, name='start_interview'),
    path('<int:interview_id>/respond/', views.submit_response, name='submit_response'),
    path('<int:interview_id>/complete/', views.complete_interview, name='complete_interview'),
    path('<int:interview_id>/', views.interview_detail, name='interview_detail'),
    path('my-interviews/', views.my_interviews, name='my_interviews'),
]
