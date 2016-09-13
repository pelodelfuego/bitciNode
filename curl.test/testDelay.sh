#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"type":"onOff","target":"L1","action":"on", "delay":1000}' http://localhost:3000/cmd
