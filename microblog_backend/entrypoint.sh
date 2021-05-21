python manage.py migrate
python manage.py runserver 0.0.0.0:8000 &
serverProcess=$!
python manage.py bot &
tgBotProcess=$!
wait $serverProcess $tgBotProcess
