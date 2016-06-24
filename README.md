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

#### Option 2 - Meteor runs without a Container on own computer and the rest run on Containers

```bash
#from misas/ directory
#start elasticsearch container
docker-compose up -d search_dev 
#start mongo container
docker-compose up -d misasbundledb_dev
#setup meteor
#env.sh contains configuration of server ES, Meteor URL, and API keys
source env.sh         
#dev.settings.json configurations used mostly to put them in the client
meteor --settings dev.settings.json
```
### 

## Contributors
* [Ricardo Roman](https://github.com/roman0316)
* [Victor Fernandez](https://github.com/victor-fdez)
