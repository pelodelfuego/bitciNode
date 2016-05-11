#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"state", "delay":0}' http://localhost:3000/cmd
