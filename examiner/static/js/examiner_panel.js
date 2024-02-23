document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Add event listeners for input fields
    var inputFields = document.querySelectorAll('.new_input');
    inputFields.forEach(function(input) {
        input.addEventListener('blur', function() {
            if (this.value.trim() !== "") {
                this.classList.add('has-val');
            } else {
                this.classList.remove('has-val');
            }
        });
    });

    // Form validation
    var form = document.querySelector('.validate_form');
    form.addEventListener('submit', function(event) {
        var isValid = true;
        var inputs = document.querySelectorAll('.password-validate .new_input');
        inputs.forEach(function(input) {
            if (!validate(input)) {
                showValidate(input);
                isValid = false;
            }
        });
        if (!isValid) {
            event.preventDefault();
        }
    });

    // Focus event to hide validation message
    inputFields.forEach(function(input) {
        input.addEventListener('focus', function() {
            hideValidate(this);
        });
    });

    // Validate input fields
    function validate(input) {
        if (input.getAttribute('type') === 'email' || input.getAttribute('name') === 'email') {
            if (!input.value.trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)) {
                return false;
            }
        } else {
            if (input.value.trim() === '') {
                return false;
            }
        }
        return true;
    }

    // Show validation message
    function showValidate(input) {
        var parent = input.parentElement;
        parent.classList.add('alert-validate');
    }

    // Hide validation message
    function hideValidate(input) {
        var parent = input.parentElement;
        parent.classList.remove('alert-validate');
    }

    // Toggle password visibility
    var showPass = 0;
    var passBtns = document.querySelectorAll('.btn-show-pass');
    passBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var passwordInput = this.nextElementSibling;
            if (showPass === 0) {
                passwordInput.setAttribute('type', 'text');
                this.querySelector('i').classList.remove('zmdi-eye');
                this.querySelector('i').classList.add('zmdi-eye-off');
                showPass = 1;
            } else {
                passwordInput.setAttribute('type', 'password');
                this.querySelector('i').classList.add('zmdi-eye');
                this.querySelector('i').classList.remove('zmdi-eye-off');
                showPass = 0;
            }
        });
    });

});
