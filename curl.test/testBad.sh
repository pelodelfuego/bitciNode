#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"type":"onOff","target":"Lqdssqd1","action":"off"}' http://localhost:3000/cmd
curl -H "Content-Type: application/json" -X POST -d '{"type":"onOff","target":"Lumière N01","action":"osdsff"}' http://localhost:3000/cmd
