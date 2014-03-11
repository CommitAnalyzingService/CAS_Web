#CAS Web 

A Web service for viewing the risk of commits to a repository

##Dependencies
###Environment
*May work with older versions, but they are untested...*

* node.js >= 10.8
* npm >= 1.2.23

###Node Packages
These are managed in the package.json file in the project root. Please see this file for specific dependencies. Most are required by Sails.js.

Grunt and Bower are both required to be installed globally (on the machine), while Forever is optional, but highly recommended:
```
$ sudo npm install -g grunt-cli
$ sudo npm install -g bower
$ sudo npm install -g forever
```

(You can install these locally, but it is not reccommend as you will have to prepend all of your commands with `./node_modules/PACKAGE_NAME/bin/PACKAGE_NAME` as the commands will not be in your PATH.)

##First-time Installation

1. Clone the repository.
2. Run `npm install` and wait for all node dependencies to download.
3. Run `bower install` which will download all front-end dependencies
4. Run `grunt compileAssets` which will build the front-end packages
3. Copy the `/config/adapters.example.js` to `/config/adapters.js` and add the
correct credentials to the file.
4. To start the server, type `forever start app.js`, which will spawn a daemon monitor. To launch the server directly, just use `npm start`, but do not use this in production.

##Deployment

1. Stop the server with `forever stop app.js` in the project's root
2. Pull the upstream changes in with `git pull`. The repository can occasionally be plauged with line-ending problems which can be solved by resetting to origin/master with `git reset --hard origin/master`. No config files/re-installation needed.
3. Update node dependencies with `npm update`
4. Update bower dependencies with `bower update`
5. Compile the front end assets with `grunt compileAssets`
6. Relaunch the site first with `npm start` and verify there are no errors, then quit `(Ctrl + C)`, then launch `forever start app.js`. You can ignore testing with `npm start` if you find the log file that Forever automatically creates. Use `forever list` to find the file if need be.
