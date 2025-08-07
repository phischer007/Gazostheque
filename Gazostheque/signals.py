# signals.py
# File where we define tasks to be performed when receiving signals from a specific model
# on a record update
### Can be combined but better separated for clarity
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from Gazostheque.models.notification_model import Notifications
from Gazostheque.models.material_model import Materials
from django.utils import timezone


# Function to send a notification to material owner when a material is updated for departure
@receiver(post_save, sender=Materials)
def notify_owner_on_material_departure(sender, instance, created, **kwargs):
    if not created:
        # Define the condition for "departure" here. Adjust as needed.
        if instance.date_depart:  # assuming departure_ready is a boolean
            Notifications.objects.create(
                type="Event",
                title="Material Ready for Departure",
                priority="Medium",
                description=f"The material '{instance.material_title}' is marked ready for departure.",
                user=instance.owner  # assuming the material has an 'owner' field
            )

# @receiver(post_save, sender=Materials)
# def notify_owner_on_departure_date_change(sender, instance, **kwargs):
#     """
#     Send a notification to the material's owner when the departure date is changed.
#     """
#     if instance.pk:  # Check if this is an update (not creation)
#         try:
#             original = Materials.objects.get(pk=instance.pk)
#             if original.date_depart != instance.date_depart:  # Check if date_depart changed
#                 # Prepare and send email notification
#                 subject = f"Departure Date Updated for {instance.material_title}"
#                 message = (
#                     f"Hello {instance.owner.name if instance.owner else 'Owner'},\n\n"
#                     f"The departure date for your material '{instance.material_title}' "
#                     f"has been updated from {original.date_depart} to {instance.date_depart}.\n\n"
#                     "Best regards,\n"
#                     "Your Materials Management System"
#                 )
#                 recipient_email = instance.owner.email if instance.owner and instance.owner.email else settings.DEFAULT_FROM_EMAIL
                
#                 send_mail(
#                     subject=subject,
#                     message=message,
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[recipient_email],
#                     fail_silently=False,
#                 )
#         except Materials.DoesNotExist:
#             pass  # New instance, no notification needed
