from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BootstrapDemoUserView,
    CurrentSessionView,
    NotebookCapabilitiesView,
    NotebookDocumentViewSet,
    NotebookExecutionJobView,
    NotebookExecutionSubmitView,
)


router = DefaultRouter()
router.register(r"documents", NotebookDocumentViewSet, basename="notebook-document")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/session/", CurrentSessionView.as_view(), name="notebook-session"),
    path("auth/bootstrap-demo/", BootstrapDemoUserView.as_view(), name="notebook-bootstrap-demo"),
    path("execution/submit/", NotebookExecutionSubmitView.as_view(), name="notebook-execute-submit"),
    path("execution/jobs/<uuid:job_id>/", NotebookExecutionJobView.as_view(), name="notebook-execute-job"),
    path("capabilities/", NotebookCapabilitiesView.as_view(), name="notebook-capabilities"),
]
