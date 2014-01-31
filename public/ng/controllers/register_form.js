app.controller('RegisterForm', function($scope, $http, ValidatorService) {
    // 'Hidden' or 'local' fields (Visible to nothing outside of this function)
    var Validator = ValidatorService;
    var Controller = this;

    // 'Private' fields (Visible to Jasmine)
    this.emailValidator = new Validator('email');
    this.passwordValidator = new Validator('password');

    // 'Public' fields (Visible to the view, and to Jasmine)
    $scope.form = {};

    // Actions
    $scope.submit = function() {
        if( !$scope.isValidEmail() || !$scope.isValidPassword() || !$scope.doPasswordsMatch() ) {
            return false;
        }

        $http({
            method: 'POST',
            url: '/api/users',
            data: $scope.form
        })
            .success(function(body, code, headers) {
                $http({
                    method: 'POST',
                    url: '/login',
                    headers: {
                        password: $scope.form.password
                    },
                    data: {
                        email: $scope.form.email
                    }
                }).success(function(body, code, headers) {
                    window.location = '/';
                });
            });

        return true;
    }

    // Helpers
    $scope.isValidEmail = function() {
        return Controller.emailValidator.validate($scope.form.email);
    }
    $scope.isValidPassword = function() {
        return Controller.passwordValidator.validate($scope.form.password);
    }
    $scope.doPasswordsMatch = function() {
        return $scope.form.passwordConfirm != undefined && $scope.form.password == $scope.form.passwordConfirm;
    }

});