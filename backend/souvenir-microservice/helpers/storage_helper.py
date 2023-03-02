"""
Module containing code to interact with Google Cloud Storage.
"""
from google.cloud import storage
import logging
import os
from pathlib import Path

def transfer_file(bucket_name: str, object_name: str, destination_file_name: str) -> None:
    """Transfer file from bucket to folder with temporary path

    Args:
        bucket_name (str): Name of the bucket
        object_name (str): Name of the object
        destination_file_name (str): The destination to which the file should be copied

    Returns:

    """
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(object_name)

    Path(destination_file_name).parent.mkdir(exist_ok=True, parents=True)
    blob.download_to_filename(destination_file_name)

    print(
        "Downloaded storage object {} from bucket {} to local file {}.".format(
            object_name, bucket_name, destination_file_name
        )
    )


def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)


def initiate_existing_folder_structure():
    """
        Initiate the existing sub folders from bucket to the data folder
    """
    storage_client = storage.Client()
    blobs = storage_client.list_blobs("dfp-source-pictures")
    for blob in blobs:
        if blob.name[-1] == "/":
            folder = blob.name[0:-1]
            os.makedirs(f'data/source_faces/{folder}', exist_ok=True)
            os.makedirs(f'data/results/{folder}', exist_ok=True)
            os.makedirs(f'data/portraits/{folder}', exist_ok=True)
        elif len(blob.name.split("/")) > 1:
            folder = blob.name.split("/")[0]
            os.makedirs(f'data/source_faces/{folder}', exist_ok=True)
            os.makedirs(f'data/results/{folder}', exist_ok=True)
            os.makedirs(f'data/portraits/{folder}', exist_ok=True)
