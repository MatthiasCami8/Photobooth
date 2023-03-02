#!/bin/bash

gnome-terminal -e "bash -c 'sleep 10s;\
xinput set-prop \"Touch Device FC42WH00DL-CT-B2-20P\" --type=float \"Coordinate Transformation Matrix\" 0 -1 1 1 0 0 0 0 1
echo \"Rotated touchscreen\";\
exec $SHELL'"


#xrandr -o left
#xinput set-prop "Touch Device FC42WH00DL-CT-B2-20P" --type=float "Coordinate Transformation Matrix" 0 -1 1 1 0 0 0 0 1

