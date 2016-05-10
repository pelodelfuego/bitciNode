Bitcinode
========


Bitcinode is an adapter to easily interact with a bitcino domotic server without using OpenWebNet language.

```
User <==== Json Message ====> Bitcinode <==== Telnet ====> Bitcino
```


Installation
-------------
Bitcinode is a node.js app designed to be running on a server (for a example a raspberry Pi) in the same local network that bitcino server.

Also, you want to make sure bitcinode is hosted in the IP range autorized by bitcino.

Now everything is settle ouside, let's go inside.
We need to give bitcinode an association between names and bitcino entry points (you can find them in myHomeSuite).
You can choose the proper name you want to use and create the following files:

 - config.onOff.json

Everything is good now, let's go for enlight the installation !

Usage
-------



Command
------------
You can send direct command to the server (``localhost:3000/cmd``) by using a POST request containing a json file.
Bitchinode will answer you once the message is proceeded (or an error occured).

Example:
```
curl -H "Content-Type: application/json" -X POST -d '{"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"on", "delay":0}' http://localhost:3000

```

###onOff
####on
```
{"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"on", "delay":0}
```

####off
```
{"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"off", "delay":0}
```
####state
```
{"type":"onOff","target":"Eclairage - 1er Et - Bureau - Plafonnier","action":"state", "delay":0}
```

###Combine


Scenario
----------



Rule
-----





//TODO:
timeout ar waitfor ?
