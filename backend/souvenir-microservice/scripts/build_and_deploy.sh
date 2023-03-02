#!/bin/bash

# bash ./scripts/build_and_deploy.sh -p polar-storm-335415 -n cloud-run

# Saner programming env: these switches turn some bugs into errors
set -o errexit -o pipefail -o noclobber -o nounset

# Argument parsing
while [[ "$#" -gt 0 ]]; do case $1 in
  -p|--project) project="$2"; shift;;
  -n|--name) name="$2"; shift;;
  --no-endpoints) endpoints=false;;
  *) echo "Unknown parameter passed: $1"; exit 1;;
esac; shift; done

[ -n "${project-}" ] || (echo "Missing required argument '--project'" && exit 1)
[ -n "${name-}" ] || (echo "Missing required argument '--name'" && exit 1)

echo "Building the docker image..."
gcloud builds submit . -t eu.gcr.io/${project}/${name} --timeout=60m

echo "Deploying the image to Cloud Run..."
gcloud run deploy ${name} --image eu.gcr.io/${project}/${name} \
    --platform managed --region europe-west1 --quiet
