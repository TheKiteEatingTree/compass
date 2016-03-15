'use strict';

import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import ngRoute from 'angular-route';
import ngAnimate from 'angular-animate';
import 'imports?angular=angular!angular-recursion';
import 'imports?angular=angular!angular-treemendous';

import config from './app.config.js';

import HomeController from './components/home/home.controller.js';
import SettingsController from './components/settings/settings.controller.js';

import fileSystem from './services/file-system.js';
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
.service('fileSystem', fileSystem)
.service('passwordList', passwordList)
.service('pgp', pgp)
.controller('HomeController', HomeController)
.controller('SettingsController', SettingsController);
