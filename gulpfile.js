var gulp = require('gulp');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var htmlmin = require('gulp-htmlmin');
var htmlincluder = require('gulp-htmlincluder');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');

gulp.task('server', function(){
    connect.server({
        root: 'build/',
        livereload: true
    });
});

gulp.task('html', function(){
    gulp.src('dev/**/*.html')
        .pipe(htmlincluder())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: 1
        }))
        .pipe(rename(function(path){
            path.dirname = ''
        }))
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());
});

gulp.task('css', function(){
    gulp.src('dev/assets/less/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css/'))
        .pipe(connect.reload());
});

gulp.task('move', function(){
    gulp.src('dev/assets/img/*.*')
        .pipe(rename(function(path){
            path.dirname = ''
        }))
        .pipe(gulp.dest('build/img/'));
    gulp.src('dev/assets/fonts/*.*')
        .pipe(gulp.dest('build/fonts/'));
});

gulp.task('sprite', function(){
    var sprite = gulp.src('dev/assets/img/sprite/*.*')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprite.less',
            padding: 5,
            algorithm: 'binary-tree'
        }));

        sprite.img.pipe(gulp.dest('build/assets/img'));
        sprite.css.pipe(gulp.dest('dev/assets/less/includes'));
})

gulp.task('default', function(){
    gulp.start(['server', 'move', 'html', 'css']);

    gulp.watch(['dev/**/*.html'], function(){
        gulp.start(['html']);
    });

    gulp.watch(['dev/**/*.less'], function(){
        gulp.start(['css']);
    });
});