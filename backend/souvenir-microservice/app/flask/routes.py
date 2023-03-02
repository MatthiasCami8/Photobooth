"""
Connexion automatically handles HTTP requests based on the swagger spec.
Parameters defined in the swagger spec are automatically mapped to the Python
views as named parameters.

This file is where your routes (endpoints) are defined. This file should only
contain logic related to the routes themselves (eg. parameter checking). Any
app logic should be moved to core.py.
"""

from app import core
import base64

from flask import request
from helpers.storage_helper import initiate_existing_folder_structure

# If the cloud run service is redeployed, the folder structure (for different folders in
# dfp-source-pictures bucket) should be created in the temp paths for downloads
initiate_existing_folder_structure()


class Swap:
    @staticmethod
    def swap():
        """
        Swap endpoint from cloud run service
        Returns:

        """
        content = request.json
        source_file = content["name"]

        return core.swap(source_file)

    @staticmethod
    def detect_faces():
        """
        Face detection endpoint from cloud run service
        Returns:

        """
        content = request.json
        source_file = content["name"]

        return core.detect_faces(source_file)
