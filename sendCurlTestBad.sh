#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"type":"onOff","target":"Eclairage qlkfjqfj- 1er Et - Bureau - Plafonnier","action":"off", "delay":0}' http://localhost:3000/cmd
curl -H "Content-Type: application/json" -X POST -d '{"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"osdsff", "delay":0}' http://localhost:3000/cmd
#curl -H "Content-Type: application/json" -X POST -d '{"type":"onOff","target":"Eclairage qlkfjqfj- 1er Et - Bureau - Plafonnier","action":"off", "delay":0}' http://localhost:3000/cmd
