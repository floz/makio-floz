module.exports = function ( grunt ) {

  grunt.loadNpmTasks( "grunt-contrib-watch" );
  grunt.loadNpmTasks( "grunt-contrib-jade" );
  grunt.loadNpmTasks( "grunt-contrib-imagemin" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks( "grunt-contrib-stylus" );
  grunt.loadNpmTasks( "grunt-browser-sync" );

  var srcCoffee = "src/coffee/"
  ,   srcJade = "src/jade/pages"
  ,   srcStylus = "src/stylus"
  ,   srcJadeData = "src/jade/datas"
  ,   deployJade = "deploy/"
  ,   deployStylus = "deploy/css/"

  ,   stylusToWrite = null
  ,   jadesToWrite = null
  ,   jadesData = null;
  

  grunt.event.on( "watch", function( action, filepath ) {
    var fileType = getFileType( filepath );
    if( fileType == "jade" ) {
      jadesToWrite = getFilesToWrite( jadesToWrite, srcJade, deployJade, ".html" );
      getJadeDatas();
      initConfig();
    }
    if( fileType == "styl" ) {
      stylusToWrite = getFilesToWrite( stylusToWrite, srcStylus, deployStylus, ".css" );
      initConfig();
    }
  });

  function getFileType( filepath ) {
    return filepath.split( "." ).pop();
  }

  function getFilesToWrite( toWrite, src, dest, ext ) {
    toWrite = {};

    var deployPath = ""
    ,   fileNameWithoutType = "";

    grunt.file.recurse( src, function( abspath, rootdir, subdir, filename ) {
      deployPath = dest;
      fileNameWithoutType = filename.split( "." ).shift() + ext
      if( subdir == undefined ) {
        deployPath += fileNameWithoutType;
      } else {
        deployPath += subdir + "/" + fileNameWithoutType;
      }
      toWrite[ deployPath ] = abspath;
    });

    return toWrite;
  }

  function getJadeDatas() {
    jadesData = {};
    jadesData.articles = {};

    grunt.file.recurse( srcJadeData, function( abspath, rootdir, subdir, filename ) {
      var name = filename.split( "." )[ 0 ];
      if( subdir == undefined ) {
        jadesData[ name ] = require( "./" + abspath );
      } else {
        jadesData.articles[ name ] = require( "./" + abspath );
        jadesData.articles[ name ].path = filename.split( "." ).shift();
      }
    });
  }

  function initConfig() {
    grunt.config.init( {
      pkg: grunt.file.readJSON('package.json'),

      watch: {
        // sass: {
        //   files: [ "src/sass/**/*.scss" ],
        //   tasks: [ "compass" ]
        // },
        stylus: {
          files: ["src/stylus/**/*.styl" ],
          tasks: [ "stylus:compile" ]
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
            data: jadesData
          },
          files: jadesToWrite
        }
      },

      browser_sync: {
        files: {
          src: [ 
            "src/jade/datas/**/*.json",
            "src/jade/includes/**/*.jade",
            "src/jade/layouts/*.jade",
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

      stylus: {
        compile: {
          options: {
            paths: [ "deploy/img" ],
            urlfunc: "url"
          },
          files: stylusToWrite
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

  jadesToWrite = getFilesToWrite( jadesToWrite, srcJade, deployJade, ".html" );
  stylusToWrite = getFilesToWrite( stylusToWrite, srcStylus, deployStylus, ".css" );
  getJadeDatas();
  initConfig();

  grunt.registerTask( "toto", [ "stylus:compile" ] );

  grunt.registerTask( "imageoptim", [ "imagemin:dynamic" ] );
  grunt.registerTask( "compile", [ "jade:compile", "stylus:compile" ] );
  grunt.registerTask( "all", [ "jade:compile", "stylus:compile", "uglify" ] );
  grunt.registerTask( "default", [ "compile", "browser_sync", "watch" ] );

  //grunt.task.run( "compile" );
}
