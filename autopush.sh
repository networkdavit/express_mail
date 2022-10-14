#!/bin/bash
git add .
git rm .env --cache
git commit -m "Updating"
git push
