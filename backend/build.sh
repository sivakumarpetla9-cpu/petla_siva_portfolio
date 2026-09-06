#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

pip install -r requirements.txt

mkdir -p media/profile media/projects/thumbnails media/projects/gallery media/media_library media/experience media/certifications media/resume

python manage.py collectstatic --no-input
python manage.py migrate
python manage.py seed_data
