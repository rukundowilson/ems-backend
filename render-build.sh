#!/bin/bash
set -e

# Install build tools needed for bcrypt
apt-get update
apt-get install -y build-essential python3

# Then run npm install and build
npm install
npm run build
