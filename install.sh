#!/bin/bash

cd services
  for D in *; do
    if [ -d "${D}" ]; then
        cd "${D}"
        rm -rf node_modules
        npm install
        cd ..
    fi
  done
cd ..