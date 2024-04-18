const URLS = 'http://localhost:8000'


/**
  * warningSlides - function that display a notification for 2 seconds
  * @param {dict} text - dict containing text and notification type
  */
function warningSlides (text) {
  const className = Object.keys(text);
  const classValue = Object.values(text);
  if ($.inArray('warning', className) !== -1) {
    $(`.${className}`).html(`<strong style="display: flex; margin-bottom: -10px;">Error</strong><br>${classValue}&nbsp; &nbsp; &nbsp; &nbsp; 
    <strong style="border: 1px solid red; border-radius: 50%; font-size: 10px; padding: 4px 6px;"> X</strong>
    <div style="background: red; width: 100%; position: relative; top: 14px; left: -9px;" class="warning-sliding-stroke"></div>
    `);
  }
  else {
    $(`.${className}`).text(classValue);
  };
  $(`.${className}`).slideDown();
  setNotificationTimeout(className);
  function setNotificationTimeout (className) {
    setTimeout(function () {
      $(`.${className}`).slideUp();
    }, 3000);
    $('.warning-sliding-stroke').animate({ width: 0 }, 3000, 'linear');
  }
}

$(document).ready(function() {
    'use strict';

    // notification body width
    const bodyWidth = $('body').width();
    $('.warning, .warningg, .redirect').css('left', `${bodyWidth / 2.5}px`);


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
            return warningSlides({
              warning: "fullname is too short"
            });
        }
        if (formData.email.length < 5) {
            return warningSlides({
                warning: "Email is too short"
            });
        }
        if (formData.password.length < 8) {
            return warningSlides({
                warning: "Pick a password greater than 8 characters"
            });
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
            return warningSlides({
                warning: "Username is too short"
            });
        }
        if (formData.password.length < 8) {
            return warningSlides({
                warning: "Password is too short"
            });
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
                return window.location.replace(`${URLS}/educator/login/`);
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
