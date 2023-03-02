from google.cloud import firestore

db = firestore.Client()


def get_portrait_and_logo(collection_name: str, source_file: str):
    """
    Retrieves portrait filename (and logo file name if present) from the firestore document
    Args:
        collection_name (str): The collection name in firestore
        source_file (str): The document name in firestore (which should be the same as the source
            file name)

    Returns:
        The portrait file name and logo file name
    """
    logo = 0
    collection = db.collection(collection_name)
    doc = collection.document(source_file)
    content_dict = doc.get().to_dict()

    # if 'logo' in content_dict:
    #     logo = content_dict['logo']

    portrait_file = content_dict['portrait_file']

    return portrait_file, collection_name


def set_faces_count(collection_name: str, faces_count: int, file_name: str) -> None:
    """Sets the faces count in firestore

    Args:
        collection_name (str): Collection name in firestore
        faces_count (int): The amount of faces counted
        file_name (str): Document name in firestore

    Returns:

    """
    data = {
        u'faces_count': faces_count
    }

    db.collection(collection_name).document(file_name).update(data)


def set_done(collection_name: str, file_name: str):
    """Sets the "Done" field of the document to True

        Args:
            collection_name (str): Collection name in firestore
            file_name (str): the Document to be set as "Done"
    """
    doc_ref = db.collection(collection_name).document(file_name)
    doc_ref.update({u'done': True})
