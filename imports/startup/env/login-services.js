import { ServiceConfiguration } from 'meteor/service-configuration';
import _ from 'lodash';

export function setupService(name){
  /* check both to_upper(name)_CLIENT_ID and
     to_upper(name)_SECRET are defined in env
     if so then upsert variables into service */
  if(name == null){
    displayMsg(name, `Service name is null`);
    return false;  
  }      
  deleteService(name);
  let uName = _.upperCase(name); 
  let clientIdVarName = `${uName}_CLIENT_ID`; 
  let secretVarName = `${uName}_SECRET`; 
  if(process.env[clientIdVarName] == null){
    displayMsg(name, `Enviroment variable ${clientIdVarName} undeclared`);
    return false;
  }
  if(process.env[secretVarName] == null){
    displayMsg(name, `Enviroment variable ${secretVarName} undeclared`);
    return false;
  }
  //get both values for the service
  let valueClientId = process.env[clientIdVarName];
  let valueSecret = process.env[secretVarName];
  displayMsg(name, `${clientIdVarName} = ${valueClientId}`);
  displayMsg(name, `${secretVarName} = ${valueSecret}`);
  ServiceConfiguration.configurations.upsert(
    { service: name },
    {
      $set: {
        clientId: valueClientId, 
        loginStyle: 'popup',
        secret: valueSecret
      }
    }
  )  
  displayMsg(name, 'Successfull setup of service');
  return true
}

function deleteService(name){
  var numRemoved = ServiceConfiguration.configurations.remove({
    service: name
  });
  if(numRemoved <= 0){
    return false;
  }
  displayMsg(name, 'Removed previous declaration of service');
  return true;
}

function displayMsg(name, msg){
  console.log(`(${name}) ${msg}`);
}
