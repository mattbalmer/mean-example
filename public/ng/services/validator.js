app.service('ValidatorService', function() {
    return function(type) {
        this.type = type;

        // Set the type
        if( type == 'email' ) {
            this.regex = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        }
        if( type == 'password' ) {
            this.regex = /^[a-zA-Z0-9]{6,30}$/;
        }

        this.validate = function(subject) {
            return this.regex.test(subject || '');
        }
    }
});