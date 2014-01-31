app.controller('Inventory', function($scope, $http, $cookies, $timeout) {
    // Fields
    $scope.inventory = [];

    var timeout;

    // Actions
    $scope.add = function() {
        $http({
            url: '/api/products',
            method: 'POST',
            headers: {
                email: $cookies.email,
                token: $cookies.token
            },
            data: $scope.newProduct
        })
            .success(function(body, code, headers) {
                if(code == 201) {
                    $scope.inventory.push(body);
                    $scope.newProduct = {};
                }
            });
    }

    $scope.remove = function(product) {
        $http({
            url: '/api/products/'+product._id,
            method: 'DELETE',
            headers: {
                email: $cookies.email,
                token: $cookies.token
            }
        })
            .success(function(body, code, headers) {
                $scope.inventory.splice( $scope.inventory.indexOf(product), 1 );
            });
    }
    
    $scope.patch = function(id, product) {
        $http({
            url: '/api/products/'+id,
            method: 'PATCH',
            headers: {
                email: $cookies.email,
                token: $cookies.token
            },
            data: product
        });
    }

    // Listeners
    $scope.$watch('inventory', function(inventory, oldInventory) {
        $timeout.cancel(timeout);

        var diff = function(a, b) {
            var differences = {}, count = 0;
            for(var k in a) {
                if(a.hasOwnProperty(k) && b.hasOwnProperty(k)) {
                    if(a[k] != b[k]) {
                        differences[k] = a[k];
                        count++;
                    }
                }
            }
            return count < 1 ? undefined : differences;
        };

        for(var i = 0; i < inventory.length; i++) {
            if( inventory[i] == undefined || oldInventory[i] == undefined ) continue;
            var differences = diff(inventory[i], oldInventory[i]);
            var id = inventory[i]._id;

            if( differences ) {
                timeout = $timeout(function() {
                    $scope.patch(id, differences);
                }, 250);
            }
        }

    }, true);

    // Init
    $http({
        url: '/api/products',
        method: 'GET'
    })
        .success(function(body) {
            $scope.inventory = body;
        });
});