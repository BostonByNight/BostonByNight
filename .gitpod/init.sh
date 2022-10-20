#!/bin/bash

#init db
psql --command "CREATE USER postgres WITH SUPERUSER PASSWORD 'mysecretpassword';" 

# Installing Back End dependencies
mix deps.get && mix deps.compile

# Creating and migrating database
mix ecto.create
cd apps/vtm_auth && mix ecto.migrate && cd ../../
cd apps/vtm && mix ecto.migrate && cd ../../

mix run apps/vtm_auth/priv/repo/seeds.exs
mix run apps/vtm/priv/repo/seeds.exs
mix run apps/vtm/priv/repo/seeds_havens.exs
mix run apps/vtm/priv/repo/seeds_locations.exs
mix run apps/vtm/priv/repo/seeds_templates.exs

# Changing directory to assets
cd apps/vtm_web/assets

# Installing yarn 2
yarn set version berry

# Installing Front End dependencies
yarn install
yarn build

