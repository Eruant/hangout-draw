/*globals module */

module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ''
            },
            dist: {
                src: [
                    'parts/wrappertop.xml',
                    'parts/bodytop.html',
                    'js/main.js',
                    'parts/bodybottom.html',
                    'parts/wrapperbottom.xml'
                ],
                dest: 'hangout.xml'
			}
        },
		watch: {
			scripts: {
				files: [
					'parts/*',
                    'js/*'
				],
				tasks: ['concat']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['watch']);

};
