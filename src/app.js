'use strict';

import 'material-design-icons/iconfont/material-icons.css';
import 'materialize-css/dist/css/materialize.min.css';

import angular from 'angular';
import ngRoute from 'angular-route';
import ngAnimate from 'angular-animate';
import 'imports?angular=angular!angular-recursion';
import 'imports?angular=angular!angular-treemendous';

import config from './app.config.js';

import HomeController from './components/home/home.controller.js';

import storage from './services/storage.js';
import passwordList from './services/password-list.js';
import pgp from './services/pgp.js';

angular.module('compass', [
    ngRoute,
    ngAnimate,
    'RecursionHelper',
    'treemendous'
])
.config(config)
.service('storage', storage)
.service('passwordList', passwordList)
.service('pgp', pgp)
.controller('HomeController', HomeController);
