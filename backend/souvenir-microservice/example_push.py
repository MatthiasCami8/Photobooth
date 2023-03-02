from google.cloud import pubsub_v1
from google.oauth2 import service_account

# Credentials to push to pubsub (generated from service account on gcp as json, not necessary if
# frontend would already be authenticated to gcp in someway I suppose)
gcp_service_account_credential_path = 'polar-storm.json'
credentials = service_account.Credentials.from_service_account_file(
   str(gcp_service_account_credential_path))

project_id = 'polar-storm-335415'
topic_id = 'swap-faces'
publisher = pubsub_v1.PublisherClient(credentials=credentials)
topic_path = publisher.topic_path(project_id, topic_id)

# Template should be "MuseumX/Filename"
data_str = "youseum_rfid_sessions/tBhdyVxB50ne6t4hL7j2"
# Data must be a bytestring
data = data_str.encode("utf-8")

# When you publish a message, the client returns a future.
future = publisher.publish(topic_path, data)
print(future.result())

print(f"Published messages to {topic_path}.")