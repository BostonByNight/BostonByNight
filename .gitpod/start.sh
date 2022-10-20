#!/bin/bash

mix phx.server & 
cd apps/vtm_web/assets && \
yarn podstart
