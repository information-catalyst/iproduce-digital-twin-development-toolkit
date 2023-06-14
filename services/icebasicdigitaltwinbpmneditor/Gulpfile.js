/* jscs: disable */
var gulp = require("gulp"),
  deploy = require("gulp-deploy-git")
  ;

gulp.task("deploy-crema-gitlab", function () {
  return gulp.src([
    "./dist/**/*",
    "./Dockerfile",
    "./changelog.md"
  ], {
      read: false
    })
    .pipe(deploy({
      repository: "git@gitlab.crema-project.eu:antemann/crema-pde-production.git",
      message: "new pde-release by gulp deploy",
      verbose: true,
      debug: true
    }));
});


gulp.task("deploy-ascora-registry", function () {
  return gulp.src([
    "./dist/**/*",
    "./readme.md",
    "./changelog.md",
    "./Dockerfile",
    "./.gitlab-ci.yml"
  ], {
      read: false
    })
    .pipe(deploy({
      repository: "git@registry.ascora.eu:antemann/crema-pde.git",
      message: "new pde-release by gulp deploy",
      verbose: true,
      debug: true
    }));
});
