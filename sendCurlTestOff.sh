#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"off"}' http://localhost:3000
