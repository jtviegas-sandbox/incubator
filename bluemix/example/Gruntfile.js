module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
        
        clean: {  dist:'dist/**/*' },
        jshint: ['Gruntfile.js'],	
        pkg: grunt.file.readJSON('package.json'),
        concat:{
			frontend: { src: [ 'src/frontend/js/*.js' ],
        			dest: 'dist/frontend/js/bluemixexample.js' },
			css: { src: [ 'src/frontend/css/base.css' ],
        			dest: 'dist/frontend/css/bluemixexample.css' } 
                },
		uglify: { build: { src: 'dist/frontend/js/bluemixexample.js',
        			dest: 'dist/frontend/js/bluemixexample.min.js' } },
        copy: { main: { files: [ // includes files within path
                {flatten: true, expand: true, src: ['src/frontend/index.html'], dest: 'dist/frontend/'},
                {flatten: true, expand: true, src: ['src/backend/**/*.js'], dest: 'dist/backend/'},
                {flatten: true, expand: true, src: ['src/frontend/img/*'], dest: 'dist/frontend/img/'}
            ] } },
		watch: { uijsandcss: {
        			files: ['src/frontend/**/*.js', 'src/frontend/**/*.css', 
                        'src/backend/**/*.js', 'src/frontend/*.html', 'src/frontend/img/*' ],
        			tasks: ['clean', 'concat', 'copy'],
        			options: { spawn: false } }  }
	});
	// Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
	// Default task(s).
	grunt.registerTask('default', ['concat', 'copy', 'watch', 'jshint', 'clean']);
};
