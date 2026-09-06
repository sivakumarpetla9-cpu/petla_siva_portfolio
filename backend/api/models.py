from django.db import models
from django.utils.text import slugify

class Profile(models.Model):
    full_name = models.CharField(max_length=150, default="Petla Siva Kumar")
    title = models.CharField(max_length=200, default="UI/UX Designer & Frontend Developer (Fresher)")
    bio = models.TextField(default="I design and build modern, intuitive, and accessible web applications.")
    hero_headline = models.CharField(max_length=250, default="Designing intuitive interfaces. Engineering performant web apps.")
    hero_subheading = models.CharField(max_length=300, default="Specializing in end-to-end product design, scalable frontend architecture, and interactive design systems.")
    avatar = models.ImageField(upload_to="profile/", blank=True, null=True)
    avatar_url = models.CharField(max_length=500, blank=True, default="")
    resume_file = models.FileField(upload_to="resume/", blank=True, null=True)
    resume_url = models.CharField(max_length=500, blank=True, default="")
    email = models.EmailField(default="sivakumarpetla9@gmail.com")
    phone = models.CharField(max_length=50, blank=True, default="")
    location = models.CharField(max_length=150, default="India")
    github_url = models.URLField(blank=True, default="https://github.com/sivakumarpetla9-cpu")
    linkedin_url = models.URLField(blank=True, default="https://www.linkedin.com/in/siva-kumar-33b206377/")
    twitter_url = models.URLField(blank=True, default="")
    figma_url = models.URLField(blank=True, default="")
    dribbble_url = models.URLField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.CharField(max_length=100, default="UI/UX Design")
    short_description = models.TextField()
    full_case_study = models.JSONField(default=list, blank=True, help_text="Structured array of case study sections")
    technologies = models.JSONField(default=list, blank=True, help_text="Array of tech stack strings")
    project_date = models.CharField(max_length=100, blank=True, default="2025")
    live_url = models.URLField(blank=True, default="")
    github_url = models.URLField(blank=True, default="")
    figma_url = models.URLField(blank=True, default="")
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    thumbnail = models.ImageField(upload_to="projects/thumbnails/", blank=True, null=True)
    thumbnail_url = models.CharField(max_length=500, blank=True, default="")
    gallery_images = models.JSONField(default=list, blank=True, help_text="List of media URLs")
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="projects/gallery/")
    caption = models.CharField(max_length=255, blank=True, default="")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.project.title} - Image {self.id}"


class Experience(models.Model):
    WORK_MODE_CHOICES = [
        ('Remote', 'Remote'),
        ('On-site', 'On-site'),
        ('Hybrid', 'Hybrid'),
    ]

    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    work_mode = models.CharField(
        max_length=20,
        choices=WORK_MODE_CHOICES,
        default='Remote'
    )
    location = models.CharField(max_length=150, blank=True, default="")
    employment_type = models.CharField(max_length=100, blank=True, default="Full-time")
    start_date = models.CharField(max_length=100)
    end_date = models.CharField(max_length=100, blank=True, default="Present")
    is_current = models.BooleanField(default=False)
    description = models.TextField()
    company_logo = models.ImageField(upload_to="experience/", blank=True, null=True)
    company_logo_url = models.CharField(max_length=500, blank=True, default="")
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.role} at {self.company}"


class Education(models.Model):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200, blank=True, default="")
    start_year = models.CharField(max_length=50)
    end_year = models.CharField(max_length=50, blank=True, default="Present")
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True, default="")
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('UI/UX Design', 'UI/UX Design'),
        ('Frontend Development', 'Frontend Development'),
        ('Tools & Softwares', 'Tools & Softwares'),
        ('Methodologies', 'Methodologies'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='UI/UX Design')
    icon = models.CharField(max_length=100, blank=True, default="Code", help_text="Lucide icon name or URL")
    level = models.IntegerField(default=85, help_text="Skill percentage 0-100")
    level_label = models.CharField(max_length=50, blank=True, default="Advanced")
    is_featured = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} ({self.category})"


class Certification(models.Model):
    name = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    issue_date = models.CharField(max_length=100)
    credential_id = models.CharField(max_length=150, blank=True, default="")
    verification_url = models.URLField(blank=True, default="")
    certificate_image = models.ImageField(upload_to="certifications/", blank=True, null=True)
    certificate_image_url = models.CharField(max_length=500, blank=True, default="")
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.name} - {self.organization}"


class Media(models.Model):
    file = models.FileField(upload_to="media_library/%Y/%m/")
    title = models.CharField(max_length=255, blank=True, default="")
    alt_text = models.CharField(max_length=255, blank=True, default="")
    file_type = models.CharField(max_length=50, blank=True, default="image")
    file_size = models.IntegerField(default=0, help_text="Size in bytes")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.title or self.file.name
