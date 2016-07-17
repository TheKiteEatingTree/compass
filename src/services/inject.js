export function getCode(user, password) {
    console.log(user);
return `
(function() {
    'use strict';

    let button = null;
    let user = null;
    let password = null;

    password = document.querySelector('input[type="password"]');
    if (password) {
        password.value = '${password}';
    }

    user = findUserLoop(password);
    if (user) {
        user.value = '${user}';
    }

    if (!password && !user) {
        return;
    }

    for (let i = 1; i < 4 && !button; i++) {
        button = findButtonLoop(password, i);
    }

    if (button) {
        button.click();
    }

    return;

    function findButtonLoop(password, level) {
        if (password) {
            let parent = password.parentElement;
            while (parent) {
                const button = findButton(parent, level);
                if (button) {
                    return button;
                }
                parent = parent.parentElement;
            }
        } else {
            const button = findButton(document, level);
            if (button) {
                return button;
            }
        }
        return null;
    }

    function findButton(element, level) {
        if (level === 1) {
            const submit = element.querySelector('input[type="submit"]');
            if (submit) {
                return submit;
            }

            let button = element.querySelector('button[type="submit"]');
            if (button) {
                return button;
            }

            button = element.querySelector('button');
            if (button && button.type === 'submit') {
                return button;
            }
        }

        if (level === 2) {
            const button = element.querySelector('button');
            if (button) {
                return button;
            }
        }


        if (level === 3) {
            const a = element.querySelector('a');
            return a;
        }

        return null;
    }

    function findUserLoop(password) {
        if (password) {
            let parent = password.parentElement;
            while (parent) {
                const user = findUser(parent);
                if (user) {
                    return user;
                }
                parent = parent.parentElement;
            }
        } else {
            const user = findUser(document, true);
            if (user) {
                return user;
            }
        }
        return null;
    }

    function findUser(element, strict) {
        let user = element.querySelector('input[type="email"]');
        if (user) {
            return user;
        }

        let inputs = element.querySelectorAll('input');

        if (!inputs.length) {
            return null;
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

        if (!strict) {
            user = search('name');
            if (user) {
                return user;
            }

            for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                if (input.type === 'text') {
                    return input;
                }
            }
        }

        return null;
    }
})();
`;
}
