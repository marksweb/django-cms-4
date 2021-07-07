'use strict';

var autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    del = require('del'),
    glob = require('glob'),
    gulp = require('gulp'),
    merge = require('merge-stream'),
    minify_css = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

var paths = {
    js: {
        src: [
            './project/src/js/*.js'
        ],
        dest: './project/static/project/js/'
    },
    styles: {
        src: [
            './project/src/sass/*.scss'
        ],
        dest: './project/static/project/css/'
    },
};

/***** UTILS *****/

function deterministic_ordering(paths) {
    /*
     * Take a list of paths to be fed into gulp.src which can include
     * wildcard '*' and glob '**' syntax, and, using the glob module, convert
     * this list of paths into an expanded list of individual filenames, sorted
     * alphabetically within each group passed.  This provides deterministic
     * ordering of built files, ensuring you'll get the same file contents and
     * same file hashes when running gulp multiple times on the same src files
     * (something that gulp.src() should offer by default, but doesn't!)
     */
    var result = [], i, j, path, sorted;

    if (!Array.isArray(paths)) {
        paths = [paths];
    }

    for (i = 0; i < paths.length; i++) {
        path = paths[i];
        if (path.indexOf('*') > -1) {
            sorted = glob.sync(path).sort();
            for (j = 0; j < sorted.length; j++) {
                result.push(sorted[j]);
            }
        } else {
            result.push(path);
        }
    }
    return result;
}


function build_sass(src, dest) {
    /**
     * Build SASS as follows:
     *  - compile the SASS (it's assumed SASS will build deterministically)
     *  - auto-prefix to expand browser-specific rules
     *  - write the unminified file to the destination
     *  - minify
     *  - write the minified file to the destination
     */
    return gulp.src(src)
        .pipe(sass().on('error', function(err) {sass.logError(err); throw 'Stop!'}))
        .pipe(autoprefixer('last 2 version', 'ie 9', 'ios 6', 'android 4'))
        .pipe(gulp.dest(dest))
        .pipe(minify_css())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dest));
}


function build_js(name, src, dest) {
    /**
     * Build javascript as follows:
     *  - sort the source files DETERMINISTICALLY
     *  - concat the source files together
     *  - write the unminified file to the destination
     *  - uglify
     *  - write the minified file to the destination
     *  - write the sourcemap file to the destination
     */
    return gulp.src(deterministic_ordering(src))
        .pipe(concat(name))
        .pipe(gulp.dest(dest))
        .pipe(sourcemaps.init())
        // .pipe(uglify({compress: {drop_console: true}}).on('error', function(err) {util.log(err); throw 'Stop!'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest));
}

/***** TASKS *****/

gulp.task('clean_styles', function(cb) {
    del([
        'project/static/project/css/*'
    ], cb);
});


gulp.task('clean_js', function(cb) {
    del([
        'project/static/project/js/*'
    ], cb);
});


gulp.task('clean', ['clean_styles', 'clean_js']);


gulp.task('styles', ['clean_styles'], function() {
    return merge(
        build_sass(paths.styles.src, paths.styles.dest)
    );
});


gulp.task('js', ['clean_js'], function() {
    return merge(
        build_js('base.js', paths.js.src, paths.js.dest)
    );
});


gulp.task('default', ['styles']);


gulp.task('watch', ['default'], function() {
    // gulp.watch(paths.js.src, ['js']);
    gulp.watch(paths.styles.src, ['styles']);
});

