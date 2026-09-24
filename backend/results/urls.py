from django.urls import path
from . import views

urlpatterns = [
    path('', views.all_results, name='all_results'),
    path('summary/', views.result_summary, name='result_summary'),
]
