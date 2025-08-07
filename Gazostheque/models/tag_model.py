# # This table will be used to categorize materials for an easy query
# from django.db import models
# from django.utils import timezone
# from django.contrib.auth import get_user_model

# class Tags(models.Model):
#     tag_id = models.AutoField(primary_key=True, serialize=False, verbose_name='ID')
#     # to retrieve who created the tag, accountability
#     user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='user_tag')
#     markup = models.CharField(max_length=100)
#     created_at = models.DateTimeField(default=timezone.now)

#     class Meta:
#         db_table = 'Tags'
#         verbose_name_plural = "Tags"
    
#     def __str__(self):
#         return self.markup
