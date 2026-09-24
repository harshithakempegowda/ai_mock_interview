from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/profile/', include('profiles.urls')),
    path('api/tests/', include('tests_module.urls')),
    path('api/interviews/', include('interviews.urls')),
    path('api/results/', include('results.urls')),
    path('api/history/', include('history.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/resumes/', include('resumes.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
