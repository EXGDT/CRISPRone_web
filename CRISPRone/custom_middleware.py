from django.http import HttpResponse
import traceback

class CatchExcMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        # put your code here
        # logging.error(traceback.format_exc())

        # return Response or None
        return HttpResponse(str(exception + traceback.format_exc()))