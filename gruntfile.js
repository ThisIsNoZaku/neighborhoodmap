module.exports = function(grunt){
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		uglify: {
			options : {
				beautify : true,
				mangle: false
			},
			build: {
				files : [
				{
					expand : true,
					flatten : false,
					cwd : "src/",
					src : "**/*.js",
					dest : "static/"
				}
				]
			}
		},
		cssmin : {
			build : {
				files :[
				{
					expand : true,
					flatten : false,
					cwd : 'src/',
					src : "**/*.css",
					dest : "static/",
					ext : ".min.css"
				}]
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
		},
		copy : {
			build: {
				files : [
				{
					expand : true,
					flatten : false,
					src : 'data/*',
					dest : 'static/',
					cwd : 'src/'
				},
				{
					"static/js/knockout.js" : "node_modules/knockout/build/output/knockout-latest.debug.js"
				}]
			}
		}
	})
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['uglify', 'cssmin', 'copy']);
	grunt.registerTask('package', ['uglify', 'zip']);
	grunt.registerTask('zip', ['default']);
};