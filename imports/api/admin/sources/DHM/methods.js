import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Parroquias } from '../../../parroquias/collection';

var website;

website = "http://www.dondehaymisa.com/";

Meteor.methods({
  'DHM-parse-all-states': function() {
    var result;
    this.unblock();
    result = HTTP.get(website + "ajax2.asp?op=1&p=1&i=&edo=");
    if (result != null) {
      return result.content;
    }
    return "";
  },
  'DHM-parse-all-cities': function(stateId) {
    var result;
    this.unblock();
    console.log("requesting @" + website + "ajax2.asp?op=2&p=1&e=" + stateId + "&i=&sid=" + Math.random());
    result = HTTP.get(website + "ajax2.asp?op=2&p=1&e=" + stateId + "&i=");
    if (result != null) {
      return result.content;
    }
    return "";
  },
  'DHM-parse-parroquias': function(query) {
    var cityId, result, stateId;
    this.unblock();
    cityId = query.cityId;
    stateId = query.stateId;
    if (cityId == null) {
      cityId = -1;
    }
    if (stateId == null) {
      stateId = -1;
    }
    console.log("requesting @" + website + ("ajax2.asp?op=4&d=1&e=" + stateId + "&m=" + cityId + "hora=0&dia=0&tipo=0&cad=&col=0&expl=1"));
    console.log(" with params: " + stateId + " and " + cityId);
    console.log(query);
    result = HTTP.get(website + ("ajax2.asp?op=4&d=1&e=" + stateId + "&m=" + cityId + "&hora=0&dia=0&tipo=0&cad=&col=0&expl=1"));
    if (result != null) {
      return result.content;
    }
    return "";
  },
  'DHM-parse-parroquia': function(query) {
    var d, id, result;
    this.unblock();
    if (query.id == null) {
      return "";
    }
    if (query.d == null) {
      return "";
    }
    d = query.d;
    id = query.id;
    console.log("requesting @" + website + ("dhm.asp?op=2&id=" + id + "&d=" + d));
    console.log(" with params: " + d + " and " + id);
    console.log(query);
    result = HTTP.get(website + ("dhm.asp?op=2&id=" + id + "&d=" + d));
    if (result != null) {
      return result.content;
    }
    return "";
  }
});
