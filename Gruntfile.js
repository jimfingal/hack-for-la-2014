module.exports = funciton(grunt) {
  grunt.initConfig({
    clean: ['dist/'],
    browserify: {
      'dist/js/index.js': ['app/js/index.js']
    },
    copy: {
      main: {
        src: 'app/**',
        dest: 'dist/',
        expand: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['clean', 'browserify', 'rework', 'copy']);
};
