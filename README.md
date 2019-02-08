# WA REST API Node.js samples
This repository contains Node.js Rest API samples for IBM/HCL Workload Automation.  
Swagger documentation of the REST APIs is available here: https://start.wa.ibmserviceengage.com/twsd/

To run the sample:

1. Customize app/waconn.ini with the hostname and credentioal of your Workload Automation server. On IBM Workload Automation on Cloud you can get the hostname and credentials from the dashboard under *Configuration -> Generate credentials*
2. Initialize the libraries running `npm install`
2. Customize the sample code based on your needs, the most common variables are after *Customizable variables* comment

## [Submit jobstream in plan](https://github.com/WAdev0/WA_REST_API_Node_samples/blob/master/app/submit_jobstream.js)

This sample submits a jobstream, passing some variables and setting a time dependency some minutes after the submission time. The sample is based on the workload definitions contained in SIMPLEREST.zip workload application.
To run the script run: `npm run submit_jobstream`