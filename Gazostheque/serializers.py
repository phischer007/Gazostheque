from rest_framework import serializers 
from Gazostheque.models.material_model import Materials
from Gazostheque.models.owner_model import Owners
from Gazostheque.models.user_model import CustomUsers
from Gazostheque.models.notification_model import Notifications

from taggit.serializers import TagListSerializerField 
 
# Here, we're defining special kind of class called 'serializers'. 
# These classes help us convert complex data from our models into a format that can be easily transferred over the web.

class MaterialSerializer(serializers.ModelSerializer):
    # tags = TagListSerializerField()  # Add this line for tags
    tags = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only=True  # If you don't want tags in the output
    )

    class Meta:
        model = Materials
        fields = '__all__'

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owners
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUsers
        exclude = ('password',) #comma to make it a tuple, not error

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = '__all__'