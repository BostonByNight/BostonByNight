#!/bin/bash

#init db
psql --command "CREATE USER postgres WITH SUPERUSER PASSWORD 'mysecretpassword';" 

#reset app 
eval $(gp env -e) 
