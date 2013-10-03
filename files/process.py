""" 
file: process.py
language: python3
author: Ben Grawi <bjg1568@rit.edu>
date: October 2013
description: Simple json parsing based on an argument. Proof of concept really.
"""
import json
import sys
print(json.dumps({'name':sys.argv[1]+' (from Python)'}), end="")
