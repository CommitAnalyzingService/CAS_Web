#CAS Web 

A Web service for viewing the risk of commits to a repository

##Dependencies
###Environment
*May work with older versions, but they are untested...*

* node.js >= 10.8
* npm >= 1.2.23

###Node Packages
These are managed in the package.json file in the project root. Please see this file for specific dependencies. Most are required by Sails.js.
##Installation
1. Clone the repository.
2. Run `npm install` and wait for all node dependencies to download.
3. Copy the `/config/adapters.example.js` to `/config/adapters.js` and add the
correct credentials to the file.
4. To start the server, type `npm start`.