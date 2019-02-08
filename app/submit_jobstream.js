/*
 * Licensed Materials - Property of HCL *
 * (C) Copyright HCL Technologies Ltd. 2017, 2019 All rights reserved.
 * Trademark of HCL Technologies Limited
 */

/* eslint-disable no-console */
var rp = require('request-promise-native');
var fs = require('fs');
var ini = require('ini');
var args = require('cli.args')('d:');

/*
 * Customizable variables
 */
var delay = 60; //in minutes
var jsName = 'SIMPLEREST';
var workstationName = 'AZ_CLOUD';
var variables = [
  { key: 'URL', value: 'http://httpbin.org/post' },
  { key: 'BODY', value: 'mydata' }
];


var iatime = Date.now();

var config = ini.parse(fs.readFileSync('./waconn.ini', 'utf-8'));
var server = config.WASERVER;
var urls = server.hosts.split(',');

var auth = {
  'user': server.user,
  'pass': server.pwd,
  'sendImmediately': false
};

// Currently using only a single hostname
var url = urls[0];

rp.post(url + '/twsd/model/jobstream/header/query',
  {
    json: { 'filters': { 'jobstreamFilter': { 'jobStreamName': jsName, 'workstationName': workstationName, 'validIn': iatime } } },
    headers: { 'How-Many': '1' },
    auth: auth
  }
).then((body) => {
  var len = body.length;
  if (len > 0) {
    makeandsubmit(body[0]);
  } else {
    console.log('Error, no job stream found');
  }
}).catch((err) => {
  console.log('Query Error: ' + err);
});

function makeandsubmit(js) {
  console.log('The js id is: ' + js.id);
  var subinfo = {
    inputArrivalTime: new Date(iatime),
  };

  console.log('make parameters: ' + JSON.stringify(subinfo));
  rp.post(url + '/twsd/plan/current/jobstream/' + js.id + '/action/make_jobstream',
    {
      json: subinfo,
      auth: auth
    }
  ).then((body) => {
    console.log('Make successful');
    console.log(body);
    submit(body);
  }).catch((err) => {
    console.log('Make Error: ' + err);
  });
}

function submit(jsi) {
  if (delay > 0) {
    jsi.timeRestriction.timeDependent = true;
    jsi.timeRestriction.startTime = new Date(iatime+delay*60000);
  } 
  var subinfo = {
    inputArrivalTime: iatime,
    jobstream: jsi,
    variableTable: variables
  };

  console.log('submit parameters: ' + JSON.stringify(subinfo));
  rp.post(url + '/twsd/plan/current/jobstream/action/submit_jobstream',
    {
      json: subinfo,
      auth: auth
    }
  ).then((body) => {
    console.log('Submit successful');
    console.log(body);
  }).catch((err) => {
    console.log('Submit Error: ' + err);
  });
}
