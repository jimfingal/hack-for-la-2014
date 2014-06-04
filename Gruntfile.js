module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['dist/'],
    browserify: {
      'dist/js/index.js': ['app/js/index.js']
    },
    copyto: {
      stuff: {
        files: [
          {
            cwd: 'app/', 
            src: ['**/*'], 
            dest: 'dist/'
          }
        ],
        options: {
          ignore: [
            'app/js/**'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-copy-to');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['clean', 'copyto', 'browserify']);
};
