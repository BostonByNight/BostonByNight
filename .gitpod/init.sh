#!/bin/bash

#init db
sudo psql --command "CREATE USER postgres WITH SUPERUSER PASSWORD 'mysecretpassword';" 

# Installing Back End dependencies
mix deps.get && mix deps.compile

# Installing Front End dependencies
yarn --cwd apps/vtm_web/assets install

