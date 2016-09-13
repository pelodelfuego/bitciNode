#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"type":"sequence","action":[{"type":"onOff","target":"Eclairage - 1er Et qsfsqf- Bureau - Plafonnier","action":"on"}, {"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"off"}]}' http://localhost:3000/cmd

curl -H "Content-Type: application/json" -X POST -d '{"type":"sequence","action":[{"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"on"}, {"type":"onOff","target":"Eclairage - qslkfj1er Et - Bureau - Plafonnier","action":"off"}]}' http://localhost:3000/cmd
