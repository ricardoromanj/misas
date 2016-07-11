#!/bin/bash - 
#===============================================================================
#
#          FILE: misas-node-build.bash
# 
#         USAGE: ./misas-node-build.bash 
# 
#   DESCRIPTION: Runs Meteor to build node application for the input GIT refs.
# 
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Victor Fernandez (vft), victor.j.fdez@gmail.com
#  ORGANIZATION: 
#       CREATED: 07/05/2016 22:14
#      REVISION:  ---
#===============================================================================

. /etc/misas/misas-git.bash

misas_run ()
{
  #uses whichever enviroment variables are passed in
  meteor npm install 
  meteor build --architecture os.linux.x86_64 --directory build/ --server-only
}	# ----------  end of function misas_run  ----------

git_get-commit
misas_run
