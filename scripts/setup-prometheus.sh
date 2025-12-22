#!/usr/bin/bash

cd ../prometheus

USERNAME=$(sed -n '1p' prometheus.env)
API_KEY=$(sed -n '2p' prometheus.env)

sed -i "s|username:.*|username: $USERNAME|g" prometheus.yml
sed -i "s|password:.*|password: $API_KEY|g" prometheus.yml

echo "Done"