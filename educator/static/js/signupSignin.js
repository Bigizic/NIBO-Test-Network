const URLS = 'http://localhost:8000'

$(document).ready(function() {
    'use strict';
    // Input Fields span slide
    $('.new_input').val('');

    //form wrapper button
    $('.form_wrapper button').click((e) => {
        if ($(e.target).hasClass('right_')) {
            $('.form_wrapper').css('left', '0');
            $('.form_wrapper').css('right', '');
            $(e.target).removeClass('right_');
            $('header').css('justify-content', 'end');
            $('header h1').css('margin-left', '0');
            $(e.target).text('Educator Sign up');

        } else {
            $('.form_wrapper').css('right', '0');
            $('.form_wrapper').css('left', '');
            $(e.target).addClass('right_');
            $('header').css('justify-content', 'start');
            $('header h1').css('margin-left', '5%')
            $(e.target).text('Educator Sign in');
        };
    });
    // end form wrapper

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
            email: $('input[name=email]').val(),
            password: $('input[name=signupPassword]').val(),
        };
        if (formData.fullname.length < 6) {
            alert("fullname must be greater than 6");
            return;
        }
        if (formData.email.length < 5) {
            alert("Username is too short and must be greater than 3");
            return;
        }
        if (formData.password.length < 8) {
            alert("Password is too short and must be greater than 8");
            return;
        }

        const encodedData = btoa(JSON.stringify(formData));

        $.ajax({
            url: `${URLS}/educator/create_account/`,
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
            email: $('input[name=signinEmail]').val(),
            password: $('input[name=signinPassword]').val(),
        };
        if (formData.email.length < 5) {
            alert("Username is too short");
            return;
        }
        if (formData.password.length < 8) {
            alert("Password is too short");
            return;
        }

        const encodedData = btoa(JSON.stringify(formData));

        $.ajax({
            url: `${URLS}/educator/login/`,
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

    // student signin
    if ($('.second_form_wrapper').hasClass('second_form_wrapper')) {
        $('.body_wrapper').css('justify-content', 'end');
        $('.signin').css('margin-right', '15%');
        $('#news_in').attr('data-placeholder', 'Email or Unique Id');
        $('.welcome').text('Student Sign In');
    }

});
