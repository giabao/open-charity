var gulp = require('gulp'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    header = require('gulp-header'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    tslint = require('gulp-tslint'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    merge = require('merge-stream'),
    plumber = require('gulp-plumber'),
    //the default gulp.watch not work with gulp-typescript
    //@see https://github.com/floatdrop/gulp-watch/issues/52
    watch = require('gulp-watch');

var config = {
    src: {
        ts: 'dev/ts/**/*.ts',
        css: 'dev/css/**/*.css'
    },
    dist: {
        js: 'public/javascripts',
        css: 'public/stylesheets'
    },
    vendor: [
        //shims
        'Array.prototype.find/index.js',
        'Array.prototype.findIndex/index.js',
        'e5-shim/e5-shim.js',
        //jquery
        'jquery/dist/jquery.js',
        'jquery-ui/ui/core.js',
        'jquery-ui/ui/datepicker.js',
        'jquery-ui/ui/i18n/datepicker-vi.js',
        //bootstrap
        'bootstrap/dist/js/bootstrap.js',
        //angular
        'angular/angular.js',
        'angular-route/angular-route.js',
        'angular-sanitize/angular-sanitize.js',
        'angular-ui-date/src/date.js',
        'angular-i18n/angular-locale_vi.js',
        //moment
        'moment/moment.js',
        //underscore
        'underscore/underscore.js'
    ],
    uitheme: 'bower_components/jquery-ui/themes/ui-lightness'
};

gulp.task('clean', function(cb) {
    //use a callback to ensure the task finishes before exiting
    del([config.dist.js, config.dist.css], cb);
});

var tsProject = ts.createProject({sortOutput: true});

function tsTask(debug) {
    var tsResult = gulp.src(config.src.ts)
        .pipe(plumber())
        .pipe(tslint())
        .pipe(tslint.report('verbose'))
        .pipe(gulpif(debug, sourcemaps.init())) //generate sourcemaps
        .pipe(ts(tsProject));

    return tsResult.js
        .pipe(concat('main.js'))
        .pipe(gulpif(debug, sourcemaps.write())) //add sourcemaps to the .js file
        .pipe(gulpif(!debug, uglify()))
        .pipe(header('/*<%= time %>*/\n', {time: new Date().toISOString()}))
        .pipe(gulp.dest(config.dist.js));
}

gulp.task('ts-compile', function(){ return tsTask(true); });
gulp.task('ts-release', function(){ return tsTask(false); });

function jsVendor(debug) {
    var vendor = config.vendor.map(function(js) { return 'bower_components/' + js; });
    return gulp.src(vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulpif(!debug, uglify()))
        .pipe(gulp.dest(config.dist.js));
}
gulp.task('vendor-compile', function() { return jsVendor(true); });
gulp.task('vendor-release', function() { return jsVendor(false); });

gulp.task('default', ['compile', 'watch']);

gulp.task('compile', ['clean'], function() {
    gulp.start('ts-compile', 'css-compile', 'vendor-compile', 'assets');
});

gulp.task('release', ['clean'], function() {
    gulp.start('ts-release', 'css-release', 'vendor-release', 'assets');
});

function cssTask(configs, debug) {
    var merged = merge();
    configs.forEach(function(c){
        var i = c.dst.lastIndexOf('/'),
            dst = c.dst.substr(0, i),
            name = c.dst.substr(i + 1),
            stream = gulp.src(c.src)
                .pipe(plumber())
                .pipe(concat(name))
                .pipe(gulpif(!c.vendor, autoprefixer()))
                .pipe(gulpif(!debug, minifycss()))
                .pipe(gulpif(!c.vendor, header('/*<%= time %>*/\n', {time: new Date().toISOString()})))
                .pipe(gulp.dest(dst));
        merged.add(stream);
    });
    return merged;
}

function myCssTask(debug) {
    return cssTask([
        {   dst: config.dist.css + '/main.css',
            src: config.src.css },
        {   dst: config.dist.css + '/jquery-ui/jquery-ui.css',
            src: [config.uitheme + '/jquery-ui.css',
                config.uitheme + '/theme.css'],
            vendor: true },
        {   dst: config.dist.css + '/bootstrap/css/bootstrap.css',
            src: [
                'bower_components/bootstrap/dist/css/bootstrap.css',
                'bower_components/bootstrap/dist/css/bootstrap-theme.css'],
            vendor: true}
    ], debug)
}

gulp.task('css-compile', function(){ return myCssTask(true); });
gulp.task('css-release', function(){ return myCssTask(false); });

gulp.task('watch', function() {
    gulp.watch(config.src.css, ['css-compile']);
    watch(config.src.ts, function () {
        tsTask(true).on('end', function(){
            gutil.log('ts task done!');
            gutil.beep();
        });
    });
});

gulp.task('assets', function() {
    return merge(
        gulp.src('bower_components/bootstrap/dist/fonts/*')
            .pipe(gulp.dest(config.dist.css + '/bootstrap/fonts')),
        gulp.src(config.uitheme + '/images/*')
            .pipe(gulp.dest(config.dist.css + '/jquery-ui/images'))
    );
});
