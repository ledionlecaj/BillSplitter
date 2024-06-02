module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            js: {
                files: ['src/js/*', 'public/js/*'],
                tasks: ['eslint']
            },
            other: {
                files: ['src/**/*'],
                task: ['nodemon']
            }
        },
        nodemon: {
            dev: {
                script: 'src/js/app.js'
            }
        },
        eslint: {
            target: ['src/js/*', 'public/js/*']
        },
        concurrent: {
            target: [['nodemon', 'watch'], 'eslint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.registerTask('default', ['concurrent']);
};