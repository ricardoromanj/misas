#!/bin/bash

set -x

check_env ()
{
  local env_varname="`compgen -e $1`"
  if [ "$env_varname" != "" -a "$env_varname" == "$1" ]; then
    return 0
  fi
  return 1
}	# ----------  end of function check_env  ----------

git_get-commit ()
{
  if [ ! -a "./.git/" ]; then
    git init
    git remote add origin $MISAS_GITHUB_URL
  fi
  git fetch origin $MISAS_GITHUB_REF
  git reset --hard FETCH_HEAD
}	# ----------  end of function git_get-commit  ----------

#check enviroment variables
if check_env "MISAS_GITHUB_URL" && \
   check_env "MISAS_GITHUB_REF" ; then
  : # noop op do nothing
else 
  echo "Error: git enviroment variables missing"
  exit 1;  
fi


