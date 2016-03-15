'use strict';

config.$inject = ['$routeProvider'];

export default function config($routeProvider) {
    $routeProvider.when('/home', {
        template: require('./components/home/home.html'),
        controller: 'HomeController',
        controllerAs: 'vm'
    }).otherwise({
        redirectTo: '/home'
    });
}
