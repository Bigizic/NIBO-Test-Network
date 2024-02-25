$(document).ready(function() {
    'use strict';
    // Input Fields span slide
    $('.new_input').each(function() {
        $(this).on('blur', function() {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            } else {
                $(this).removeClass('has-val');
            }
        })
    });

    $('input[name=two_factor]').click(() => {
        const twoFactorChecked = $('input[name=two_factor]').is(':checked');
        if (twoFactorChecked) {
            $('.authy_form').show();
        }
    });
    $('#authy_cancel').click(() => {
        $('.authy_form').hide();
    })
    // sign up action
    $('.signup_btn').click(function(e) {
        e.preventDefault();
        const newPassword = $('#firstPassword').val();
        const confirmNewPassword = $('#secondPassword').val();
        if (newPassword !== confirmNewPassword) {
            $('#p_status').html('');
            $('#p_status').html('Password must match');
            $('#p_status').show();
            return;
        };

        const formData = {
            fullname: $('input[name=fullname]').val(),
            username: $('input[name=username]').val(),
            password: $('input[name=signupPassword]').val(),
        };
        if (formData.fullname.length < 6) {
            alert("fullname must be greater than 6");
            return;
        }
        if (formData.username.length < 3) {
            alert("Username is too short and must be greater than 3");
            return;
        }
        if (formData.password.length < 8) {
            alert("Password is too short and must be greater than 8");
            return;
        }

        const encodedData = btoa(JSON.stringify(formData));

        $.ajax({
            url: 'http://localhost:8000/admin/create_account/',
            type: 'POST',
            data: { Basic: encodedData },
            headers: {
                'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function(response) {
                window.location.replace(window.location.href);
            },
            error: function(xhr, errmsg, err) {
                console.log(err);
            }
        });
    });

    // sign in action
    $('.login_btn').click(function(e) {
        e.preventDefault();

        const formData = {
            username: $('input[name=signinUsername]').val(),
            password: $('input[name=signinPassword]').val(),
        };
        if (formData.username.length < 3) {
            alert("Username is too short");
            return;
        }
        if (formData.password.length < 8) {
            alert("Password is too short");
            return;
        }
        console.log($('input[name=csrfmiddlewaretoken]').val())
        const encodedData = btoa(JSON.stringify(formData));

        $.ajax({
            url: 'http://localhost:8000/admin/login/',
            type: 'POST',
            data: { Basic: encodedData },
            headers: {
                'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function(response) {
                window.location.replace(window.location.href);
            },
            error: function(xhr, errmsg, err) {
                console.log(err);
            }
        });
    });

    // error message temporary view
    if ($('.notification').length) {
        setTimeout(function () {
          $('.notification').slideUp();
        }, 2000);
    };

});
