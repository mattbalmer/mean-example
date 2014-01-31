describe('Registration Form', function() {
    var controller, $scope;

    beforeEach( angular.mock.module('MEAN'));
    beforeEach( angular.mock.inject(function($rootScope, $controller) {
        $scope = $rootScope.$new();
        controller = $controller('RegisterForm', {
            $scope: $scope
        });
    }));

    describe('fields', function() {
        
        it('should have a forms field', function() {
            expect(typeof $scope.form).toBe('object');
        });
    
        it('should have a submit action', function() {
            expect(typeof $scope.submit).toBe('function');
        });

        it('should have an isValidEmail helper', function() {
            expect(typeof $scope.isValidEmail).toBe('function');
        });

        it('should have an isValidPassword helper', function() {
            expect(typeof $scope.isValidPassword).toBe('function');
        });

        it('should have a doPasswordsMatch helper', function() {
            expect(typeof $scope.doPasswordsMatch).toBe('function');
        });
    });

    describe('helpers', function() {

        it('isValidEmail should call the ValidatorService with $scope.email', function() {
            var spy = spyOn(controller.emailValidator, 'validate');

            $scope.isValidEmail();

            expect(spy).toHaveBeenCalledWith($scope.email);
        });

        it('isValidEmail should call the ValidatorService with $scope.password', function() {
            var spy = spyOn(controller.passwordValidator, 'validate');

            $scope.isValidPassword();

            expect(spy).toHaveBeenCalledWith($scope.password);
        });

        it('doPasswordsMatch should return false if the passwords are not the same', function() {
            $scope.form.password = 'test';
            // purposely leave passwordConfirm undefined

            var match = $scope.doPasswordsMatch();

            expect( match ).toBeFalsy();
        });

        it('doPasswordsMatch should return true if the passwords are the same', function() {
            $scope.form.password = 'test';
            $scope.form.passwordConfirm = 'test';

            var match = $scope.doPasswordsMatch();

            expect( match ).toBeTruthy();
        });
    });

    describe('validation', function() {
        var $httpBackend;

        beforeEach( angular.mock.inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $httpBackend.when('POST', '/login').respond({ fake: true });
        }));

        it('should not make the call if fields are invalid', function() {
            $scope.form.email = 'test';
            $scope.form.password = 'isvalid';
            $scope.form.passwordConfirm = 'isvalid';

            var passed = $scope.submit();

            expect( passed ).toBeFalsy();
        });

        it('should make the call if fields are valid', function() {
            $scope.form.email = 'test@test.com';
            $scope.form.password = 'isvalid';
            $scope.form.passwordConfirm = 'isvalid';

            var passed = $scope.submit();

            expect( passed ).toBeTruthy();
        });
    });

});