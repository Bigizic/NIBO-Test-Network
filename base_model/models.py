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

    def to_dict(self):
        """returns a dictionary representation of the class attributes
        """
        my_dict = self.__dict__.copy()
        my_dict['created_at'] = my_dict['created_at'].strftime(
                "%Y-%m-%dT%H:%M:%S.%f")

        del my_dict['_state']
        my_dict['id'] = str(my_dict['id'])
        return my_dict

    def id_encryption(self, text: str) -> str:
        """Simple encryption for a text, changes keyword
        """
        encrypted = ""
        offset = 3
        for char in text:
            if char.isalpha():
                new = chr(((ord(char) - ord('a') + offset) % 26) + ord('a'))
                encrypted += new
            elif char.isdigit():
                new_digit = str((int(char) + offset) % 10)
                encrypted += new_digit
            else:
                encrypted += char
        return encrypted

    def id_decryption(self, text: str) -> str:
        """Simple decryption for a text, changes keyword to original
        """
        encrypted = ""
        offset = 3
        for char in text:
            if char.isalpha():
                new = chr(((ord(char) - ord('a') - offset) % 26) + ord('a'))
                encrypted += new
            elif char.isdigit():
                new_digit = str((int(char) - offset) % 10)
                encrypted += new_digit
            else:
                encrypted += char
        return encrypted
