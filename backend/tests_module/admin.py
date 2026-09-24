from django.contrib import admin
from .models import TestCategory, Question, TestAttempt, TestAnswer
admin.site.register(TestCategory)
admin.site.register(Question)
admin.site.register(TestAttempt)
admin.site.register(TestAnswer)
