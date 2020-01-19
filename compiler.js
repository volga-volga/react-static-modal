"use strict";
console.clear();

const fs = require("fs-extra");
const path = require("path");

const paths = {
  source: path.join(__dirname, "source"),
  dist: path.join(__dirname, "dist"),
  packageJSON: path.join(__dirname, "package.json")
};

const files = {
  js: "*jsx",
  scss: "*scss"
};

fs.emptyDirSync(paths.dist);

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON(paths.packageJSON),

    babel: {
      dist: {
        files: [
          {
            expand: true,
            src: files.js,
            dest: paths.dist,
            cwd: paths.source
          }
        ]
      }
    },

    sass: {
      options: {
        implementation: require("node-sass")
      },
      sass: {
        files: [
          {
            expand: true,
            cwd: paths.source,
            src: files.scss,
            dest: paths.dist,
            ext: ".css"
          }
        ]
      }
    },

    concat: {
      options: {},
      concat: {
        files: paths.dist + "/*.css"
      }
    },

    cssbeautifier: {
      files: paths.dist + "/*.css",
      options: {
        indent: "  ",
        openbrace: "end-of-line",
        autosemicolon: false
      }
    }
  });

  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-sass");

  grunt.loadNpmTasks("grunt-cssbeautifier");
  grunt.loadNpmTasks("grunt-contrib-concat");

  grunt.registerTask("prepublish", [
    "babel",
    "sass",
    "concat",
    "cssbeautifier"
  ]);
};
