#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"type":"onOff","target":"lumière 12","action":"on"}' http://localhost:3000
