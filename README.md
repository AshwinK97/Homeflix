# Homeflix

Distributed Systems Final Project.

## Group Members

| Name                | Student ID |
| ------------------- | ---------- |
| Jasindan Rasalingam | 100584595  |
| Darron Singh        | 100584624  |
| Kaushal Patel       | 100586212  |
| Ashwin Kamalakannan | 100584423  |

## Setup

- NodeJS 12.13 and npm 6.13 or higher are required for running both the server and client applications.

- Ensure that firewall allows local http traffic or is disabled.

- On Linux, if project path contains spaces, the several packages may break during installation.

- **Follow setup instructions in [server](https://github.com/AshwinK97/Homeflix/blob/master/server/README.md) and [client](https://github.com/AshwinK97/Homeflix/blob/master/client/README.md) folders.**

## Overview

Home video streaming server and client application. Can be used to upload and stream personally owned video content to other devices around the house and to friends. Ex. Phones, Smart TVs and laptops. Users can watch videos in sync and chat while viewing. All uploaded videos are safely encrypted.

![overview](https://i.imgur.com/YLrGfgR.png)
Figure 1: Multiple clients streaming video and using the sync stream feature

## Main Features

1. Securely encrypted video storage solution.
2. Source quality video streaming both at home and over internet.
3. Multi-user, synchronized video streaming with < 2s delay.
4. Live chat for synchronized and standard video streaming.
5. Users have zero setup, simply use a web address.

## Future Work

- Production ready security and privacy
  - Full user system with authentication
  - HTTPS and end to end to encryption
  - configuration management system
  - secure keys should be stored on seperate sever
  - Database should have authentication
- Clean up some web sockets bugs that can occur when multi
- Develop hardware solutions that can be shipped as units
  - Raspberry Pi + storage, preinstalled with Homeflix
  - Optimized configuration to support server and client
