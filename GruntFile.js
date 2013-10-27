module.exports = function ( grunt ) {

    var srcCoffee = "src/coffee/"
    ,   srcJade = "src/jade/pages"
    ,   deployJade = "www/"

    ,   coffeesToWatch = null
    ,   sassToWatch = null
    ,   jadesToWatch = null;

    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-jade" );
    grunt.loadNpmTasks( "grunt-contrib-coffee" );
    grunt.loadNpmTasks( "grunt-contrib-stylus" );
    grunt.loadNpmTasks( "grunt-contrib-imagemin" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );

    grunt.registerTask( "default", "watch" );

    grunt.event.on( "watch", function( action, filepath ) {
        var fileType = getFileType( filepath );
        if( fileType == "coffee" ) {
            getCoffees();
            initConfig();
        } else if ( fileType == "jade" ) {
            getJades();
            initConfig();
        }
    });

    function getFileType( filepath ) {
        return filepath.split( "." ).pop();
    }

    function getCoffees() {
        coffeesToWatch = [ srcCoffee + "*.coffee" ];

        grunt.file.recurse( srcCoffee, function( abspath, rootdir, subdir, filename ) {
            if( subdir == undefined )
                return;
            coffeesToWatch[ coffeesToWatch.length ] = srcCoffee + subdir + "/*.coffee";
        });

        coffeesToWatch.reverse();
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
    }

    function initConfig() {
        grunt.config.init( {
            pkg: grunt.file.readJSON('package.json'),

            watch: {
                coffee: {
                    files: [ "src/coffee/**/*.coffee" ],
                    tasks: [ "coffee:compile" ]
                },
                stylus: {
                    files: [ "src/stylus/**/*.styl" ],
                    tasks: [ "stylus" ]
                },
                jade: {
                    files: [ "src/jade/**/*.jade" ],
                    tasks: [ "jade:compile" ]
                }
            },

            jade: {
                compile: {
                    options: {
                        data: {
                            debug: true
                        },
                        pretty: true
                    },
                    files: jadesToWatch
                }
            },

            coffee: {
                compile: {
                    options: {
                        bare: true
                    },
                    files: {
                        "www/js/main.js": coffeesToWatch
                    }
                }
            },

            stylus: {
                compile: {
                    files: {
                        'www/css/main.css': 'src/stylus/*.styl'
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
                        cwd: "www/img/",
                        dest: "www/img/",
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

    getCoffees();
    getJades();
    initConfig();

    grunt.registerTask( "imageoptim", [ "imagemin:dynamic" ] );
    grunt.registerTask( "compile", [ "jade:compile", "coffee:compile", "stylus" ] )
    grunt.registerTask( "all", [ "jade:compile", "coffee:compile", "stylus", "uglify" ] )

    //grunt.task.run( "compile" );
}
