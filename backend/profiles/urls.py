from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.my_profile, name='my_profile'),
    path('upload-picture/', views.upload_picture, name='upload_picture'),
]
