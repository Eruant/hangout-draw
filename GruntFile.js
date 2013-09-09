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
                    '<%= pkg.src %>/wrappertop.xml',
                    '<%= pkg.src %>/bodytop.html',
                    '<%= pkg.src %>/main.js',
                    '<%= pkg.src %>/bodybottom.html',
                    '<%= pkg.src %>/wrapperbottom.xml'
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
