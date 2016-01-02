#!/bin/bash
docker run -d --name investmentsdb mongo

docker run -p 3000:3000 -d --name utility.investments --link investmentsdb:mongodb --env-file=docker/env  lmyjo/investments-utility
