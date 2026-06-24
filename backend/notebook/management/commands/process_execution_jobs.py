import time
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from notebook.models import NotebookExecutionJob
from notebook.views import run_execution_job


class Command(BaseCommand):
    help = "Process queued notebook execution jobs."

    def add_arguments(self, parser):
        parser.add_argument("--once", action="store_true", help="Process available jobs once and exit.")
        parser.add_argument("--poll-interval", type=float, default=1.0, help="Polling interval in seconds.")

    def handle(self, *args, **options):
        poll_interval = max(0.2, options["poll_interval"])
        process_once = options["once"]

        while True:
            now = timezone.now()
            stuck_jobs = NotebookExecutionJob.objects.filter(
                status=NotebookExecutionJob.STATUS_RUNNING,
                started_at__lt=now - timedelta(seconds=30),
            )
            for job in stuck_jobs:
                job.status = NotebookExecutionJob.STATUS_TIMEOUT
                job.finished_at = now
                job.detail = "Execution timed out."
                job.save(update_fields=["status", "finished_at", "detail", "updated_at"])

            job = NotebookExecutionJob.objects.filter(status=NotebookExecutionJob.STATUS_QUEUED).order_by("created_at").first()
            if job:
                run_execution_job(job)
            elif process_once:
                break
            else:
                time.sleep(poll_interval)
