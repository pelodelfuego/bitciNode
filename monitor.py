#!/usr/bin/python
# -*- coding: utf-8 -*-

import socket
import sys

gateway_host = "192.168.0.63"       # set here the IP of your gateway
gateway_port = 20000                # set here the port of your gateway

gateway_addr_port = gateway_host, gateway_port

def monitor():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.connect(gateway_addr_port)
        data = sock.recv(1024)
        if data != "*#*1##":        # expect ACK from gateway
            raise Exception("Did not receive expected ACK, but: "+data)
        sock.send("*99*1##")        # Switch session to MONITOR mode
        data = ""
        while 1:
            next = sock.recv(1024)  # now read data from MyHome BUS
            if next == "":
                break               # EOF
            data = data + next
            eom = data.find("##")
            if eom < 0:
                continue;           # Not a complete message, need more
            if data[0] != "*":
                raise Exception("Message does not start with '*': "+data)
            msg = data[0:eom+2]     # message is from position 0 until end of ##
            data = data[eom+2:]     # next message starts after ##
            print msg
            sys.stdout.flush()
    except:
        sock.close()
        print "\nSocket connection closed."
        sys.exit()

if __name__ == "__main__":
    monitor()
