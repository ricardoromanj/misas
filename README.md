MISAS
=====

## What is this?
This is a repository for a realtime website that shows mexican churches
schedules algo with other information.

## Development

Get env.zip from another developer which contains all of the files 
necessary for containers.

### env.zip explained

env.zip contains several files as explained here.

### Development Containers

#### Option 1 - All Development Running in Containers

```bash
#from misas/ directory
#start all containers
docker-compose up -d 
```

#### Option 2 - Meteor runs without a Container and the rest do

```bash
#from misas/ directory
#start elasticsearch container
docker-compose up -d search_dev 
#start mongo container
docker-compose up -d misasbundledb_dev
#setup meteor
source env.sh
meteor --settings dev.settings.json
```
### 

## Contributors
* Ricardo Roman
* Victor Fernandez
