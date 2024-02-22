from django.shortcuts import render, redirect
# from .forms import FileUploadForm

# Create your views here.

# def upload_initial(request):
#     if request.method == 'POST':
#         form = FileUploadForm(request.POST, request.FILES)
#         if form.is_valid():
#             form.save()
#             return redirect('success_url')  # redirect to a new URL if upload was successful
#     else:
#         form = FileUploadForm()
#     return render(request, 'upload/upload.html', {'form': form})
