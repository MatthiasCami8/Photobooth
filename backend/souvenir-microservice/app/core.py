"""
This file contains the logic of your app. Everything that is not logic
related should not be in this file. A good example of this are database
connections, which can be factored out into helper files.
"""

import os
import time
from config import RESULTS_BUCKET, SOURCE_FACES_BUCKET, PORTRAIT_BUCKET, RESULTS_DIR
from PIL import Image
from prediction import *
from helpers.storage_helper import transfer_file, upload_blob
from helpers.firestore_helper import set_faces_count, set_done, get_portrait_and_logo
import logging
import cv2


def swap(source_file: str):
    """
    Does the actual face swap into a portrait
    Args:
        source_file (str): the path of the source picture to be swapped (which resides in
        dfp-source-pictures bucket on gcp, and it should be in the sub folder for the specific
        museum/place)

    Returns:

    """
    # Get sub folder and actual file name
    print(f'Source file: {source_file}')
    split_file = source_file.split("/")
    portrait_file, logo = get_portrait_and_logo(split_file[0], split_file[1])

    portrait_img_path = f'data/portraits/{portrait_file}'
    print(f'Using the portrait image with path: {portrait_img_path}')
    if not os.path.exists(portrait_img_path):
        print(f'Downloading portrait image from GCS path: {PORTRAIT_BUCKET}/{portrait_file}')
        transfer_file(PORTRAIT_BUCKET, portrait_file, portrait_img_path)

    # Resize portrait
    MAX_SIZE = (640, 960)
    image = Image.open(portrait_img_path)
    image.thumbnail(MAX_SIZE)
    image.save(portrait_img_path)

    source_img_path = f'data/source_faces/{source_file}'
    print(f'Using the source image with path: {source_file}')
    print(f'Downloading source image from GCS path: {SOURCE_FACES_BUCKET}/{source_file}')
    transfer_file(SOURCE_FACES_BUCKET, source_file, source_img_path)

    # Face swap
    timestamp = time.strftime('%a_%H_%M_%S')
    result_name = f'faceswap_{timestamp}.jpg'
    result_img_path = f'{RESULTS_DIR}/{result_name}'
    swap_many_to_many_faces_pipeline(portrait_img_path, source_img_path, result_img_path, logo)

    print(f'Uploading blob "{result_img_path}" to bucket "{RESULTS_BUCKET}"' + \
                 f'with name "{source_file}"')
    
    # Custom watermark
    if logo == "axelera":
        logo = cv2.imread("simswaplogo/Axelera_white.png")
        img = cv2.imread(result_img_path)
        h_logo, w_logo, _ = logo.shape
        h_img, w_img, _ = img.shape
        #print(f"Logo shape is {logo.shape} and image shape is {img.shape}")
        
        margin = 50
        top_y = h_img - h_logo - margin
        bottom_y = h_img - margin
        left_x = margin
        right_x = w_logo + margin
        destination = img[top_y:bottom_y, left_x:right_x]
        #print(f"Destination is {destination}")
        #print(f"shape of destination is {destination.shape}")
        result = cv2.addWeighted(destination, 1, logo, 0.6, 0)
        
        img[top_y:bottom_y, left_x:right_x] = result
        cv2.imwrite(result_img_path, img)
        
    upload_blob(RESULTS_BUCKET, result_img_path, source_file)

    file_paths = [result_img_path, source_img_path]
    for path in file_paths:
        os.remove(path)

    # Set the "done" field on firestore, so that the frontend can be notified
    set_done(split_file[0], split_file[1])


def detect_faces(source_file: str):
    """
    Face detection -> check how many faces are detected in the image
    Args:
        source_file (str): the path of the source picture to be swapped (which resides in
        dfp-source-pictures bucket on gcp, and it should be in the sub folder for the specific
        museum/place)

    Returns:

    """
    split_path = source_file.split("/")

    # If upload is a directory, no need to detect faces, but need to create the appropriate
    # folder structure
    if split_path[1] == "":
        os.makedirs(f"data/source_faces/{split_path[0]}", exist_ok=True)
        os.makedirs(f"data/results/{split_path[0]}", exist_ok=True)
        os.makedirs(f"data/results/{split_path[0]}", exist_ok=True)
        return "New folder structure was made"
    source_img_path = f'data/source_faces/{source_file}'
    transfer_file(SOURCE_FACES_BUCKET, source_file, source_img_path)

    img_source_whole = cv2.imread(source_img_path)

    try:
        img_source_crop, _ = app_multi.get(img_source_whole, crop_size)
        num_faces = len(img_source_crop)
    except TypeError:
        logging.warning("Face detection failed, amount set to 0")
        num_faces = 0

    os.remove(source_img_path)
    set_faces_count(split_path[0], 1, split_path[1])
