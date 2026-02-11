"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))

REST API endpoint format for GitHub Codespaces:
    https://$CODESPACE_NAME-8000.app.github.dev/api/[component]/
    Example: https://$CODESPACE_NAME-8000.app.github.dev/api/activities/

The API automatically detects and returns the correct URL based on the request context.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from octofit_tracker import views
import os

# GitHub Codespaces configuration
CODESPACE_NAME = os.getenv('CODESPACE_NAME')

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'teams', views.TeamViewSet, basename='team')
router.register(r'activities', views.ActivityViewSet, basename='activity')
router.register(r'leaderboard', views.LeaderboardViewSet, basename='leaderboard')
router.register(r'workouts', views.WorkoutViewSet, basename='workout')

urlpatterns = [
    path('', views.api_root, name='api_root'),
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
]
