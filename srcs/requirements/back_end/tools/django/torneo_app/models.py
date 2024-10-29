from django.db import models
from users.models import PongUser

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(PongUser, null=True, blank=True, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=True)
    participants = models.ManyToManyField(PongUser, related_name='tournaments', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

