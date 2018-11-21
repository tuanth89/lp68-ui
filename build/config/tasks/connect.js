module.exports = {
    server: {
        options: {
            livereload: 12345,
            base: '<%= appConfig.dirs.build.dev %>',
            hostname: '<%= userConfig.hostname %>',
            port: '<%= userConfig.port %>',
            open: {
                target: '<%= userConfig.appUrl %>',
                appName: '<%= userConfig.browser %>'
            }
        }
    }
};