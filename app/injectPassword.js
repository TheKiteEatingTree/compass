(function() {
    'use strict';

    const password = document.querySelector('input[type="password"]');
    if (password) {
        password.focus();
        document.execCommand('paste');
    }
})();
