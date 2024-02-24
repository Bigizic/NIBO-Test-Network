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

        const encodedData = btoa(JSON.stringify(formData));

        $.ajax({
            url: 'http://localhost:8000/admin/create_account/',
            type: 'POST',
            data: { Basic: encodedData },
            headers: {
                'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
            },
            error: function(xhr, errmsg, err) {
                console.log(errmsg);
            }
        });
    });
});
