describe('Validator Factory', function() {
    var Validator, validator;

    beforeEach(angular.mock.module('MEAN'));

    beforeEach( angular.mock.inject(function($injector) {
        Validator = $injector.get('ValidatorFactory');
    }));

    describe('email validation', function() {

        beforeEach(function() {
            validator = Validator('email').create();
        })

        it('should pass a valid email string', function() {
            expect( validator.validate( 'test@test.com' )).toBeTruthy();
        });

        it('should fail on a plain string', function() {
            expect( validator.validate( 'test' )).toBeFalsy();
        });

        it('should fail on a string with a short domain', function() {
            expect( validator.validate( 'test@a.com' )).toBeFalsy();
        });

        it('should fail on a string with a short tld', function() {
            expect( validator.validate( 'test@test.c' )).toBeFalsy();
        });

        it('should fail on a string with a no username', function() {
            expect( validator.validate( '@test.com' )).toBeFalsy();
        });
    });

    describe('password validation', function() {

        beforeEach(function() {
            validator = Validator('password').create();
        });

        it('should pass a string of only lowercase letters with 7 characters', function() {
            expect( validator.validate( 'isvalid' ) ).toBeTruthy();
        })

        it('should pass a string of only uppercase letters with 7 characters', function() {
            expect( validator.validate( 'ISVALID' ) ).toBeTruthy();
        })

        it('should pass a string of only numbers with 6 characters', function() {
            expect( validator.validate( '123456' ) ).toBeTruthy();
        })

        it('should pass a string of only numbers with 30 characters', function() {
            expect( validator.validate( '123456789012345678901234567890' ) ).toBeTruthy();
        })

        it('should fail a string of only numbers with 5 characters', function() {
            expect( validator.validate( '12345' ) ).toBeFalsy();
        })

        it('should fail a string of only numbers with 31 characters', function() {
            expect( validator.validate( '1234567890123456789012345678901' ) ).toBeFalsy();
        })
    });

});