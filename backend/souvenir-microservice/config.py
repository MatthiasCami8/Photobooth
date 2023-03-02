"""
This file contains most of the configuration variables of your app.

You can read environment variables here for usage in your app. Environment
variables for a container can be set in the kubernetes deployment.yaml
file. These variables can come from ConfigMaps (environment specific
variables) and secrets (sensitive information).
"""

import os

SPECIFICATION_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                 'configs')
PORTRAITS_DIR = os.path.join('data', 'portraits')
SOURCE_FACES_DIR = os.path.join('data', 'source_faces')
RESULTS_DIR = os.path.join('data', 'results')
RESULTS_BUCKET = 'dfp-results'
SOURCE_FACES_BUCKET = 'dfp-source-pictures'
PORTRAIT_BUCKET = 'dfp-portraits'