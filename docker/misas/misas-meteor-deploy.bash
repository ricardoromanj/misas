#!/bin/bash - 
#===============================================================================
#
#          FILE: misas-meteor-deploy.bash
# 
#         USAGE: ./misas-meteor-deploy.bash 
# 
#   DESCRIPTION: Runs Meteor application with the given GIT refs.
# 
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Victor Fernandez (vft), victor.j.fdez@gmail.com
#  ORGANIZATION: 
#       CREATED: 07/05/2016 22:17
#      REVISION:  ---
#===============================================================================

. /etc/misas/misas-git.bash


misas_run ()
{
  #uses whichever enviroment variables are passed in
  meteor npm install 
  meteor 
}	# ----------  end of function misas_run  ----------

git_get-commit
misas_run
