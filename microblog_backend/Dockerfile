FROM python:3.8

RUN mkdir /app
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY microblog_backend /app
COPY Pipfile Pipfile.lock /app/
COPY entrypoint.sh /app/

RUN pip install pipenv
RUN pipenv install --system

RUN chmod +x entrypoint.sh
CMD ./entrypoint.sh
