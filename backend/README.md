## Deploying to cloud run

To deploy the backend to cloud run, follow these steps:

- In a terminal, go to the *souvenir-microservice* subfolder.
- Make sure you're authenticated with gcp (by running 'gcloud auth login')
- Run 'docker build -t cloud-run .'
- Run 'docker tag cloud-run eu.gcr.io/$PROJECT_ID/cloud-run
- Run 'docker push cloud-run eu.gcr.io/$PROJECT_ID/cloud-run
- Deploy this image on [cloud run in gcp](https://cloud.google.com/run/docs/deploying) 

For more information of the backend code and other requirements (such as the different event arcs), go to the README in the souvenir-microservice subfolder.