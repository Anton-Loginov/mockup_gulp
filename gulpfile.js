const gulp = require('gulp'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    connect = require('gulp-connect'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    minifyCss = require('gulp-minify-css');


gulp.task("default", ['copyStaticFiles', 'script', 'style', 'image', 'startServer', 'watch']);


//Static_task

gulp.task("copyStaticFiles", function () {
    return gulp.src("./app/index.html")
        .pipe(gulp.dest("./dist"))
});


//Styles_task

gulp.task("style", function () {
    gulp.src('app/styles/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'))
});


//Image_compress_task

gulp.task("image", function () {
    gulp.src('./app/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
});


//Compiling_JS_task

gulp.task("script", function () {
    return browserify({
        entries: ["./app/js/index.js"]
    })
        .transform(babelify.configure({
            presets: ["es2015"]
        }))
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("./dist/js"));
});


//Server_start_task

gulp.task("startServer", function () {
    connect.server({
        root: "./dist",
        livereload: true,
        port: 9001
    });
});


//Watch_task

gulp.task('watch', function () {
    gulp.watch(['app/js/*.js'], ['script']);
    gulp.watch('app/index.html', ['copyStaticFiles']);
    gulp.watch(['app/styles/*.less'], ['style']);
});
