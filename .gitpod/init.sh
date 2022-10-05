#!/bin/bash

#init db
psql --command "CREATE USER postgres WITH SUPERUSER PASSWORD 'mysecretpassword';" 

#reset app 
gp env PHX_APP=""
eval $(gp env -e) 
