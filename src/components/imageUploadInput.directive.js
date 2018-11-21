(function() {
  "use strict";
  angular
    .module("ati.admin")
    .directive("imageUploadInput", function(fileReader, $timeout) {
      return {
        restrict: "EA",
        scope: {
          ngModel: "=",
          invalidExtension: "=",
          invalidDimension: "=",
          messageErrMin: "=",
          messageErrMax: "=",
          minWidth: "@",
          minHeight: "@",
          maxWidth: "@",
          maxHeight: "@",
          fileName: "="
        },
        transclude: true,
        // templateUrl:'/src/components/imageUploadInput.html',
        template: `
            <input type="file" accept=".jpg,.jpeg,.png"
            class="fileInput" />
            <p class="uploadImageBtn btn btn-default" style="margin-left: 30px; margin-top:7px ">
                <i class="fa fa-upload"></i>
                <span class="ng-binding">Tải ảnh</span>
            </p>
            <span class="nameOfFile-295" ng-if="!fileName">Chưa chọn tập tin.</span>
            <span class="nameOfFile-295" ng-bind="fileName"></span>
            `,
        link: function($scope, el) {
          function getFile(file) {
            fileReader.readAsDataUrl(file, $scope).then(function(result) {
              let img = new Image();
              img.onload = function(event) {
                $scope.invalidDimension = !(
                  img.width >= $scope.minWidth &&
                  img.width <= $scope.maxWidth &&
                  img.height >= $scope.minHeight &&
                  img.height <= $scope.maxHeight
                );
                if ($scope.invalidDimension == false) {
                  $scope.fileName = file.name;
                  $scope.uploadImage(file);
                  $scope.messageErrMax = false;
                  $scope.messageErrMin = false;
                } else {
                  //console.log(1);
                  if ($scope.minHeight && $scope.minWidth) {
                    if (
                      img.width < $scope.minWidth ||
                      img.height < $scope.minHeight
                    ) {
                      $scope.messageErrMin = true;
                      $(el).val("");
                      $scope.$apply();
                    } else {
                      $scope.messageErrMin = false;
                      $scope.$apply();
                    }
                  }
                  if ($scope.maxHeight && $scope.maxWidth) {
                    if (
                      img.width > $scope.maxWidth ||
                      img.height > $scope.minHeight
                    ) {
                      $scope.messageErrMax = true;
                      $(el).val("");
                      $scope.$apply();
                    } else {
                      $scope.messageErrMax = false;
                      $scope.$apply();
                    }
                  }
                }
                $scope.$apply();
              };
              img.src = result;
            });
          }

          $(el)
            .find("input")
            .on("change", function(e) {
              var file = (e.srcElement || e.target).files[0];
              $scope.invalidExtension = false;
              if (
                file.type == "image/jpeg" ||
                file.type == "image/png" ||
                file.type == "image/gif" ||
                file.type == "image/jpg"
              ) {
                getFile(file);
              } else {
                // $scope.fileName = null;

                $scope.invalidExtension = true;
                $scope.$apply();
              }
            });
        },
        controller: function(
          $scope,
          FileUploader,
          Auth,
          $http,
          Restangular,
          API_UPDATE_IMAGES,
          fileReader
        ) {
          let user = Auth.getSession();

          $scope.uploadImage = function(file) {
            var fd = new FormData();
            fd.append("image", file,file.name);
            fd.append("type", "avatar_admin");
            $http({
              method: "POST",
              url: API_UPDATE_IMAGES,
              withCredentials: false,
              headers: {
                "Content-Type": undefined,
                Authorization: "Bearer " + user.token
              },
              transformRequest: angular.identity,
              data: fd
            }).then(function(resp) {
              $scope.ngModel = resp.data[0].link;
            });
          };
        }
      };
    });
})();
