app.factory('ValidatorFactory', function() {
    return function(type) {
        var regex;

        // Validator
        function Validator(regex) {
            this.regex = regex;
        }
        Validator.prototype.validate = function(subject) {
            return this.regex.test(subject || '');
        };

        // Set the type
        if( type == 'email' ) {
            regex = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        }
        if( type == 'password' ) {
            regex = /^[a-zA-Z0-9]{6,30}$/;
        }

        return {
            create: function() {
                return new Validator(regex)
            }
        };
    }
});