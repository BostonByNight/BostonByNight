#!/bin/bash

#init db
psql --command "CREATE USER postgres WITH SUPERUSER PASSWORD 'mysecretpassword';" 

# Installing Back End dependencies
mix deps.get && mix deps.compile

# Creating and migrating database
mix ecto.create
cd apps/vtm_auth && mix ecto.migrate && cd ../../
cd apps/vtm && mix ecto.migrate && cd ../../

# Installing Front End dependencies
yarn --cwd apps/vtm_web/assets install
yarn --cwd apps/vtm_web/assets build

