# django-cms-4

This is a fairly basic setup for a django-cms v4 project.

It uses [pip-tools](https://github.com/jazzband/pip-tools) to manage requirements and installs what you need including;

* django-cms 4
* django-storages
* djangocms-alias
* djangocms-pageadmin
* djangocms-text-ckeditor
* djangocms-url-manager
* djangocms-versioning
* djangocms-versioning-locking

The django project settings are largely powered by environment variables and `manage.py` gets
loads them for you using [environs](https://pypi.org/project/environs/) and there's an example
file in the project (`.env-example`)

Database defaults to postgres, but all database settings can be set from the environment.

There's also a docker setup which might be more useful to some.
