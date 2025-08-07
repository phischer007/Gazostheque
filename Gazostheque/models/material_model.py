from django.db import models
from django.utils import timezone
from datetime import timedelta

from taggit.managers import TaggableManager

LAB_CHOICES = [
    ("LIPhy", 'LIPhy'),
    ("IGE", 'IGE'),
]

class Materials(models.Model):
    """
    This model represents a material in the system.
    """
    material_id = models.AutoField(primary_key=True, serialize=False, verbose_name='ID')
    material_title = models.CharField(max_length=100)
    team = models.CharField(max_length=100, null=True, blank=True)
    qrcode = models.TextField(null=True, blank=True)
    origin = models.CharField(max_length=100, null=True)
    owner = models.ForeignKey('Owners', on_delete=models.CASCADE, null=True, related_name='owner_materials')
    codeCommande = models.CharField(max_length=100, null=True)
    codeBarres = models.CharField(max_length=100, null=True)
    size = models.CharField(max_length=200, null=True)
    levRisk = models.CharField(max_length=200, null=True)

    lab_destination = models.CharField(
        max_length=100, 
        blank=True, 
        choices=LAB_CHOICES,
    )
    date_arrivee = models.DateTimeField(null=True, blank=True)
    date_depart = models.DateTimeField(null=True, blank=True)

    # The date and time when the material was created.
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    # tags field
    tags = TaggableManager(blank=True)
    
    USERNAME_FIELD = 'material_title'

    class Meta:
        """
        This is the metadata for the Materials model.
        """
        db_table = 'Materials'
        verbose_name_plural = "Materials"
    
    def __str__(self):
        return self.material_title