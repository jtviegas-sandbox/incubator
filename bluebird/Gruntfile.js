module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
        clean: {  dist: 'dist/**/*' },
        //jshint: ['Gruntfile.js'],
        jshint: ['src/**/*.js'],	
        pkg: grunt.file.readJSON('package.json'),
        copy: { main: { 
                        files: [ {flatten: true, expand: true, src: ['src/**/*.js'], dest: 'dist/'} ] 
                } 
            },
        cafemocha: {
            all: { 
                src: 'qa/*-*Test.js', 
                options: { 
                    ui: 'tdd' , 
                    reporter: 'nyan',
                }, 
            }
        },
		watch: { jsandcss: {
        			files: [ 'src/**/*.js', 'qa/**/*.js' ],
        			tasks: ['clean', 'jshint', 'copy', 'cafemocha' ],
        			options: { spawn: false } 
                    }  
                },
        
	});
    grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-cafe-mocha');
	// Default task(s).
	grunt.registerTask('default', [ 'copy', 'watch', 'jshint', 'clean', 'cafemocha' ] );
};
