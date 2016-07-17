'use strict';

config.$inject = ['$routeProvider', '$mdThemingProvider'];

export default function config($routeProvider, $mdThemingProvider) {
    $routeProvider.when('/home', {
        template: require('./components/home/home.html'),
        controller: 'HomeController',
        controllerAs: 'vm'
    }).when('/unlock', {
        template: require('./components/unlock/unlock.html'),
        controller: 'UnlockController',
        controllerAs: 'vm'
    }).when('/password', {
        template: require('./components/password/password.html'),
        controller: 'PasswordController',
        controllerAs: 'vm'
    }).otherwise({
        redirectTo: '/unlock'
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('cyan', {
            'default': '500'
        });
}
