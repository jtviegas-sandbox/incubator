'use strict';

module.exports = function(grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        cafemocha: 'grunt-cafe-mocha'
    });

    // Project configuration.
    grunt.initConfig({
        // Configurable paths for the application
        appConfig: {
            dist: 'dist'
        }
        , pkg: grunt.file.readJSON('package.json')
        , cafemocha: {
            unit: {
                src: 'test/*_unit.js',
                options: {
                    ui: 'tdd'
                    , reporter: 'spec'
                    , bail: false
                }
            }
            , integration: {
                src: 'test/*_integration.js',
                options: {
                    ui: 'tdd'
                    , reporter: 'spec'
                    , bail: false
                }
            }
        }
        , clean: {
            js: [ '<%= appConfig.dist %>' ]
        }
        , jshint: {
                // define the files to lint
                files: ['Gruntfile.js', 'src/**/*.js']
                // configure JSHint (documented at http://www.jshint.com/docs/)
                , options: {
                // more options here if you want to override JSHint defaults
                 globals: { jQuery: true, console: true, module: true }
            }
        }
        , copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src/',  src: ['**', '!**/node_modules/**'], dest: '<%= appConfig.dist %>'},
                ]
            }
        }
        , watch: {
                src: {
                    files: ['src/**/*.js'],
                    tasks: ['clean', 'copy'],
                    options: {
                            spawn: false
                    }
                }
        }


    });

    // Default task(s).
    grunt.registerTask('default', [ 'clean', 'jshint', 'copy', 'watch',
          'cafemocha:unit']);

    grunt.registerTask('test', [
        //'env:dev'
        'cafemocha:unit'
        , 'cafemocha:integration'
      ]);

    grunt.registerTask('build', [
        'clean'
        , 'copy'
        , 'cafemocha:unit'
      ]);

};
