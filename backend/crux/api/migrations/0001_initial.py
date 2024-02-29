# Generated by Django 4.2.4 on 2024-02-25 22:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Certification",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("provider", models.CharField(max_length=255)),
                ("grade", models.CharField(max_length=10)),
                ("relevancy", models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name="College",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("branch", models.CharField(max_length=255)),
                ("degree", models.CharField(max_length=50)),
                ("cgpa", models.FloatField()),
                ("start", models.CharField(max_length=50)),
                ("end", models.CharField(max_length=50)),
                ("relevancy", models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name="Skill",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="TimeDuration",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("start", models.CharField(max_length=50)),
                ("end", models.CharField(max_length=50)),
                ("duration_months", models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name="WorkExperience",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("role", models.CharField(max_length=255)),
                ("organization", models.CharField(max_length=255)),
                ("short_description", models.TextField()),
                ("tech_stack", models.TextField()),
                ("relevancy", models.IntegerField()),
                (
                    "time_duration",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.timeduration",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Project",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("project_title", models.CharField(max_length=255)),
                ("short_description", models.TextField()),
                ("tech_stack", models.TextField()),
                ("relevancy", models.IntegerField()),
                (
                    "time_duration",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.timeduration",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Profile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("email", models.CharField(max_length=255)),
                ("phone", models.CharField(max_length=20)),
                ("address", models.TextField()),
                ("linkedin_url", models.URLField()),
                ("github_url", models.URLField()),
                ("skillRelevancy", models.IntegerField()),
                ("extracurricular_activities", models.TextField()),
                ("resume", models.FileField(upload_to="resumes/")),
                ("certifications", models.ManyToManyField(to="api.certification")),
                (
                    "college",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.college"
                    ),
                ),
                ("projects", models.ManyToManyField(to="api.project")),
                ("skills", models.ManyToManyField(to="api.skill")),
                ("work_experience", models.ManyToManyField(to="api.workexperience")),
            ],
        ),
    ]