#!/bin/bash

#xscreensaver-command -activate

gnome-terminal -e "bash -c 'cd /home/ml6/Desktop/photobooth/nl-souvenir-photobooth/frontend;\
BROWSER=none yarn start;\
exec $SHELL'" &
gnome-terminal -e "bash -c 'cd /home/ml6/Desktop/photobooth/xmas2021-souvenir-photobooth/backend/souvenir-microservice;\
source ~/miniforge3/etc/profile.d/conda.sh;\
conda activate simswap;\
export PYTHONPATH=/usr/lib/python3.6/dist-packages:$PYTHONPATH;\
OPENBLAS_CORETYPE=ARMV8 python3 run.py;\
exec $SHELL'" &
gnome-terminal -e "bash -c 'sleep 1m;\
xinput set-prop \"Touch Device FC42WH00DL-CT-B2-20P\" --type=float \"Coordinate Transformation Matrix\" 0 -1 1 1 0 0 0 0 1
echo \"Rotated touchscreen\";\
exec $SHELL'"
#xinput set-prop "Touch Device FC42WH00DL-CT-B2-20P" --type=float "Coordinate Transformation Matrix" 0 -1 1 1 0 0 0 0 1
#xscreensaver-command -deactivate
chromium-browser http://localhost:3000 --kiosk

