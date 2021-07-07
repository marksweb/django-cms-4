# Pull base image
FROM python:3.8.3-alpine AS python-base

ENV PYTHONUNBUFFERED 1
ENV PIP_NO_CACHE_DIR 1
ENV PYCURL_SSL_LIBRARY=openssl

COPY requirements.txt /requirements.txt

RUN apk update && apk upgrade && \
    apk add --no-cache postgresql-libs curl jpeg libpng binutils libffi-dev gettext-dev && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev curl-dev linux-headers musl-dev jpeg-dev libpng-dev git && \
    pip install --upgrade pip && \
    pip install -r /requirements.txt && \
    pip install uwsgi==2.0.19.1 && \
    apk --purge del .build-deps


# NPM business
FROM node:10 AS frontend-deps-npm
WORKDIR /

COPY ./package.json /package.json
RUN npm install
COPY . /app
WORKDIR /app
RUN /node_modules/gulp/bin/gulp.js


# Build static collection
FROM python-base AS frontend-deps
COPY --from=frontend-deps-npm /app /app
WORKDIR /app
RUN env `cat build.env` python manage.py collectstatic -v 2 --noinput


# Build final app-container
FROM python-base AS app
COPY . /app
COPY --from=frontend-deps /app/static-collection /app/static-collection
WORKDIR /app
VOLUME /app/static-collection
EXPOSE 8000
EXPOSE 9000
