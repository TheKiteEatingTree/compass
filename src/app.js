'use strict';

import 'material-design-icons/iconfont/material-icons.css';
import 'angular-material/angular-material.min.css';
import './style.css';

import angular from 'angular';
import ngRoute from 'angular-route';
import ngAnimate from 'angular-animate';
import 'angular-aria';
import ngMessages from 'angular-messages';
import ngMaterial from 'angular-material';


import config from './app.config.js';

import AppController from './app.controller.js';
import HomeController from './components/home/home.controller.js';
import UnlockController from './components/unlock/unlock.controller.js';
import PasswordController from './components/password/password.controller.js';
import NewPasswordController from './components/password/new-password.controller.js';

import style from './services/style.js';
import bg from './services/bg.js';
import north from './services/north.js';
import tabs from './services/tabs.js';

angular.module('compass', [
    ngRoute,
    ngAnimate,
    ngMessages,
    ngMaterial
])
.config(config)
.service('style', style)
.service('bg', bg)
.service('north', north)
.service('tabs', tabs)
.controller('AppController', AppController)
.controller('UnlockController', UnlockController)
.controller('PasswordController', PasswordController)
.controller('NewPasswordController', NewPasswordController)
.controller('HomeController', HomeController);
