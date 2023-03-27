"""
Script that calls the CoGent database through their API and download data based on a query
"""

import requests
import pandas as pd

from SPARQLWrapper import SPARQLWrapper
from xml.dom.minidom import Document


def run_query() -> Document:
    """
    Runs query on the CoGent database and returns the full result XML Document

    Returns:
        Document: XML Document containing results
    """

    sparql = SPARQLWrapper(
        "https://stad.gent/sparql"
    )

    sparql.setQuery("""
    PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/>

    SELECT ?subject # FROM <http://stad.gent/ldes/stam>
    WHERE {
    ?object cidoc:P102_has_title ?title.
    ?object cidoc:P129i_is_subject_of ?subject.
    FILTER (regex(?title, "portret", "i"))
    }
    """)

    return sparql.queryAndConvert()


def save_data(query_output: Document) -> None:
    """
    Extracts the images, and saves them, together with a csv to keep track of metadata

    Args:
        query_output (Document): The output of the query from which to extract and save data
    """

    image_list = []
    link_list = []
    # Get the api URL that contains metadata
    results = query_output.getElementsByTagName("result")
    for result in results:
        uri = result.getElementsByTagName("uri").item(0).firstChild.data

        # Retrieve the actual image URL
        try:
            r = requests.get(url=uri)
        except Exception as e:
            print(e)
            print("FIRST")
            continue
        data = r.json()

        if "rendering" not in data:
            continue

        object_id = data["rendering"]["@id"]
        id_split = object_id.split("/")[:-1]
        id_clean = "/".join(id_split)

        for sequence in data["sequences"]:
            for canvas in sequence["canvases"]:
                for image in canvas["images"]:
                    img_url = image["resource"]["@id"]

                    # Use that img_url to create a unique filename to save the image
                    split = img_url.split("/")
                    img_name = split[7]

                    # Save the image
                    try:
                        img_data = requests.get(img_url).content
                    except Exception as e:
                        print(e)
                        continue
                    with open("./images/" + img_name, 'wb') as handler:
                        handler.write(img_data)
                    image_list.append(img_name)
                    link_list.append(id_clean)

    # Save the metadata
    df = pd.DataFrame({'image_name': image_list, 'object_link': link_list})
    df.to_csv("metadata.csv")


def main():
    try:
        query_output = run_query()
        save_data(query_output)

    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()
