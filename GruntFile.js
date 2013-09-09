/*globals module */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ''
            },
            hangout: {
                src: [
                    '<%= pkg.src %>/wrappertop.xml',
                    '<%= pkg.src %>/bodytop.html',
                    '<%= pkg.src %>/main.js',
                    '<%= pkg.src %>/bodybottom.html',
                    '<%= pkg.src %>/wrapperbottom.xml'
                ],
                dest: 'hangout.xml'
            },
            dest: {
                src: [
                    '<%= pkg.src %>/bodytop.html',
                    '<%= pkg.src %>/main.js',
                    '<%= pkg.src %>/bodybottom.html'
                ],
                dest: 'test.html'
            }
        },
        watch: {
            scripts: {
                files: [
                    '<%= pkg.src %>/*'
                ],
                tasks: ['concat']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['watch']);

};
