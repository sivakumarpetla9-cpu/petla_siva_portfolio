import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Profile, Project, Experience, Education, Skill, Certification

class Command(BaseCommand):
    help = "Seed database with initial profile data and superuser using environment variables."

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")

        # 1. Admin Superuser from Environment Variables
        admin_username = os.environ.get('ADMIN_USERNAME', 'siva')
        admin_email = os.environ.get('ADMIN_EMAIL', 'siva.petla@example.com')
        admin_password = os.environ.get('ADMIN_PASSWORD', None)

        if not User.objects.filter(username=admin_username).exists():
            pwd = admin_password if admin_password else 'Siva@123'
            user = User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password=pwd
            )
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Superuser '{admin_username}' created successfully."))
        else:
            user = User.objects.get(username=admin_username)
            if admin_password:
                user.set_password(admin_password)
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Updated password for superuser '{admin_username}' from environment variable."))
            else:
                user.set_password('Siva@123')
                user.save()
                self.stdout.write(f"Superuser '{admin_username}' password updated.")

        # 2. Profile Initial Data
        profile, created = Profile.objects.get_or_create(id=1)
        profile.full_name = "Petla Siva Kumar"
        profile.title = "UI/UX Designer & Frontend Developer (Fresher)"
        profile.bio = "Passionate fresher product designer and engineer turning complex ideas into intuitive, scalable digital experiences through modern web technologies and design systems."
        profile.hero_headline = "Designing intuitive interfaces. Engineering performant web applications."
        profile.hero_subheading = "Fresher specializing in user-centered product design, responsive frontend architecture, and interactive web experiences."
        profile.email = "petla.sivakumar@example.com"
        profile.phone = "+91 98765 43210"
        profile.location = "India"
        profile.github_url = "https://github.com/sivakumarpetla9-cpu"
        profile.linkedin_url = "https://www.linkedin.com/in/siva-kumar-33b206377/"
        profile.avatar_url = "/media/profile/petla_siva_kumar.jpg"
        profile.twitter_url = "https://twitter.com"
        profile.figma_url = "https://figma.com"
        profile.dribbble_url = "https://dribbble.com"
        profile.save()
        self.stdout.write("Profile initialized for Petla Siva Kumar.")

        # 3. Experience Initial Data if empty
        if Experience.objects.count() == 0:
            Experience.objects.create(
                company="Self-Driven Projects & Internships",
                role="UI/UX & Frontend Trainee",
                location="Remote",
                employment_type="Internship",
                start_date="2024",
                end_date="Present",
                is_current=True,
                description="Designed and engineered responsive web applications in React, Vite, Tailwind CSS, and Django REST Framework. Built custom component libraries and user flows.",
                order=1
            )

        self.stdout.write(self.style.SUCCESS("Database seeding complete!"))
