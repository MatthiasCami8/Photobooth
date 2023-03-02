"""
This is the file that is invoked to start up a development server. It
imports the app from your package and runs it. This won't be used in
production, but can be useful for local testing.

In production, a Python WSGI HTTP Server like gunicorn will instead run the
app for you. This can be defined through an entrypoint in the Dockerfile.
"""

import logging
import os

from app import flask
APP = flask.create_app()

if __name__ == '__main__':
    print("Starting souvenir-microservice...")
    from waitress import serve
    serve(APP, host='0.0.0.0', port=os.environ.get('PORT', 8080))
