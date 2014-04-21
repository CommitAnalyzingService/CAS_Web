/**
 * Gruntfile
 *
 * If you created your Sails app with `sails new foo --linker`, 
 * the following files will be automatically injected (in order)
 * into the EJS and HTML files in your `views` and `assets` folders.
 *
 * At the top part of this file, you'll find a few of the most commonly
 * configured options, but Sails' integration with Grunt is also fully
 * customizable.  If you'd like to work with your assets differently 
 * you can change this file to do anything you like!
 *
 * More information on using Grunt to work with static assets:
 * http://gruntjs.com/configuring-tasks
 */

module.exports = function (grunt) {





  
  jsModuleNames = ['cg', 'angles', 'socket.io', 'sails', 'minChart'];
  jsModules = {};
  jsModuleNames.forEach(function (path) {
	jsModules[path] =  {
		src: ['assets/js/modules/' + path + '/**/*.js'],
		dest: '.tmp/public/js/modules/' + path + '.js'
		};
  });


  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
  grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-uglify/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-cssmin/tasks');
  grunt.loadTasks('node_modules/grunt-contrib-less/tasks');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      dev: {
        files: [
          {
          expand: true,
          cwd: './assets/public',
          src: ['**/*'],
          dest: '.tmp/public'
        },
        {
            expand: true,
            cwd: './assets/vendor',
            src: ['angular-ui-router/release/*'],
            dest: '.tmp/public/js/vendor'
          },
        ]
      },
      build: {
        files: [
          {
          expand: true,
          cwd: '.tmp/public',
          src: ['**/*'],
          dest: 'www'
        }
        ]
      }
    },

    clean: {
      dev: ['.tmp/public/**'],
      build: ['www']
    },

    less: {
      dev: {
        files: [
          {
          expand: true,
          cwd: 'assets/styles/',
          src: ['*.less'],
          dest: '.tmp/public/styles/',
          ext: '.css'
        }
        ]
      }
    },

    concat: jsModules,

    uglify: {
      dist: {
        src: ['.tmp/public/concat/production.js'],
        dest: '.tmp/public/min/production.js'
      }
    },

    cssmin: {
      dist: {
        src: ['.tmp/public/concat/production.css'],
        dest: '.tmp/public/min/production.css'
      }
    },
    watch: {
      api: {

        // API files to watch:
        files: ['api/**/*']
      },
      js: {

        // Assets to watch:
        files: ['assets/js/**/*'],

        // When assets are changed:
        tasks: ['concat']
      },
      styles: {

          // Assets to watch:
          files: ['assets/styles/**/*'],

          // When assets are changed:
          tasks: ['less:dev']
       }
    }
  });

  // When Sails is lifted:
  grunt.registerTask('default', [
    'compileAssets',
    'watch'
  ]);

  grunt.registerTask('compileAssets', [
    'clean:dev',
    'less:dev',
    'copy:dev',
    'concat'
  ]);



  // Build the assets into a web accessible folder.
  // (handy for phone gap apps, chrome extensions, etc.)
  grunt.registerTask('build', [
    'compileAssets',
    'clean:build',
    'copy:build'
  ]);

  // When sails is lifted in production
  grunt.registerTask('prod', [
    'clean:dev',
    'less:dev',
    'copy:dev',
    'concat',
    'uglify',
    'cssmin',
  ]);

  // When API files are changed:
  // grunt.event.on('watch', function(action, filepath) {
  //   grunt.log.writeln(filepath + ' has ' + action);

  //   // Send a request to a development-only endpoint on the server
  //   // which will reuptake the file that was changed.
  //   var baseurl = grunt.option('baseurl');
  //   var gruntSignalRoute = grunt.option('signalpath');
  //   var url = baseurl + gruntSignalRoute + '?action=' + action + '&filepath=' + filepath;

  //   require('http').get(url)
  //   .on('error', function(e) {
  //     console.error(filepath + ' has ' + action + ', but could not signal the Sails.js server: ' + e.message);
  //   });
  // });
};