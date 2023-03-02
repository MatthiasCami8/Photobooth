FROM gcr.io/deeplearning-platform-release/base-cpu
LABEL maintainer="ML6"

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

COPY requirements.txt /
RUN pip3 install Cython
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /app
WORKDIR /app

RUN mkdir arcface_model
RUN mkdir -p ./insightface_func/models
RUN mkdir -p ./parsing_model/checkpoint
RUN mkdir -p ./parsing_model/resnet_checkpoint

RUN gsutil cp -r gs://souvenir-swap-storage/model_checkpoints/arcface_checkpoint.tar ./arcface_model/arcface_checkpoint.tar
RUN gsutil cp -r gs://souvenir-swap-storage/model_checkpoints/79999_iter.pth ./parsing_model/checkpoint/79999_iter.pth
RUN gsutil cp -r gs://souvenir-swap-storage/model_checkpoints/resnet18.pth ./parsing_model/resnet_checkpoint/resnet18.pth
RUN gsutil cp -r gs://souvenir-swap-storage/model_checkpoints/checkpoints.zip .
RUN gsutil cp -r gs://souvenir-swap-storage/model_checkpoints/antelope.zip .

RUN unzip -o ./checkpoints.zip -d ./checkpoints
RUN unzip -o ./antelope.zip -d ./insightface_func/models/

ENTRYPOINT ["python3"]
CMD ["run.py"]
