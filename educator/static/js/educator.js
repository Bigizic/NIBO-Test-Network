const URLS = 'http://localhost:8000';

$(document).ready(function() {
    'use strict';

    // warning_ slideUp
    if ($('.warningg, .redirect').length) {
      setTimeout(function() {
        $('.warningg, .redirect').slideUp();
      }, 2000)
    }

    //warning width desktop width
    const bodyWidth = $('body').width();
    $('.warning, .warningg, .redirect').css('left', `${bodyWidth / 2.5}px`);
    // all exams gap
    $('.all_exams').css('gap', `${bodyWidth / 3.5}px`);

    // error message temporary view
    if ($('.success_notification').length) {
        setTimeout(function () {
          $('.success_notification').slideUp();
        }, 2000);
    };
    $('.exam-box .active_exam').css('width', '100%');
    $('.exams_new_input').val('');

    // exam inactive hover details
    $('.toolkit-container').hover(function() {
      $('.toolkit-container h6').css('display', 'block');
    }, function() {
      $('.toolkit-container h6').css('display', 'none');
    })

    // rectangular sliding stroke
    $('.sliding-stroke').animate({ width: 0 }, 30000, 'linear', function() {
      $('.exams_create_an_exam ul').slideUp();
    });

    // exams box toogle
    const examsDetailToogle = [$('.active'), $('.future'), $('.completed'), $('.cancelled')];
    examsDetailToogle.forEach((e) => {
      e.click(() => {
        examsDetailToogle.forEach((element) => {
          element.find('span').removeClass('new_input_span').css('width', '0');
          $(`.exam-box .${element.attr('class')}_exam`).css('width', '0');
          const removeInputTagColor = $(element).find('input');
          removeInputTagColor.css('color', 'black');
        });
        const inputTag = $(e).find('input');
        inputTag.css('color', '#CADA48');
        setTimeout(() => {
          e.find('span').addClass('new_input_span').css('width', '100%');
          $(`.exam-box .${e.attr('class')}_exam`).css('width', '100%');
        }, 0);
        const targetExamBox = $(`.${e.attr('class')}_exam`);
        $('.active_exam').hide();
        $('.future_exam').hide();
        $('.completed_exam').hide();
        $('.cancelled_exam').hide();
        targetExamBox.css('display', 'flex');
      });
    });

    $('.active').each(function() {
      if ($(this).find('.new_input_span').width() === 0) {
        $(this).find('.new_input_span').css('width', '100%');
      }
      const inputTag = $(this).find('input');
      inputTag.css('color', '#CADA48');
    });

  // get width for information box
  const scrollInformationWidth = $('.scroll_information').width();
  const scollInformationWordWidth = $('.scroll_information_words').width();
  const gapWidth = (scrollInformationWidth - scollInformationWordWidth) / 1.5;
  $('.scroll_information').css('gap',  `${gapWidth}px`);

  // left side bar toogle
  $(document).on('click', '.menu-button', function () {
    const closeBUtton = $('<span class="close-button">&times;</span>');
    $('.right, .exams_container').css('margin-left', '14%');
    $('.first_ul a').css('display', 'block');
    $('.second_ul a').css('display', 'block');
    $(this).replaceWith(closeBUtton);
  });

  $(document).on('click', '.close-button', function () {
    const menuBUtton = $('<button class="menu-button">&#9776;</button>');
    $('.right, .exams_container').css('margin-left', '5%');
    $('.first_ul a').css('display', 'none');
    $('.second_ul a').css('display', 'none');
    $(this).replaceWith(menuBUtton);
  });

  // left side icons click ajax requests
  $('.first_ul li, .second_ul li').click(function(e) {
    const aLink = $(this).find('a').attr('href');
    const aLinkURL = `${URLS}${aLink}`;
    $.ajax({
      url: aLinkURL,
      method: 'GET',
      success: function(response) {
        window.location.replace(aLinkURL);
    },
      error: function(xhr, errmsg, err) { 
        throw err; 
      }
    });
  });



  // exams.js
  function warningSlides(text) {
    $('.warning').text(text);
    $('.warning').slideDown();
    setTimeout(function () {
      $('.warning').slideUp();
    }, 2000);
  }
  $('.input_number, .custom_option').bind('input propertychange', function() {
    let inputValue = $(this).val();
    if (/\D/.test(inputValue)) {
      warningSlides('Input must be numbers only');
      inputValue = inputValue.replace(/\D/g, '');  // remove user entered input that doesn't match digits
      $(this).val(inputValue);
    } else { $('.warning').hide(); }
  });

  $('.exams_new_input').each(function() {
    $(this).on('blur', function() {
        if ($(this).val().trim() != "") {
            $(this).addClass('has-val');
        } else {
            $(this).removeClass('has-val');
        }
    })
});

  /* NUMBERS INPUT FIELD */
  $('.authy_f').find('input').each(function() {
    $(this).attr('maxlength', 1);
    $(this).on('keyup', function(e) {
      var parent = $($(this).parent());

      if(e.keyCode === 8 || e.keyCode === 37) {
        var prev = parent.find('input#' + $(this).data('previous'));
      
        if(prev.length) {
          $(prev).select();
        }
        } else if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
          var next = parent.find('input#' + $(this).data('next'));
      
          if(next.length) {
            $(next).select();
          } else {
            if(parent.data('autosubmit')) {
              parent.submit();
            }
          }
        }
    });
  });

  $('.exams_create_an_exam h4').click((e) => {
    if ($('#create_exam_form').css('display') === 'none') {
      $('.exams_container').css('filter', 'blur(2.5px)');
      $('#create_exam_form').slideDown();
      $('#create_exam_form').css('display', 'flex').css('filter', 'blur(0px)');
    }
  })
  $('.cancel_exam_create').click((e) => {
    $('#create_exam_form').slideUp();
    $('.exams_container').css('filter', 'blur(0px)');
  })

  //word counter for description
  $('#description').bind('input propertychange', function() {
    let charCount = $(this).val().length;
    $('.word_counter').text(`${650 - charCount} remaining` );
  })

  // Create exam ajax post

  // fetch form inputs
  function fetchFormInputs() {
    const inputTypeNumbers = [1, 2, 3, 4, 5];
    let allInputsDict = {
      durations: '',
      no_of_students: '',
      no_of_questions: '',
      grade: '',
      time_limit: '',
    };
    for (let c of inputTypeNumbers) {
      const tempDurationC = $(`input[name=duration_digit-${c}]`).val();
      const tempQuestionsC = $(`input[name=question_digit-${c}]`).val();
      const tempStudentsC = $(`input[name=students_no_digit-${c}]`).val();
      const tempGrade = $(`input[name=grade_digit-${c}]`).val();
      allInputsDict.durations += /\d/.test(tempDurationC) ? tempDurationC : '';
      allInputsDict.no_of_questions += /\d/.test(tempQuestionsC) ? tempQuestionsC : '';
      allInputsDict.no_of_students += /\d/.test(tempStudentsC) ? tempStudentsC : '';
      allInputsDict.grade += /\d/.test(tempGrade) ? tempGrade : '';
    }
    const timeLimitSe = $('#time_limit_select').val()
    allInputsDict.time_limit += /\d/.test(timeLimitSe) ? timeLimitSe : $('input[name=time_limit]').val();

    const formData = {
      title: $('input[name=title]').val(),
      description: $('textarea[name=description]').val(),
      start_date: $('input[name=start_date]').val(),
      end_date: $('input[name=end_date]').val(),
      duration: allInputsDict.durations,
      no_of_students: allInputsDict.no_of_students,
      no_of_questions: allInputsDict.no_of_questions,
      grade: allInputsDict.grade,
      time_limit: allInputsDict.time_limit,
    };
    // check inputs
    if (formData.duration.length <= 1 || formData.duration[0] == '0') {
      warningSlides('Duration is too short, lets try a time greater than 9 mins');
      return null;
    }
    const formDataKeys = Object.keys(formData);
    for (let keys of formDataKeys) {
      if (keys !== 'duration') {
        if (formData[keys].length <= 0) {
          warningSlides('You have empty fields');
          return null;
        }
      }
    }
    return formData;
  }

  // create exam
  $('.create_exam_btn').click(function(e) {
    e.preventDefault();
    const formData = fetchFormInputs();
    if (formData === null) { return; }
    const educatorId = $('#a_educator_id').attr('href').split('/')[3];
    const encodedData = btoa(JSON.stringify(formData));
    $.ajax({
        url: `${URLS}/educator/create_exam/${educatorId}/`,
        type: 'POST',
        data: { EX: encodedData },
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
  })

  // add questions
  $('.add_questions').click(function(e) {
    $('#create_exam_form').css('display', 'none');
    $('#create_questions_form').css('display', 'flex');
    $('#create_questions_form').animate({ width: "90%" }, 500, 'linear');
  })

  // Options custom field
  $('#time_limit_select').change(function() {
    const selectedValue = $(this).val();
    if (selectedValue === 'Custom time') {
      $('.custom_option').show();
    } else { $('.custom_option').hide(); };
  })

  $('.custom_option').bind('input propertychange', function(e) {
    if ($(this).val() < 5 && /\d/.test($(this).val())) {
      $('.warning').text('Custom time limit must be greater than 5 mins');
      warningSlides();
    }
  })
})
