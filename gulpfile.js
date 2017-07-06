var gulp = require('gulp');
var less = require('gulp-less');
var spritecreator = require('gulp.spritesmith');
var rename = require('gulp-rename');
var includer = require('gulp-htmlincluder');
var connect = require('gulp-connect');
var liveraload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var lessAutoPrefix = require('less-plugin-autoprefix');
var lessCleanCss = require('less-plugin-clean-css');
var autoprefixPlugin = new lessAutoPrefix({browsers: ["last 2 versions"]});
var cleanCssPlugin = new lessCleanCss({sourceMaps: true});
var gcmq = require('gulp-group-css-media-queries');
// var smartgrid = require('smart-grid');



gulp.task('move', function(){
	gulp.src('dev/fonts/*.*').pipe(gulp.dest('build/fonts/'));
	gulp.src('dev/img/*.*').pipe(gulp.dest('build/img/'));
	gulp.src('dev/js/*.js').pipe(gulp.dest('build/js/'));

});

gulp.task('sprite', function(){
	var spriteData = gulp.src('dev/img/icons/*.png')
		.pipe(spritecreator({
			imgName: '../img/sprite.png',
			cssName: 'sprite.less',
			cssFormat: 'less',
			algorithm: 'binary-tree',
			padding: 10,
			cssOpts: {function: false}
		}));
		spriteData.img.pipe(rename('sprite.png')).pipe(gulp.dest('build/img/'));
		spriteData.css.pipe(gulp.dest('dev/less/import/'));
});

gulp.task('server', function(){
	connect.server({
		root: 'build',
		livereload: true
	});
});
gulp.task('css', function(){
	gulp.src('dev/less/general.less')
		.pipe(sourcemaps.init())
		.pipe(less({
			plugins: [autoprefixPlugin]
		}))
		.pipe(gcmq())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/css/'))
		.pipe(connect.reload());
});

gulp.task('html', function(){
	gulp.src('dev/html/**/*.html')
		.pipe(includer())
		.pipe(gulp.dest('build/'))
		.pipe(connect.reload());
});

gulp.task('js', function(){
	gulp.src('dev/js/**/*.js')
		.pipe(gulp.dest('build/js/'))
		.pipe(connect.reload());
});

gulp.task('default', function(){
	gulp.start('css', 'html', 'server', 'move', 'js');

	gulp.watch(['dev/less/**/*.less'], function(){
		gulp.start('css');
	});	
	gulp.watch(['dev/html/**/*.html'], function(){
		gulp.start('html');
	});
	gulp.watch(['dev/js/**/*.js'], function(){
		gulp.start('js');
	});
});


//start smart-grid
 
/* It's principal settings in smart grid project */
// var settings = {
//     outputStyle: 'less', /* less || scss || sass || styl */
//     columns: 12, /* number of grid columns */
//     offset: "0px", /* gutter width px || % */
//     container: {
//         maxWidth: '1200px', /* max-width оn very large screen */
//         fields: '30px' /* side fields */
//     },
//     breakPoints: {
//         lg: {
//             'width': '1100px', /* -> @media (max-width: 1100px) */
//             'fields': '30px' /* side fields */
//         },
//         md: {
//             'width': '960px',
//             'fields': '15px'
//         },
//         sm: {
//             'width': '780px',
//             'fields': '15px'
//         },
//         xs: {
//             'width': '320px',
//             'fields': '20px'
//         }
//         /* 
//         We can create any quantity of break points.
 
//         some_name: {
//             some_width: 'Npx',
//             some_offset: 'N(px|%)'
//         }
//         */
//     }
// };
 
// smartgrid('./dev/less/import', settings);

//end smart-grid