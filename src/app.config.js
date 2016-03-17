'use strict';

config.$inject = ['$routeProvider'];

export default function config($routeProvider) {
    $routeProvider.when('/home', {
        template: require('./components/home/home.html'),
        controller: 'HomeController',
        controllerAs: 'vm'
    }).when('/unlock', {
        template: require('./components/unlock/unlock.html'),
        controller: 'UnlockController',
        controllerAs: 'vm'
    }).otherwise({
        redirectTo: '/unlock'
    });
}
