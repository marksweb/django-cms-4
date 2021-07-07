#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(filename='.environment'))


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    if os.environ.get('CLEAN_PYC') == 'yes' and 'clean_pyc' not in sys.argv:
        # sys.stdout.write('\nCleaning .pyc files...')
        proj, _ = os.path.split(__file__)
        cmd = "find '{d}' -name '*.pyc' -delete".format(d=proj or '.')
        os.system(cmd)
        # sys.stdout.write('done\n\n')

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
