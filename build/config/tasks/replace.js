module.exports = function(grunt, options) {
    var config = {};

    function getPattern(apiEndPoint) {
        if (typeof apiEndPoint !== 'string') {
            grunt.fail.warn('apiEndPoint should be a string');
        }

        return {
            match: /\.constant\(['"]API_END_POINT['"],\s?['"].*?['"]\)/,
            replacement: '.constant("API_END_POINT","' + apiEndPoint + '")' // matching quote style to uglifyjs
        }
    }

    var devApiEndPoint;

    try {
        devApiEndPoint = options.userConfig.apiEndPoint;
    } catch (e) {
        devApiEndPoint = null;
    }

    if (typeof devApiEndPoint !== 'string') {
        devApiEndPoint = '<%= appConfig.deployment.apiEndPoint.dev %>';
    }

    config.dev = {
        options: {
            patterns: [
                getPattern(devApiEndPoint)
            ]
        },
        files: [
            {
                expand: true,
                src: [
                    '<%= appConfig.dirs.build.dev %>/src/app/core/bootstrap/config.js'
                ]
            }
        ]
    };

    config.prod = {
        options: {
            patterns: [
                getPattern('<%= appConfig.deployment.apiEndPoint.prod %>'),
                {
                    match: '<%= appConfig.deployment.origin.dev.match %>',
                    replacement:  '<%= appConfig.deployment.origin.prod.val %>'
                }
            ]
        },
        files: [
            {
                expand: true,
                src: [
                    '<%= appConfig.dirs.build.prod %>/app*.js',
                    '<%= appConfig.dirs.build.prod %>/index.html'
                ]
            }
        ]
    };

    return config;
};