module.exports = function ( grunt ) {

  grunt.loadNpmTasks( "grunt-contrib-watch" );
  grunt.loadNpmTasks( "grunt-contrib-jade" );
  grunt.loadNpmTasks( "grunt-contrib-compass" );
  grunt.loadNpmTasks( "grunt-contrib-imagemin" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks( "grunt-browser-sync" );

  var srcCoffee = "src/coffee/"
  ,   srcJade = "src/jade/pages"
  ,   deployJade = "deploy/"

  ,   sassToWatch = null
  ,   jadesToWatch = null;
  

  grunt.event.on( "watch", function( action, filepath ) {
    var fileType = getFileType( filepath );
    if( fileType == "jade" ) {
      getJades();
      initConfig();
    }
  });

  function getFileType( filepath ) {
    return filepath.split( "." ).pop();
  }

  function getJades() {
    jadesToWatch = {};

    var deployPath = ""
    ,   fileNameWithoutType = "";

    grunt.file.recurse( srcJade, function( abspath, rootdir, subdir, filename ) {
      deployPath = deployJade;
      fileNameWithoutType = filename.split( "." ).shift() + ".html"
      if( subdir == undefined ) {
        deployPath += fileNameWithoutType;
      } else {
        deployPath += subdir + "/" + fileNameWithoutType;
      }
      jadesToWatch[ deployPath ] = abspath;
    });
    console.log( jadesToWatch );
  }

  function initConfig() {
    grunt.config.init( {
      pkg: grunt.file.readJSON('package.json'),

      watch: {
        sass: {
          files: [ "src/sass/**/*.scss" ],
          tasks: [ "compass" ]
        },
        jade: {
          files: [ "src/jade/**/*.jade" ],
          tasks: [ "jade:compile" ]
        }
      },

      jade: {
        compile: {
          options: {
            basedir: "src/jade/",
            pretty: true,
            data: {
              debug: true
            }
          },
          files: jadesToWatch
        },
      },

      browser_sync: {
        files: {
          src: [ 
            "deploy/css/**/*.css",
            "deploy/js/**/*.js",
            "deploy/img/**/*.jpg",
            "deploy/img/**/*.png",
            "deploy/**/*.html"
          ]
        },
        options: {
          server: {
            baseDir: "deploy"
          },
          watchTask: true
        }
      },

      compass: {
        dist: {
          options: {
            config: "config.rb"
          }
        }
      },

      imagemin: {
        dynamic: {
          options: {
            optimizationLevel: 7
          },
          files: [ {
            expand: true,
            cwd: "deploy/img/",
            dest: "deploy/img/",
            src: [ "**/*.{png,jpg}"]
          }]
        }
      },

      uglify: {
        compile: {
          files: {
            "deploy/js/main.min.js": "deploy/js/main.js"
          }
        }
      }
    });
  }

  getJades();
  initConfig();

  grunt.registerTask( "imageoptim", [ "imagemin:dynamic" ] );
  grunt.registerTask( "compile", [ "jade:compile", "compass" ] );
  grunt.registerTask( "all", [ "jade:compile", "compass", "uglify" ] );
  grunt.registerTask( "default", [ "compile", "browser_sync", "watch" ] );

  //grunt.task.run( "compile" );
}
