from django import forms
from .models import Msgtest



class PostForm(forms.ModelForm):
    class Meta:
        model = Msgtest
        fields = ['msg']