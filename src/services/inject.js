export function getCode(user, password) {
// Keyboard Event Code from StackOverflow user Orwellophile:
// http://stackoverflow.com/a/10520017
return `
(function() {
    'use strict';

    let form = null;
    let user = null;
    let password = null;

    form = findLoginForm();
    if (!form) {
        form = document;
    }

    password = form.querySelector('input[type="password"]');

    user = findUser(form);

    if (user) {
        user.value = '${user}';
    }
    password.value = '${password}';
    
    const button = findButton(form);
    if (button) {
        button.click();
    } else {
        if (form !== document) {
            form.submit();
        }
    }
    
    function findButton(form) {
        const submit = form.querySelector('input[type="submit"]');
        if (submit) {
            return submit;
        }
        
        const button = form.querySelector('button');
        if (button) {
            return button;
        }
        
        const a = form.querySelector('a');
        return a;
    }

    function findUser(form) {
        let user = form.querySelector('input[type="email"]');
        if (user) {
            return user;
        }

        let inputs = form.querySelectorAll('input');

        if (!inputs.length) {
            return null;
        }

        if (inputs.length === 1) {
            return inputs[0];
        }

        const search = function(term) {
            for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                if (input.type !== 'text') {
                    continue;
                }

                if (input.name.toLowerCase().indexOf(term) > -1) {
                    return input;
                }
            }
            return null;
        }

        user = search('username');
        if (user) {
            return user;
        }

        user = search('email');
        if (user) {
            return user;
        }

        user = search('name');
        if (user) {
            return user;
        }

        return inputs[0];
    }

    function findLoginForm() {
        const passForms = [];
        const forms = document.querySelectorAll('form');
        for (let i = 0; i < forms.length; i++) {
            const tempPass = forms[i].querySelector('input[type="password"]');
            if (tempPass) {
                passForms.push(forms[i]);
            }
        }

        if (passForms.length > 0) {
            if (passForms.length === 1) {
                return passForms[0];
            }

            for (let i = 0; i < passForms.length; i++) {
                if (passForms[i].innerHTML) {}
            }
        }
    }
})();
`;
}
