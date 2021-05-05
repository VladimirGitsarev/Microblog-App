from django.shortcuts import render


def index(request):
    return render(request, 'chat/index.html')


def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name,
        'username': request.user.username,
        'token': request.headers['Authorization'].split(' ')[-1] if 'Authorization' in request.headers else None
    })