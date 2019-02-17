var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


gulp.task('default',['browserSync', 'styles', 'scripts:main', 'scripts:restaurant'], function() {
    gulp.watch('src/css/*.css', ['styles']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/*.js', ['scripts:main', 'scripts:restaurant', 'reload']);
});


gulp.task('browserSync', function() {
    browserSync.init({
        server:{
            baseDir: 'src',
            routes: {
                '/node_modules': './node_modules',
            }
        }
    })

});

gulp.task('reload', function () {
   browserSync.reload();
});


gulp.task('styles', function() {
    gulp.src('src/css/*.css')
        .pipe(browserSync.stream());
});


gulp.task('scripts:main', function() {
    gulp.src(['src/js/idb.js', 'src/js/dbhelper.js', 'src/js/main.js'])
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('main.bundle.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/bundle_js'));
});

gulp.task('scripts:restaurant', function() {
    gulp.src(['src/js/idb.js', 'src/js/dbhelper.js', 'src/js/restaurant_info.js'])
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('restaurant.bundle.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/bundle_js'));
});



gulp.task('copy-html', function() {
    gulp.src('src/*.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
    gulp.src('src/img/*')
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('copy-json', function() {
    gulp.src('src/*.json')
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy-js', function() {
    gulp.src('src/bundle_js/*.js')
        .pipe(gulp.dest('./dist/bundle_js'));
});

gulp.task('copy-sw', function() {
    gulp.src('src/sw.js')
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['copy-html', 'copy-images', 'copy-json', 'copy-js', 'copy-sw']);
