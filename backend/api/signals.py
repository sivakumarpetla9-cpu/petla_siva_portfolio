import os
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Media, ProjectImage, Profile, Certification, Experience

@receiver(post_delete, sender=Media)
def auto_delete_media_file_on_delete(sender, instance, **kwargs):
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

@receiver(post_delete, sender=ProjectImage)
def auto_delete_project_image_on_delete(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

@receiver(post_delete, sender=Profile)
def auto_delete_profile_files_on_delete(sender, instance, **kwargs):
    if instance.avatar and os.path.isfile(instance.avatar.path):
        os.remove(instance.avatar.path)
    if instance.resume_file and os.path.isfile(instance.resume_file.path):
        os.remove(instance.resume_file.path)

@receiver(post_delete, sender=Certification)
def auto_delete_cert_file_on_delete(sender, instance, **kwargs):
    if instance.certificate_image and os.path.isfile(instance.certificate_image.path):
        os.remove(instance.certificate_image.path)

@receiver(post_delete, sender=Experience)
def auto_delete_exp_logo_on_delete(sender, instance, **kwargs):
    if instance.company_logo and os.path.isfile(instance.company_logo.path):
        os.remove(instance.company_logo.path)
