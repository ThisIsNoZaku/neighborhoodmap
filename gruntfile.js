module.exports = function(grunt){
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		uglify: {
			build : {
				files : {
					'static/js/map.min.js' : ['src/map.js'],
					'static/js/knockout.js' : ['node_modules/knockout/build/output/knockout-latest.js']
				}
			}
		},
		zip : {
			'neighborhoodmap.zip' : [
				'static/**', 
				'templates/**', 
				'app.py', 
				'package.json', 
				'google api token.txt',
				'readme.md'
			]
		}
	})
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-install-dependencies');

	grunt.registerTask('default', ['install-dependencies','uglify']);
	grunt.registerTask('zip', ['default']);
};