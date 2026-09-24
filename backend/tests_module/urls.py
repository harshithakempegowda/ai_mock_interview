from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.categories, name='test_categories'),
    path('questions/<str:category_name>/', views.questions_by_category, name='questions_by_category'),
    path('submit/', views.submit_test, name='submit_test'),
    path('my-attempts/', views.my_attempts, name='my_attempts'),
    path('attempt/<int:attempt_id>/', views.attempt_detail, name='attempt_detail'),
]
