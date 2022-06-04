const gulp = require('gulp');
const fs = require('fs');
const bs = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer')
const mini = require('gulp-minify')
const imagemin = require('gulp-imagemin')
const cleancss = require('gulp-clean-css')
const sass = require('gulp-sass')(require('sass'));
sass.compiler = require('node-sass')

// npm i sass node-sass gulp gulp-sass gulp-clean-css gulp-imagemin@7 gulp-minify gulp-autoprefixer browser-sync --save-dev

/*
*  Create project archiectory
*/

let project = {
    src: {
        src     : "./src",
        sass    : "./src/sass",
        js      : "./src/js",
        img     : "./src/img",
        media   : "./src/media",
        fonts   : "./src/webfonts",
        addons  : "./src/addons",
        entry   : [
            "./src/index.php",
            "./src/sass/main.sass"
        ]
    },
    build: {
        src     : "./build",
        css     : "./build/css",
        js      : "./build/js",
        img     : "./build/img",
        media   : "./build/media",
        fonts   : "./build/fonts",
        addons  : "./build/addons"
    }
};

let createfs = () => {
    return gulp.src('*.*', {read: false})
    .pipe(gulp.dest(project.src.src))
    .pipe(gulp.dest(project.src.sass))
    .pipe(gulp.dest(project.src.js))
    .pipe(gulp.dest(project.src.media))
    .pipe(gulp.dest(project.src.img))
    .pipe(gulp.dest(project.src.fonts))
    .pipe(gulp.dest(project.src.addons))
    .pipe(gulp.dest(project.build.src))
    .pipe(gulp.dest(project.build.css))
    .pipe(gulp.dest(project.build.js))
    .pipe(gulp.dest(project.build.media))
    .pipe(gulp.dest(project.build.img))
    .pipe(gulp.dest(project.build.fonts))
    .pipe(gulp.dest(project.build.addons));
}

let entrypoints = (cb) => {
    project.src.entry.forEach(element => {
        fs.writeFileSync(element,"",cb);
    });
}

gulp.task(createfs);
gulp.task(entrypoints);

exports.create = gulp.series(createfs, entrypoints);

/*
* End
*/

// replace html to build
let copy = () => {
    return gulp.src('./src/**/*.php')
        .pipe(gulp.dest('./app/views'));
}
let addons = () => {
    return gulp.src('./src/addons/*')
        .pipe(gulp.dest('./build/addons'));
}
// replace fonts to build 
let fonts = () => {
    return gulp.src('./src/webfonts/*')
        .pipe(gulp.dest('./build/fonts'));
}
// minify and replace image to build 
let image = () => {
    return gulp.src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'));
}
// compile and replace to build sass 
let css = () => {
    return gulp.src('./src/sass/main.sass')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleancss())
        .pipe( gulp.dest('./build/css/') );
}
let js = () => {
    return gulp.src('./src/js/*.js')
        .pipe(mini({
            compress: true
        }))
        .pipe(gulp.dest('./build/js'));
}

gulp.task(copy);
gulp.task(addons);
gulp.task(fonts);
gulp.task(image);
gulp.task(css);
gulp.task(js);

/*
* Create live server
*/

let sync = () => {
    bs.init({
        server: {
            baseDir: 'build',
            open: 'local'
        }
    });
    gulp.watch('./build/css/*.css').on("change", bs.reload);
    gulp.watch('./build/js/*.js').on("change", bs.reload);
    gulp.watch('./build/*.html').on("change", bs.reload);
}

gulp.task(sync);

/*
* End
*/

let watch = () => {
    gulp.watch('./src/sass/**/*.sass', css);
    gulp.watch('./src/img/*', image);
    gulp.watch('./src/**/*.html', copy);
    gulp.watch('./src/js/**/*.js', js);
    gulp.watch('./src/*.php', copy);
    gulp.watch('./src/addons/*', addons)
}

gulp.task(watch);

exports.default = gulp.series(copy, addons, fonts, image, css, js, watch);
