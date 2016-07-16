#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"type":"sequence","action":[{"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"on"}, {"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"off","delay":1000}]}' http://localhost:3000/cmd
