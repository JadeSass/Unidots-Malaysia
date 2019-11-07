var ignApp = angular.module('igniteApp', ["ngRoute", "datatables", "directive.contextMenu"]);
// Routing starts
/*
 ignApp.config(function($routeProvider, $locationProvider) {
   $routeProvider
     .when('/login', {
       templateUrl: 'login.html',
       controller: 'loginCtrl'
     })
     .when('/admins', {
       templateUrl: 'admin.html',
       controller: 'adminCtrl'
     })
     .when('/audition', {
       templateUrl: 'audition.html',
       controller: 'AuditionCtrl'
     })
     .when('/dashboard', {
       templateUrl: 'dashboard.html',
       controller: 'dashboardCtrl',
       resolve: {
         "check": function($rootScope, $location, storage) {
           if (storage.getUserId() == null) {
             $location.path('login');
           }
         }
       }
       // restricting access to only logged in users
     })
     .when('/users', {
       templateUrl: 'users.html',
       controller: 'usersCtrl',
       resolve: {
         "check": function($rootScope, $location, storage) {
           if (storage.getUserId() == null) {
             $location.path('login');
           }
         }
       }
       // restricting access to only logged in users
     })
     .when('/newusers', {
       templateUrl: 'newusers.html',
       controller: 'usersCtrl',
       resolve: {
         "check": function($rootScope, $location, storage) {
           if (storage.getUserId() == null) {
             $location.path('login');
           }
         }
       }
       // restricting access to only logged in users
     })
     .when('/rejectedusers', {
       templateUrl: 'rejectedusers.html',
       controller: 'usersCtrl',
       resolve: {
         "check": function($rootScope, $location, storage) {
           if (storage.getUserId() == null) {
             $location.path('login');
           }
         }
       }
       // restricting access to only logged in users
     })
     .when('/acceptedusers', {
       templateUrl: 'acceptedusers.html',
       controller: 'usersCtrl',
       resolve: {
         "check": function($rootScope, $location, storage) {
           if (storage.getUserId() == null) {
             $location.path('login');
           }
         }
       }
       // restricting access to only logged in users
     })
     .when('/scoreboard', {
       templateUrl: 'scoreboard.html',
       controller: 'usersCtrl',
       resolve: {
         "check": function($rootScope, $location, storage) {
           if (storage.getUserId() == null) {
             $location.path('login');
           }
         }
       }
       // restricting access to only logged in users
     })
     .when('/register', {
       templateUrl: 'register.html',
       controller: 'registerCtrl',
       resolve: {
         "check": function($rootScope, $location, storage) {
           if (storage.getUserId() == null) {
             $location.path('login');
           }
         }
       }
       // restricting access to only logged in users
     })
     .otherwise({
       redirectTo: '/login'
     })
   // removing the exclamation(!) mark from url
   $locationProvider.hashPrefix('');
   //$locationProvider.html5Mode(true);
   // removing the # from url there is also an htaccess file
 });
*/
// Routing ends
// Rightclick directive
ignApp.directive('ngRightClick', function($parse) {
  return function(scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function(event) {
      scope.$apply(function() {
        event.preventDefault();
        fn(scope, {
          $event: event
        });
      });
    });
  };
});

ignApp.directive('ngFiles', ['$parse', function($parse) {

  function fn_link(scope, element, attrs) {
    var onChange = $parse(attrs.ngFiles);
    element.on('change', function(event) {
      onChange(scope, {
        $files: event.target.files
      });
    });
  };

  return {
    link: fn_link
  }
}]);

ignApp.directive('fileModel', ['$parse', function ($parse) {
//for file upload
  return {
  restrict: 'A',
  link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
          scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
          });
      });
  }
 };

}]);

ignApp.directive('fileModelTwo', ['$parse', function ($parse) {
//for file upload
  return {
  restrict: 'A',
  link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModelTwo);
      var modelSetter = model.assign;

      element.bind('change', function(){
          scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
          });
      });
  }
 };

}]);

// creating storage service for userdata starts
ignApp.service('storage', function($location, $window) {
  var USERID = "userid";
  var USERNAME = "username";
  var USEROBJ = "userobj";


  this.setUserObj = function(obj) {
    $window.localStorage.setItem(USEROBJ, JSON.stringify(obj));
  }
  this.getUserObj = function() {
    return JSON.parse($window.localStorage.getItem(USEROBJ));
  }

  this.setUserId = function(obj) {
    $window.localStorage.setItem(USERID, obj);
  }
  this.getUserId = function() {
    return $window.localStorage.getItem(USERID);
  }
  this.setUsername = function(obj2) {
    $window.localStorage.setItem(USERNAME, obj2);
  }
  this.getUsername = function() {
    return $window.localStorage.getItem(USERNAME);
  }
  this.logout = function() {
    $window.localStorage.clear();
    $window.location.href = "/login.html"
  }
});
// creating storage service for userdata ends
// Controller Starts
ignApp.controller('loginCtrl', function($scope, $timeout, storage, storage, $rootScope, $location, $http, $window) {
  $scope.user = {};
  $scope.loading = false;
  // setting the page title
  $rootScope.pageTitle = "Login";
  // $scope.user.email = "preciousjohnson993@yahoo.com";
  //$scope.user.password = "empty";





  $scope.login = function() {


    var myEl = angular.element(document.querySelector('#form1'));
    myEl.addClass('loading');


    $scope.loginData = {
      "email": $scope.user.email,
      "password": $scope.user.password,
    }
    $scope.loading = true;
    var res = $http({
        url: "http://18.216.101.201:4000/influencer/login",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.loginData,

      })
      .then(function(response) {
          // success
          console.log("Sfsdfsdfsdf");
          console.log(response.data.user);
          console.log("Sfsdfsdfsdf12323");
          myEl.removeClass('loading');
          if (response.data.statuscode == 200) {
            storage.setUserId(true); ///setting userid
            storage.setUserObj(response.data.user);
            $window.location.href = "/myprofile.html"

          } else if (response.data.statuscode == 400) {
            // console.log(response.data);
            angular.element('.alert').show();
            $scope.loading = false;
            // angular.element('.alert').removeClass("alert-success");
            angular.element('.alert').addClass("alert-danger");
            $scope.loginStatus = "Invalid Login Credentials";
            $timeout(function() {
              angular.element('.alert').hide();
            }, 3000);
          } else {
            $scope.loading = false;
            // console.log(response.data);
            angular.element('.alert').show();
            // angular.element('.alert').removeClass("alert-success");
            angular.element('.alert').addClass("alert-danger");
            $scope.loginStatus = "An Error Occurred";
            $timeout(function() {
              angular.element('.alert').hide();
            }, 3000);
          }
        },
        function(error) { // optional
          // failed
          $scope.loading = false;
          console.log(error);
        });
    // creating condition for details match ends

  }
});

ignApp.controller('resetRequestCtrl', function($scope, $timeout, storage, storage, $rootScope, $location, $http, $window) {
  $scope.user = {};
  $scope.loading = false;
  $scope.showForm = true;

  // setting the page title
  $rootScope.pageTitle = "Login";
  // $scope.user.email = "preciousjohnson993@yahoo.com";
  //$scope.user.password = "empty";
  $scope.sendRequest = function() {

    $scope.showForm = true;
    var myEl = angular.element(document.querySelector('#form1'));
    myEl.addClass('loading');


    $scope.loginData = {
      "email": $scope.user.email
    }
    $scope.loading = true;
    var res = $http({
        url: "http://18.216.101.201:4000/influencer/resetrequest",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.loginData,

      })
      .then(function(response) {
          // success
          myEl.removeClass('loading');
          if (response.data.statuscode == 200) {
            $scope.loading = false;
            $scope.showForm = false;
            $scope.formSuccess = true;

          } else if (response.data.statuscode == 400) {
            // console.log(response.data);
            angular.element('.alert').show();
            $scope.loading = false;
            $scope.formFailed = false;
            // angular.element('.alert').removeClass("alert-success");

          } else {
            $scope.loading = false;
            // console.log(response.data);
            angular.element('.alert').show();
            // angular.element('.alert').removeClass("alert-success");
            angular.element('.alert').addClass("alert-danger");
            $scope.loginStatus = "An Error Occurred";
            $timeout(function() {
              angular.element('.alert').hide();
            }, 3000);
          }
        },
        function(error) { // optional
          // failed
          $scope.loading = false;
          console.log(error);
        });
    // creating condition for details match ends

  }
});

ignApp.controller('MyprofileCtrl', function($scope, $timeout, storage, storage, $rootScope, $location, $http, $window) {
  $scope.user = {};
  $scope.queueposition = "Updating";
  $scope.resultsIn = false;



  $scope.getAuditionFlow = function() {

    $scope.location = {
      "location": $scope.user.auditionlocation,
      "status": "Queue"
    }

    $scope.isLoading = true;
    $scope.score = 0;
    var res = $http({
        url: "http://18.216.101.201:4000/admin/getqueue",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.location,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            var influencers = response.data.data;
            console.log(influencers);
            if ($scope.user.status == "Queue") {
              var index = influencers.findIndex(x => x.kolid === $scope.user.kolid);
              $scope.queueposition = index;
            }



            if ($scope.user.adminscore1 == undefined || $scope.user.adminscore2 == undefined || $scope.user.adminscore3 == undefined) {
              $scope.resultsIn = false;
            } else {
              $scope.resultsIn = true;
              var myEl = angular.element(document.querySelector('#resultBox'));
              var totalScore = ($scope.user.adminscore1 + $scope.user.adminscore2 + $scope.user.adminscore3);
              if (totalScore >= 42) {
                myEl.addClass("Green");
              } else {
                myEl.addClass("red");
              }









            }
          } else {
            $scope.queueposition = "Updating";
          }
        },
        function(error) { // optional
          // failed
          console.log(error);
        });
    // creating condition for details match ends

  };


  $scope.check = function() {
    if (storage.getUserObj() == undefined) {
      $window.location.href = "/login.html";
    } else {
      $scope.user = storage.getUserObj();
      console.log($scope.user);
    }
  };

  $scope.check();
  $scope.getAuditionFlow();
  $scope.loading = false;
  // setting the page title
  $rootScope.pageTitle = "Login";

  $scope.logout = function() {
    storage.logout();
  }
  $scope.login = function() {
    var myEl = angular.element(document.querySelector('#form1'));
    myEl.addClass('loading');
    $scope.loginData = {
      "email": $scope.user.email,
      "password": $scope.user.password,
    }
    $scope.loading = true;
    var res = $http({
        url: "http://18.216.101.201:4000/influencer/login",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.loginData,

      })
      .then(function(response) {
          // success
          console.log("Sfsdfsdfsdf");
          console.log(response);
          console.log("Sfsdfsdfsdf12323");
          myEl.removeClass('loading');
          if (response.data.statuscode == 200) {
            storage.setUserId(true); ///setting userid
            storage.setUserObj(response.data.user);
            console.log(storage.getUserObj());
            //$window.location.href = "/myprofile.html"

          } else if (response.data.statuscode == 400) {
            // console.log(response.data);
            angular.element('.alert').show();
            $scope.loading = false;
            // angular.element('.alert').removeClass("alert-success");
            angular.element('.alert').addClass("alert-danger");
            $scope.loginStatus = "Invalid Login Credentials";
            $timeout(function() {
              angular.element('.alert').hide();
            }, 3000);
          } else {
            $scope.loading = false;
            // console.log(response.data);
            angular.element('.alert').show();
            // angular.element('.alert').removeClass("alert-success");
            angular.element('.alert').addClass("alert-danger");
            $scope.loginStatus = "An Error Occurred";
            $timeout(function() {
              angular.element('.alert').hide();
            }, 3000);
          }
        },
        function(error) { // optional
          // failed
          $scope.loading = false;
          console.log(error);
        });
    // creating condition for details match ends

  }
});


ignApp.controller('setNewPasswordCtrl', function($scope, $timeout, storage, $rootScope, $http, $location, $routeParams, $window) {
  var url = window.location.href
  var token = url.split('=').pop();

  $scope.user = {};
  $scope.hasError = false;
  $scope.showForm = true;
  $scope.Error = [];

  $scope.resetPassword = function() {

    $scope.Error = [];
    $scope.hasError = false;
    if ($scope.user.password == undefined) {
      $scope.hasError = true
      $scope.Error.push({
        "reason": "Password is required"
      });
      return;
    }

    if ($scope.user.password.length < 8) {
      $scope.hasError = true
      $scope.Error.push({
        "reason": "Password requires a minimum of 8 characters"
      });
    }

    if ($scope.user.retypepassword == undefined) {
      $scope.hasError = true
      $scope.Error.push({
        "reason": "Please retype password"
      });
    }


    if ($scope.user.password != $scope.user.retypepassword) {
      $scope.hasError = true
      $scope.Error.push({
        "reason": "passwords do not match"
      });
    }


    if ($scope.hasError) {
      return
    }


    $scope.newsetup = {
      "token": token,
      "newpassword": $scope.user.password
    };

    var myEl = angular.element(document.querySelector('#form1'));
    myEl.addClass('loading');
    var res = $http({
        url: "http://18.216.101.201:4000/influencer/setnewpassword",
        method: "POST",
        dataType: "json",
        headers: {
          "Content-Type": 'application/json'
        },
        data: $scope.newsetup,

      })
      .then(function(response) {
          // success
          myEl.removeClass('loading');
          console.log(response.data);
          if (response.data.statuscode == 200) {

            $scope.user = {};
            $scope.registrationSuccess = true;
            $scope.hasError = false;
            $scope.showForm = false;

            $timeout(function() {
              $window.location.href = "/login.html"
              //  $location.path('/');
            }, 3000);

          } else {
            $scope.registrationSuccess = false;
            $scope.hasError = true
            $scope.Error.push({
              "reason": "The token doesn't exist or has expired"
            });
          }
        },
        function(response) { // optional
          // failed
          myEl.removeClass('loading');
          console.log(response);
        });

  }






});
ignApp.controller('adminCtrl', function($scope, $timeout, storage, $rootScope, $http) {
  // setting the page title
  $rootScope.pageTitle = "Admins";
  $scope.loggedInName = storage.getUsername();
  $scope.logOut = function() {
    storage.logout();
  }
  var res = $http({
      url: "http://18.216.101.201/admin/",
      method: "GET",
      dataType: "json",
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(function(response) {
        // displaying admin data
        $scope.displayAdminData = response.data;
      },
      function(error) { // optional
        // failed
        console.log(error);
      });

});

ignApp.controller('dashboardCtrl', function($scope, $timeout, storage, $rootScope, $http) {
  // setting the page title
  $rootScope.pageTitle = "Dashboard";
  $scope.loggedInName = storage.getUsername();
  $scope.logOut = function() {
    storage.logout();
  }
});
ignApp.controller('usersCtrl', function($scope, $timeout, storage, $rootScope, $http) {
  // setting the page title
  $rootScope.pageTitle = "Users";
  $scope.isLoading = false
  $scope.loggedInName = storage.getUsername();
  $scope.logOut = function() {
    storage.logout();
  }
  // getting user id from each table row clicked when tr is clicked it will get the user id and make it global using rootscope

  $scope.getUserId = function(obj) {
    $rootScope.approveUserId = obj;
    console.log(obj);
  }
  $scope.approve = function(obj) {
    $scope.approveUserData = {
      "user_id": $rootScope.approveUserId,
    }
    var res = $http({
        url: "admin/user_id/approve",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.approveUserData,

      })
      .then(function(response) {
          // success
          // console.log(response.data.statuscode);
          if (response.data.statuscode == 200) {
            $scope.approveUserStatus = "User updated successfully";
            $timeout(function() {
              angular.element('.alert').hide();
              $location.path('dashboard');
            }, 3000);
          } else if (response.data.statuscode == 400) {
            // console.log(response.data);
            angular.element('.alert').show();
            // angular.element('.alert').removeClass("alert-success");
            angular.element('.alert').addClass("alert-danger");
            $scope.approveUserStatus = "User ID not found.";
            $timeout(function() {
              angular.element('.alert').hide();
            }, 3000);
          } else {
            // console.log(response.data);
            angular.element('.alert').show();
            // angular.element('.alert').removeClass("alert-success");
            angular.element('.alert').addClass("alert-danger");
            $scope.approveUserStatus = "An Error Occurred";
            $timeout(function() {
              angular.element('.alert').hide();
            }, 3000);
          }
        },
        function(error) { // optional
          // failed
          console.log(error);
        });
    // creating condition for details match ends

  }

  $scope.newinfluencers = [];
  $scope.userstates;

  $scope.getrejectedinfluencers = function() {
    $scope.isLoading = true
    $scope.userstates = {
      "status": "rejected",
    }
    var res = $http({
        url: "http://18.216.101.201:4000/admin/getinfluncers",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.userstates,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.newinfluencers = response.data.data
            $scope.isLoading = false
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });
    // creating condition for details match ends

  }




  $scope.getscoredinfluencer = function() {
    $scope.isLoading = true
    $scope.userstates = {
      "status": "Scored",
    }
    var res = $http({
        url: "http://18.216.101.201:4000/admin/getinfluncers",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.userstates,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.newinfluencers = response.data.data
            $scope.isLoading = false
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });
    // creating condition for details match ends

  }

  $scope.getacceptedinfluencers = function() {
    $scope.isLoading = true
    $scope.userstates = {
      "status": "approved",
    }
    var res = $http({
        url: "http://18.216.101.201:4000/admin/getinfluncers",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.userstates,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.newinfluencers = response.data.data
            $scope.isLoading = false
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });
    // creating condition for details match ends

  }


  $scope.getnewinfluencers = function() {
    $scope.isLoading = true
    $scope.userstates = {
      "status": "unapproved",
    }
    var res = $http({
        url: "http://18.216.101.201:4000/admin/getinfluncers",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.userstates,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.newinfluencers = response.data.data
            $scope.isLoading = false
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });
    // creating condition for details match ends

  }



  $scope.refresh = function() {
    $scope.isLoading = true
    var res = $http({
        url: "http://18.216.101.201:4000/admin/getinfluncers",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.userstates,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.newinfluencers = response.data.data
            $scope.isLoading = false
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });
    // creating condition for details match ends

  }


  $scope.acceptinfluencer = function() {
    $scope.approveUserData = {
      "userid": $rootScope.approveUserId,
      "status": "approved"
    }
    console.log($scope.approveUserData);

    $scope.isLoading = true
    var res = $http({
        url: "http://18.216.101.201:4000/admin/updateinfluencer",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.approveUserData,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.refresh();
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });

  }

  $scope.inviteforaudition = function() {
    $scope.approveUserData = {
      "userid": $rootScope.approveUserId,
      "status": "Queue"
    }
    console.log($scope.approveUserData);

    $scope.isLoading = true
    var res = $http({
        url: "http://18.216.101.201:4000/admin/updateinfluencer",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.approveUserData,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.refresh();
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });

  }



  $scope.rejectinfluencer = function() {
    $scope.approveUserData = {
      "userid": $rootScope.approveUserId,
      "status": "rejected"
    }
    console.log($scope.approveUserData);

    $scope.isLoading = true
    var res = $http({
        url: "http://18.216.101.201:4000/admin/updateinfluencer",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.approveUserData,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.refresh();
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });

  }





});
ignApp.controller('AuditionCtrl', function($scope, $timeout, storage, $rootScope, $http) {
  $scope.score = 0;
  // setting the page title
  $rootScope.pageTitle = "Users";
  $scope.selectedItem = "Kuala lumpur"
  $scope.isLoading = false
  $scope.loggedInName = storage.getUsername();
  $scope.logOut = function() {
    storage.logout();
  }
  // getting user id from each table row clicked when tr is clicked it will get the user id and make it global using rootscope

  $scope.getUserId = function(obj) {
    $rootScope.approveUserId = obj;
    console.log(obj);
  }
  $scope.approve = function(obj) {
    $scope.approveUserData = {
      "user_id": $rootScope.approveUserId,
    }
    var res = $http({
        url: "admin/user_id/approve",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.approveUserData,

      })
      .then(function(response) {
          // success
          // console.log(response.data.statuscode);
          if (response.data.statuscode == 200) {
            $scope.approveUserStatus = "User updated successfully";
            $timeout(function() {
              angular.element('.alert').hide();
              $location.path('dashboard');
            }, 3000);
          } else if (response.data.statuscode == 400) {
            // console.log(response.data);
            angular.element('.alert').show();
            // angular.element('.alert').removeClass("alert-success");
            angular.element('.alert').addClass("alert-danger");
            $scope.approveUserStatus = "User ID not found.";
            $timeout(function() {
              angular.element('.alert').hide();
            }, 3000);
          } else {
            // console.log(response.data);
            angular.element('.alert').show();
            // angular.element('.alert').removeClass("alert-success");
            angular.element('.alert').addClass("alert-danger");
            $scope.approveUserStatus = "An Error Occurred";
            $timeout(function() {
              angular.element('.alert').hide();
            }, 3000);
          }
        },
        function(error) { // optional
          // failed
          console.log(error);
        });
    // creating condition for details match ends

  }

  $scope.newinfluencers = [];

  $scope.current = {};

  $scope.next = {};

  $scope.inqueue = [];

  $scope.location = {
    "location": $scope.selectedItem,
    "status": "Queue"
  }
  $scope.listOfOptions = [ 'Johor bahru','Sunway'];

  $scope.selectedItemChanged = function() {
    $scope.location = {
      "location": $scope.selectedItem,
      "status": "Queue"
    }
    console.log($scope.location);
    $scope.getAuditionFlow();
  }
  $scope.getage = function(obj) {
    return new Date(obj);
    var ageDifMs = Date.now() - new Date(obj);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);



  }

  $scope.nextPersonnel = function() {

    $scope.approveUserData = {
      "userid": $scope.current._id,
      "status": "Scored"
    }
    console.log($scope.approveUserData);

    $scope.isLoading = true
    var res = $http({
        url: "http://18.216.101.201:4000/admin/updateinfluencer",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.approveUserData,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.getAuditionFlow()
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });

  }

  $scope.submitScore = function() {
    $scope.submitdata = {
      "userid": $scope.current._id,
      "score": $scope.score
    }

    $scope.isLoading = true
    var res = $http({
        url: "http://18.216.101.201:4000/admin/submitscore",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.submitdata,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.getAuditionFlow();
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });
    // creating condition for details match ends

  }

  $scope.getAuditionFlow = function() {
    $scope.isLoading = true;
    $scope.score = 0;
    var res = $http({
        url: "http://18.216.101.201:4000/admin/getqueue",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.location,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.newinfluencers = response.data.data

            $scope.current = $scope.newinfluencers.splice(0, 1)[0];
            if ($scope.current != undefined) {
              if ($scope.current.score != undefined) {
                $scope.hasScore = true
              } else {
                $scope.hasScore = false
              }
            }
            $scope.nextIn = $scope.newinfluencers.splice(0, 1)[0];

            $scope.isLoading = false
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });
    // creating condition for details match ends

  }

  $scope.inviteforaudition = function() {
    $scope.approveUserData = {
      "userid": $rootScope.approveUserId,
      "status": "Queue"
    }
    console.log($scope.approveUserData);

    $scope.isLoading = true
    var res = $http({
        url: "http://18.216.101.201:4000/admin/updateinfluencer",
        method: "POST",
        dataType: "json",
        headers: {
          'Content-Type': 'application/json'
        },
        data: $scope.approveUserData,

      })
      .then(function(response) {
          // success
          console.log(response.data);
          if (response.data.statuscode == 200) {
            $scope.refresh();
          } else {}
        },
        function(error) { // optional
          // failed
          console.log(error);
        });

  }




});
ignApp.controller('registerCtrl', function($scope, $timeout, storage, $rootScope, $location, $http, $window) {
  $scope.user = {};
  $scope.hasError = false;
  $scope.showForm = true;
  $scope.Error = [];
  // setting the page title
  $rootScope.pageTitle = "Registration";


  /*
  $scope.getTheFiles = function($files) {
    angular.forEach($files, function(value, key) {
      if(key == "profileimage"){
        delete formdata['profileimage'];
      }
        formdata.append("profileimage", value);
    });
  };


  $scope.getTheFiles2 = function($files) {
    angular.forEach($files, function(value, key) {
      if(key == "icimage"){
        delete formdata['icimage'];
      }
        formdata.append("icimage", value);
    });
  };

  */


  $scope.loggedInName = storage.getUsername();
  $scope.logOut = function() {
    storage.logout();
  }
  $scope.register = function() {

    var formdata = new FormData();
    formdata.append("profileimage", $scope.myFile);
    formdata.append("icimage", $scope.myFileTwo);



    $scope.hasError = false;
    $scope.Error = [];


    //validate the pagelines
    if ($scope.user.fullname == undefined) {
      $scope.hasError = true;
      $scope.Error.push({
        "reason": "Full name is required"
      });
    }

    if ($scope.user.password == undefined) {
      $scope.hasError = true;
      $scope.Error.push({
        "reason": "password is required"
      });
    }


    if ($scope.user.retypepassword == undefined) {
      $scope.hasError = true;
      $scope.Error.push({
        "reason": "please retype password"
      });
    }


    if ($scope.user.artistname == undefined) {
      $scope.hasError = true;
      $scope.Error.push({
        "reason": "artist name is required"
      });
    }

    if ($scope.user.email == undefined) {
      $scope.hasError = true;
      $scope.Error.push({
        "reason": "Email is required"
      });
    }
    
     if ($scope.user.phonenumber == undefined) {
      $scope.hasError = true;
      $scope.Error.push({
        "reason": "Phone number is required"
      });
    }
    
     if ($scope.user.gender == undefined) {
      $scope.hasError = true;
      $scope.Error.push({
        "reason": "Gender is required"
      });
    }

    if ($scope.user.password != $scope.user.retypepassword) {
      $scope.hasError = true;
      $scope.Error.push({
        "reason": "password is do not match"
      });
    }

    if ($scope.hasError) {
      return;
    }

    for ( var key in $scope.user ) {
        formdata.append(key, $scope.user[key]);
    }

    var myEl = angular.element(document.querySelector('#form1'));
    myEl.addClass('loading');
    var res = $http({
        url: "http://18.216.101.201:4000/influencer/register",
        method: "POST",
        dataType: "json",
        headers: {
          "Content-Type": undefined
        },
        data: formdata,

      })
      .then(function(response) {
          // success
          myEl.removeClass('loading');
          console.log(response.data);
          if (response.data.statuscode == 200) {

            $scope.user = {};
            $scope.registrationSuccess = true;
            $scope.hasError = false;
            $scope.showForm = false;

            $timeout(function() {
              $window.location.href = "/login.html"
              //  $location.path('/');
            }, 3000);

          } else {
            $scope.registrationSuccess = false;
            $scope.hasError = true
            $scope.Error.push({
              "reason": "Registration, please try in 5 minutes, and make sure all information are given"
            });
          }
        },
        function(response) { // optional
          // failed
          myEl.removeClass('loading');
          console.log(response);
        });
    // creatign condition for details match

  }
});
