#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"type":"onOff","target":"Eclairage - Cave - Lambris (mur Sud)","action":"on"}' http://localhost:3000
