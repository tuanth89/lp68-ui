module.exports = {
    prod: {
        files: [
            {
                expand: true,
                cwd: '<%= appConfig.dirs.build.dev %>',
                src: [
                    [
                        'index.html',
                        'assets/images/**/*',
                        'assets/font*/**/*',
                        'assets/swf/*',
                        'favicon.ico'
                    ],
                ],
                dest: '<%= appConfig.dirs.build.prod %>'
            }
        ]
    },
    dev: {
        files: [
            {
                expand: true,
                src: [
                    '<%= appConfig.envFiles.js %>',
                    '<%= appConfig.appFiles.js %>',
                    '<%= appConfig.appFiles.coreJs %>',
                    '<%= appConfig.appFiles.css %>',
                    '<%= appConfig.vendorFiles.js %>',
                    '<%= appConfig.vendorFiles.css %>',
                    '<%= appConfig.vendorFiles.font %>'
                ],
                dest: '<%= appConfig.dirs.build.dev %>'
            },
            {
                expand: true,
                cwd: 'src',
                src: [
                    'assets/**/*',
                    'favicon.ico',
                ],
                dest: '<%= appConfig.dirs.build.dev %>'
            },
            {
                expand: true,
                cwd: 'src/styles',
                src: [
                    'img/**/*'
                ],
                dest: '<%= appConfig.dirs.build.dev %>/assets/css'
            },
            {
                expand: true,
                flatten: true,
                src: [
                    '<%= appConfig.appFiles.html %>'
                ],
                dest: '<%= appConfig.dirs.build.dev %>'
            },
            {
                expand: true,
                cwd: '<%= appConfig.dirs.temp %>/templates',
                src: [
                    '*.js'
                ],
                dest: '<%= appConfig.dirs.build.dev %>'
            },

            {
                expand: true,
                flatten: true,
                cwd: '<%= appConfig.dirs.temp %>/generated-css',
                src: [
                    '**/*.css'
                ],
                dest: '<%= appConfig.dirs.build.dev %>/assets/css'
            }
        ]
    }
};