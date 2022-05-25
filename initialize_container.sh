#!/bin/bash

#Export the current commitID, branch and remote that the build was made from
export GIT_FETCH_HEAD=`cat .git/FETCH_HEAD`

#Read all env variables as output by printenv and put them into an object stored in window.env
Read all env variables as output by printenv and put them into an object stored in window.env
RESULT='window.env = {'
RESULT+='API_URL: "'$API_URL
RESULT+='", OAUTH_CLIENT_ID: "'$OAUTH_CLIENT_ID
RESULT+='", OAUTH_TOKEN_URL: "'$OAUTH_TOKEN_URL
RESULT+='", production: '$PRODUCTION
RESULT+='}'

PATH=`ls dist/`
OUTPUTPATH="dist/environment.js"

echo $RESULT > $OUTPUTPATH
