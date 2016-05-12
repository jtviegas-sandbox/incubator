module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
        clean: {  dist: 'dist/**/*' },
        jshint: ['Gruntfile.js'],	
        pkg: grunt.file.readJSON('package.json'),
        copy: { main: { 
                        files: [ {flatten: true, expand: true, src: ['src/**/*.js'], dest: 'dist/'} ] 
                } 
            },
		watch: { jsandcss: {
        			files: [ 'src/**/*.js' ],
        			tasks: ['clean', 'copy'],
        			options: { spawn: false } 
                    }  
                }
	});
    grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
	// Default task(s).
	grunt.registerTask('default', [ 'copy', 'watch', 'jshint', 'clean' ] );
};
