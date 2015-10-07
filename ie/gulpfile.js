// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var install = require("gulp-install");
 
 gulp.task('install', function() {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(install());    
 })

// Default Task
gulp.task('default', ['install']);