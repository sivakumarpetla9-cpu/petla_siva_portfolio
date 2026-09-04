from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Profile, Project, Experience, Education, Skill, Certification

class Command(BaseCommand):
    help = "Seed database with initial admin superuser and sample portfolio content."

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")

        # 1. Admin Superuser
        if not User.objects.filter(username="sivapetla").exists():
            User.objects.create_superuser(
                username="sivapetla",
                email="siva.petla@example.com",
                password="Siva@123"
            )
            self.stdout.write(self.style.SUCCESS("Superuser created: username 'sivapetla', password 'Siva@123'"))
        else:
            admin_user = User.objects.get(username="sivapetla")
            admin_user.set_password("Siva@123")
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Superuser 'sivapetla' password set to 'Siva@123'"))

        # 2. Profile
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
        self.stdout.write("Profile updated for Petla Siva Kumar.")

        # Update experiences if any
        Experience.objects.all().delete()
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

        self.stdout.write(self.style.SUCCESS("Database re-seeded successfully!"))
