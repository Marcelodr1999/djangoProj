from django import forms
from .models import Display

class PostForm(forms.ModelForm):
    # user_id = forms.IntegerField()
    class Meta:
        model = Display
        fields = ['message', 'msg_date', 'user_id']