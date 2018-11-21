#!/bin/bash

grunt build-prod --force
cp -R src/styles/customvendor/fonts build/targets/prod/assets/css
cp -R vendor/summernote/dist/font build/targets/prod/assets/css