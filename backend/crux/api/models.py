from django.db import models

# Create your models here.
from django.db import models

class College(models.Model):
    name = models.CharField(max_length=255)
    branch = models.CharField(max_length=255)
    degree = models.CharField(max_length=50)
    cgpa = models.FloatField()
    start = models.CharField(max_length=50)
    end = models.CharField(max_length=50)
    relevancy = models.IntegerField()

class TimeDuration(models.Model):
    start = models.CharField(max_length=50)
    end = models.CharField(max_length=50)
    duration_months = models.CharField(max_length=50)

class Certification(models.Model):
    name = models.CharField(max_length=255)
    provider = models.CharField(max_length=255)
    grade = models.CharField(max_length=10)
    relevancy = models.IntegerField()

class Project(models.Model):
    project_title = models.CharField(max_length=255)
    short_description = models.TextField()
    tech_stack = models.TextField()
    time_duration = models.ForeignKey(TimeDuration, on_delete=models.CASCADE)
    relevancy = models.IntegerField()

class WorkExperience(models.Model):
    role = models.CharField(max_length=255)
    organization = models.CharField(max_length=255)
    short_description = models.TextField()
    tech_stack = models.TextField()
    time_duration = models.ForeignKey(TimeDuration, on_delete=models.CASCADE)
    relevancy = models.IntegerField()

class Skill(models.Model):
    name = models.CharField(max_length=255)

class Profile(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    linkedin_url = models.URLField()
    github_url = models.URLField()
    college = models.ForeignKey(College, on_delete=models.CASCADE)
    skills = models.ManyToManyField(Skill)
    skillRelevancy = models.IntegerField()
    extracurricular_activities = models.TextField()
    certifications = models.ManyToManyField(Certification)
    projects = models.ManyToManyField(Project)
    work_experience = models.ManyToManyField(WorkExperience)
    resume = models.FileField(upload_to='resumes/')

