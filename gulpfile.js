const developmentBuild = true;
const bundleCssFileName = "styles.min.css";

const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const fileinclude = require("gulp-file-include");
const replace = require("gulp-replace");
//const webpack        = require('webpack');
const webpackStream = require("webpack-stream");
const TerserPlugin = require("terser-webpack-plugin");
const concat = require("gulp-concat");
const gulpif = require("gulp-if");
const cleanCSS = require("gulp-clean-css");
const formatHtml = require("gulp-format-html");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const webpHtml = require("gulp-webp-html-nosvg");
const webp = require("gulp-webp");
const version = require("gulp-version-number");

//imageMin
function imageMin() {
  return src("src/images/**/*")
    .pipe(newer("./images"))
    .pipe(webp())
    .pipe(
      src("src/images/**/*"),
      imagemin([
        imagemin.mozjpeg({ progressive: true, max: 100, min: 95 }),
        imagemin.optipng({ quality: "90" }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("images"));
}

//Styles
function Sass() {
  return src(["src/scss/**/*.scss", "!src/scss/plugins.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        grid: true,
        overrideBrowserslist: ["last 3 version"],
        cascade: false,
      })
    )
    .pipe(sourcemaps.write("maps"))
    .pipe(dest("src/css"))
    .pipe(browserSync.stream());
}

function SassPlugins() {
  return src("src/scss/plugins.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(sourcemaps.write("maps"))
    .pipe(dest("src/css"))
    .pipe(browserSync.stream());
}

//Styles concat
function ConcatCss() {
  return src("src/css/**/*.css")
    .pipe(replace("../../", "../"))
    .pipe(concat(bundleCssFileName))
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
    .pipe(dest("css"))
    .pipe(browserSync.stream());
}

//Browser-sync
function BrowserSync() {
  browserSync.init({
    server: { baseDir: "./" },
    notify: false,
    // tunnel: //'write-site-name'
  });
}

//Build HTML
function BuildHtml() {
  return src(["src/html/*.html", "!components/**/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(replace("../", ""))
    .pipe(
      gulpif(
        !developmentBuild,
        replace('<link rel="stylesheet" href="src/css/plugins.css">', "")
      )
    )
    .pipe(
      gulpif(
        !developmentBuild,
        replace(
          '<link rel="stylesheet" href="src/css/style.css">',
          `<link rel="stylesheet" href="css/${bundleCssFileName}">`
        )
      )
    )
    .pipe(
      gulpif(
        !developmentBuild,
        version({
          value: "%DT%",
          append: {
            key: "_v",
            cover: 0,
            to: ["css", "js"],
          },
          output: {
            file: "version.json",
          },
        })
      )
    )
    .pipe(webpHtml())
    .pipe(formatHtml({}))
    .pipe(dest("./"))
    .pipe(browserSync.stream());
}

//Scripts
function Scripts() {
  return src("src/js/main.js")
    .pipe(
      webpackStream({
        mode: developmentBuild ? "development" : "production",
        output: {
          filename: "[name].min.js",
        },
        module: {
          rules: [
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: "babel-loader",
              options: {
                presets: ["@babel/env"],
              },
            },
          ],
        },
        optimization: {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                output: {
                  comments: false,
                },
              },
              extractComments: false,
            }),
          ],
        },
      })
    )
    .pipe(dest("js"))
    .pipe(browserSync.stream());
}

//Watch
function Watch() {
  watch("src/js/*.js", Scripts);
  watch("src/html/**/*.html", BuildHtml);

  watch("src/images/**/*", imageMin);
  watch(
    ["src/scss/*.scss", "!src/scss/plugins.scss", "!src/scss/_fonts.scss"],
    developmentBuild ? Sass : series(Sass, ConcatCss)
  );
  watch(
    ["src/scss/plugins.scss", "src/scss/_fonts.scss"],
    developmentBuild ? SassPlugins : series(SassPlugins, ConcatCss)
  );
}

//Exports
exports.Sass = Sass;
exports.SassPlugins = SassPlugins;
exports.ConcatCss = ConcatCss;
exports.BrowserSync = BrowserSync;
exports.BuildHtml = BuildHtml;
exports.Scripts = Scripts;

exports.default = developmentBuild
  ? series(
      Sass,
      SassPlugins,
      Scripts,
      BuildHtml,
      imageMin,
      parallel(BrowserSync, Watch)
    )
  : series(
      Sass,
      SassPlugins,
      ConcatCss,
      Scripts,
      BuildHtml,
      imageMin,
      parallel(BrowserSync, Watch)
    );
