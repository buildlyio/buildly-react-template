#!/bin/bash

#Export the current commitID, branch and remote that the build was made from
export GIT_FETCH_HEAD=`cat .git/FETCH_HEAD`

#Read all env variables as output by printenv and put them into an object stored in window.env
RESULT='window.env = {'
RESULT+='"API_URL": "'$API_URL
RESULT+='", "OAUTH_CLIENT_ID": "'$OAUTH_CLIENT_ID
RESULT+='", "OAUTH_TOKEN_URL": "'$OAUTH_TOKEN_URL
RESULT+='", "MAP_API_KEY": "'$MAP_API_KEY
RESULT+='", "GEO_CODE_API": "'$GEO_CODE_API
RESULT+='", "ALERT_SOCKET_URL": "'$ALERT_SOCKET_URL
RESULT+='", "CUSTODIAN_URL": "'$CUSTODIAN_URL
RESULT+='", "VERSION_NOTES": "'$VERSION_NOTES
RESULT+='", "EMAIL_REPORT_URL": "'$EMAIL_REPORT_URL
RESULT+='", "session_timeout": '$SESSION_TIMEOUT
RESULT+=', "hide_notification": '$HIDE_NOTIFICATION
RESULT+=', "production": '$PRODUCTION
RESULT+='}'

PATH=`ls dist/`
OUTPUTPATH="dist/environment.js"

echo $RESULT > $OUTPUTPATH
