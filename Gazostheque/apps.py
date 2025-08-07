from django.apps import AppConfig


class GazosthequeConfig(AppConfig):
    name = 'Gazostheque'

    # Registering the signals when the app is ready
    def ready(self):
        import Gazostheque.signals