module.exports = function(grunt){

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
            development: {
                options: {
                    paths: ["./style/less"],
                    yuicompress: true
                },
                files: {
                    "./style/css/custom.css": "./style/less/custom.less"
                }
            }
    },
    uglify: {
      dev: {
        options: {
          beautify: true
        },
        files: {
          // Where to combine and minify JS files, followed by list of which files to include and exclude
          'js/script.min.js' : ['js/*.js', '!js/3rdparty/*']
        }
      },
      prod: {
        files: {
          // Where to combine and minify JS files, followed by list of which files to include and exclude
          'js/script.min.js' : ['js/*.js', '!js/3rdparty/*', '!js/3rdparty/livereload.js']
        }
      }
    },

    // Watch options: what tasks to run when changes to files are saved
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: ['style/less/*.less'],
        tasks: ['less']
      },
      js: {
        files: ['js/*.js', '!js/3rdparty/*'], // Watch for changes in JS files except for script.min.js to avoid reload loops
        tasks: ['uglify:dev']
      }
		}
	});
  grunt.registerTask('default', ['less','uglify:dev','watch']);
  grunt.registerTask('production', ['less','uglify:prod']);
};