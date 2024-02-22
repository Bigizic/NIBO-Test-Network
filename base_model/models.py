from django.db import models
import uuid


class BaseModel(models.Model):
    """ Base Model class
    """
    id = models.UUIDField(default=uuid.uuid4(), editable=False, primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True