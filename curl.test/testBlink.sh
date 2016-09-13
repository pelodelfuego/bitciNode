#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"type":"sequence","action":[{"type":"onOff","target":"Lumière N01","action":"on"}, {"type":"onOff","target":"Lumière N01","action":"off","delay":1000}]}' http://localhost:3000/cmd
