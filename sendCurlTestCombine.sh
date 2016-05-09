#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"type":"combine","action":[{"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"on", "delay":0}, {"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"off", "delay":1000}]}' http://localhost:3000
