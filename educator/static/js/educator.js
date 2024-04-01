const URLS = 'http://localhost:8000';


/**
  * warningSlides - function that display a notification for 2 seconds
  * @param {dict} text - dict containing text and notification type 
  */
function warningSlides(text) {
  const className = Object.keys(text);
  const classValue = Object.values(text);
  $(`.${className}`).text(classValue);
  $(`.${className}`).slideDown();
  setNotificationTimeout(className);
  function setNotificationTimeout(className) {
    setTimeout(function () {
      $(`.${className}`).slideUp();
    }, 2000);
  }
}


/**
 * getFileExtensionType - checks if a url has a valid file extension and if it's a valid url 
 * @param {str} url - url to check
 */
function getFileExtensionType(url) {
  let filenameMatch = url.match(/\/([^\/?#]+)[^\/]*$/);
  let filename = filenameMatch ? filenameMatch[1] : '';

  // check if url starts with 'https://' or 'www.'
  let startsWithHttpOrWww = /^https?:\/\/|^www\./i.test(url);

  // check if the filename has a supported image or video file extension
  // also test for youtube videos
  let isImage = /\.(jpg|jpeg|png|gif)$/i.test(filename);
  let isVideo = /\.(mp4)$/i.test(filename);
  let isYouTubeVideo = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm.test(url);

  if (startsWithHttpOrWww && isYouTubeVideo) {
    return 'youtube';
  }
  if (startsWithHttpOrWww && isImage) {
    return 'image'
  }
  if (startsWithHttpOrWww && isVideo) {
    return 'video'
  }
  if (!isImage && !isVideo) {
  return false
  }
}


/**
 * checkLInk - checks if a url contains valid image or video or gif data
 * @param {str} link url to check if the file is an image or video or gif and if it contains valid image data
 * @returns the data for image
 */
function checkLink(link) {
  return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() {
          resolve('image');
      };
      img.onerror = function() {
          var video = document.createElement('video');
          video.onloadedmetadata = function() {
              resolve('video');
          };
          video.onerror = function() {
              reject('Invalid link');
          };
          video.src = link;
      };
      img.src = link;
  });
}


/**
 * isValidUrl - function that checks if a url is valid
 * @param {url} url to check if it's valid 
 * @returns true if valid else false
 */
function isValidUrl(url) {
  const urlPattern = /^(?:(?:ftp|http|https):\/\/)?(?:www\.)?[^ "]+$/;
  return urlPattern.test(url);
}


/**
 * fetchFormInputs - fetch values from inputs in the exam form
 * @returns fetched form if all fields contain values else NULL
 */
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
  const formDataKeys = Object.keys(formData);
  for (let keys of formDataKeys) {
    if (keys !== 'duration') {
      if (formData[keys].length <= 0) {
        warningSlides({
          warning: 'You have empty fields',
        });
        return null;
      }
    }
  }

  if (formData.duration.length <= 1 || formData.duration[0] == '0') {
    warningSlides({
      warning: 'Duration is too short, lets try a time greater than 9 mins',
    });
    return null;
  }
  return formData;
}


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
    $('.all_exams').css('gap', `${bodyWidth / 6}px`);

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
    const examsDetailToogle = [$('.active'), $('.future'), $('.completed')];
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
  const gapWidth = (scrollInformationWidth - scollInformationWordWidth) / 2;
  $('.scroll_information').css('gap',  `${gapWidth}px`);

  // left side bar toogle
  $(document).on('click', '.menu-button', function () {
    const closeBUtton = $('<span class="close-button">&times;</span>');
    $('.right, .exams_container').css('margin-left', '12%');
    $(this).animate({ width: "100%"}, 500, 'linear');
    $(this).css('text-align', 'end');
    $('.first_ul a').css('display', 'block');
    $(this).replaceWith(closeBUtton);
  });


  $(document).on('click', '.close-button', function () {
    const menuBUtton = $('<button class="menu-button">&#9776;</button>');
    $('.right, .exams_container').css('margin-left', '5%');
    $(this).animate({ width: "100%"}, 500, 'linear');
    $(this).css('text-align', 'start');
    $('.first_ul a').css('display', 'none');
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
  $('.input_number, .custom_option').bind('input propertychange', function() {
    let inputValue = $(this).val();
    if (/\D/.test(inputValue)) {
      warningSlides({
        warning: 'Input must be numbers only',
      });
      inputValue = inputValue.replace(/\D/g, '');  // remove user entered input that doesn't match digits
      $(this).val(inputValue);
    } else { $('.warning').hide(); }
  });

  $('.exams_new_input, .question_new_input').each(function() {
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
    $('#create_questions_form').slideUp();
    $('.exams_container').css('filter', 'blur(0px)');
  })

  //word counter for description and for question text area
  $('#description, .question_text_box').bind('input propertychange', function() {
    let charCount = $(this).val().length;
    if (charCount <= 650) {
      $('.word_counter').text(`${650 - charCount} remaining` );
    }
    if (charCount > 650) {
      $(this).val($(this).val().substring(0, 650));
      warningSlides({
        'warning': "oops you've exhausted your words",
      })
    }
  })


  // Create exam ajax post
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

  // add questions and questions rendering
  $('.add_questions').click(function(e) {
    const formData = fetchFormInputs();

    if (formData) {
      $('#create_exam_form').css('display', 'none');
      $('#create_questions_form').css('display', 'flex');
      $('#create_questions_form').animate({ width: "90%" }, 500, 'linear');
    } else {
      warningSlides({
        warning: 'you have incomplete fields',
      });
    }
  })

  // add more links for questions
  $('.add_more_links').click(function(e) {
    if ($('.question_links_ul').children('li').length === 5) {
      warningSlides({
        'warning': 'Only 5 links are allowed',
      })
    }
    if ($('.question_links_ul').children('li').length < 5) {
      $('.question_links_ul').append(`
        <li>
        <div class="question_wrap_input" style="position: relative;">
        <input class="question_new_input" type="url" name="link">
        <span class="question_new_input_span" data-placeholder=".png, .jpeg, .jpg, .gifs, .mp4 files are allowed"></span>
        <input class="question_new_input_check_mark" type="button" value="&#x2713" style="color: green; position: absolute; right: -20px; top: 35px;">
        <img style="height: 160px; position: absolute; right: -250px; top: -10px;" class="question_image_viewport"/>
        </div>
        </li><br>`);
    }
  })

  // check mark to lock link input
  $(document).on('click', '.question_new_input_check_mark', function(e) {
    let input = $(this).closest('.question_wrap_input').find('.question_new_input');
    let imgTag = $(this).closest('.question_wrap_input').find('.question_image_viewport');
    let appendVideoTag = $(this).closest('.question_wrap_input');
    let inputValue = input.val().trim();
    let embededYoutubeLink = null;

    if (!isValidUrl(inputValue)) {
      embededYoutubeLink = input.val().trim().split('src="')[1].split(' ')[0].replace('"', '');
    }

    if (inputValue === '') {
        warningSlides({
            'warning': 'link is empty',
        });
    } else if (!isValidUrl(inputValue) && !isValidUrl(embededYoutubeLink)) {
        warningSlides({
            'warning': 'not a valid link',
        });
    }
    if ((inputValue !== '' && isValidUrl(inputValue)) || isValidUrl(embededYoutubeLink)) {
        input.addClass('has-val')
        input.prop('readonly', true);
        $(this).replaceWith('<input class="question_new_input_clear" type="button" value="&#x2715" style="color: red; position: absolute; right: -20px; top: 35px;">');
    }

    // images
    if (getFileExtensionType(inputValue) === 'image') {
      imgTag.attr('src', inputValue);
      imgTag.css('width', '200px');
      imgTag.css('border', '2px solid black');
    }

    // mp4 video
    if (getFileExtensionType(inputValue) === 'video') {
      appendVideoTag.append(`<video controls style="width: 200px; height: 160px; position: absolute; right: -250px; top: -10px;" class="question_video_viewport">
      <source src="${inputValue}" type="video/mp4">
      Your browser does not support the video tag.
      </video>`);
    }

    // youtube video
    if (getFileExtensionType(embededYoutubeLink) === 'youtube') {
      appendVideoTag.append(`<iframe style="width: 200px; height: 160px; position: absolute; right: -250px; top: -10px;" src="${embededYoutubeLink}"
      title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`);
    }
  });

  // question new input clear
  $(document).on('click', '.question_new_input_clear', function(e) {
    const input = $(this).closest('.question_wrap_input').find('.question_new_input');
    input.prop('readonly', false);
    $(this).replaceWith('<input class="question_new_input_check_mark" type="button" value="&#x2713" style="color: green; position: absolute; right: -20px; top: 35px;">');
    input.bind('input propertychange', function(e) {
      if ($(this).val() === '') {
        input.removeClass('has-val');
      }
    });
  });

  // Options custom field
  $('#time_limit_select').change(function() {
    const selectedValue = $(this).val();
    if (selectedValue === 'Custom time') {
      $('.custom_option').show();
    } else { $('.custom_option').hide(); };
  })

  $('.custom_option').bind('input propertychange', function(e) {
    if ($(this).val() < 5 && /\d/.test($(this).val())) {
      warningSlides({
        warning: 'Custom time limit must be greater than 5 mins',
      });
    }
  })
})


/**
 * This section is meant to handle dynamic questions rendering in client side plus
 * other dynamic exams rendering like when a user clicks on more details for an exam
 * also the dashboard calender rendering
 */

$(document).ready(function() {
  'use strict';

  // dashboard calendar rendering
  function dashboardCalendar() {
    const currentDate = new Date();
    const dateString = currentDate.toDateString().split(' ');
    const month = dateString[1];
    const alphaDay = dateString[0];
    $('.year').text(currentDate.getFullYear());
    const daysOfTheWeek = {
      MON: 'MONDAY',
      TUE: 'TUESDAY',
      WED: 'WEDNESDAY',
      THU: 'THURSDAY',
      FRI: 'FRIDAY',
      SAT: 'SATURDAY',
      SUN: 'SUNDAY',
    };
    if (daysOfTheWeek.hasOwnProperty(alphaDay.toUpperCase())) {
      $('.day').text(daysOfTheWeek[alphaDay.toUpperCase()]).css('font-weight', '600');
    };

    if (currentDate.getDay() < 10) {
      $('.num-date').text(currentDate.getDate());
    }

    $('.days div').each(function() {
      let thisClsName = $(this)['0'].className;
      if ($(`.${thisClsName} p`).text().trim() === alphaDay.toUpperCase()) {
        $(this).css('color', 'black').css('font-weight', '600');
      }
    })

    $('.month-hover').each(function() {
      if ($(this).text().trim() === month) {
        $(this).css('color', 'black').css('font-weight', '600');
      }
    })

    // creating dates and days of the week for current month
    const newYear = currentDate.getFullYear();
    const newMonth = currentDate.getMonth();
    const currentNewDate = new Date(newYear, newMonth, 1)
    const newAlphaDate = currentNewDate.toDateString().split(' ')[0].toUpperCase();
    const numberOfDaysInCurrentMonth = new Date(newYear, newMonth + 1, 0).getDate();

    let dates = [];

    const daysOfTheWeekList = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    let currentDay = $.inArray(newAlphaDate, daysOfTheWeekList);

    for (let i = 1; i <= numberOfDaysInCurrentMonth; i++) {
      dates.push({ [daysOfTheWeekList[currentDay]]: i });
      currentDay = (currentDay + 1) % 7;
    }

    $.each(dates, function(index, dict) {
      $.each(dict, function(key, value) {
        $('.days div').each(function(e) {
          let thisClsName = $(this)['0'].className;
          if ($(`.${thisClsName} p`).text().trim() === key) {
            if (value == currentDate.getDate()) {  // old current date from line 320
              $($(`.${thisClsName} ul`)).append(`<li style="padding: 16.5px 8px;" class="current_calender_date"> ${value} </li>`);
            } else {
              $($(`.${thisClsName} ul`)).append(`<li style="padding: 16.5px 8px;"> ${value} </li>`);
            }
          }
        })
      })
    })
  }
  dashboardCalendar();

  // more details on exam in exam section
  $('.more_details').click(function() {
    let cont = $(this).siblings('.more_details_container');
    if (cont.css('display') === 'none') {
      $(this).siblings('.more_details_container').slideDown();
    } else {
      $(this).siblings('.more_details_container').slideUp();
    }
  })

  // delete exams
  $('.more_details_delete').click(function(e) {
    e.preventDefault();
    const examId = $(this).data('exam-id');
    const myExamList = $(this).closest('li');
    const numLiElements = myExamList.parent().find('li').length;

    if (confirm('Are you sure you want to delete this exam?')) {
      $.ajax({
        url: `${URLS}/educator/delete_exam/${examId}/`,
        type: 'PUT',
        headers: {
          'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
      },
        success: function(response, textStatus, xhr) {
          if (xhr.status === 204) {
            const numberOfExams = $('.number_of_exams').text().split(' ')[0];
            $('.number_of_exams').text(numberOfExams - 1);
            if (numLiElements < 2) {
              myExamList.parent().find('#start_date_').remove();
              myExamList.remove();
            } else {
              myExamList.remove();
            }
          } else if (xhr.status === 404) {
            warningSlides({
              warning: 'Exam does not exist',
            })
          }
        },
        error: function(xhr, status, error) {
          console.error(error);
        }
      });
    }
  })


  // edit exams and send ajax post request with edited values
  $('.more_details_edit').click(function() {
    const listItem = $(this).closest('li');
    
    const title = listItem.find('[data-exam-title]').data('exam-title');
    const description = listItem.find('[data-exam-description]').data('exam-description');
    const startDate = listItem.find('[data-exam-start-date]').data('exam-start-date');
    const endDate = listItem.find('[data-exam-end-date]').data('exam-end-date');
    const duration = listItem.find('[data-exam-duration]').data('exam-duration');
    const students = listItem.find('[data-exam-no-of-students]').data('exam-no-of-students');
    const questions = listItem.find('[data-exam-no-of-questions]').data('exam-no-of-questions');
    const grade = listItem.find('[data-exam-grade]').data('exam-grade');
    const timeLimit = listItem.find('[data-exam-time-limit]').data('exam-time-limit');
    var editExamId = listItem.find('[data-exam-id]').data('exam-id');

    
    const retrieveExamDetails = {
        title: title,
        description: description,
        start_date: startDate,
        end_date: endDate,
        duration: duration.toString().split('').map(Number),
        no_of_students: students.toString().split('').map(Number),
        no_of_questions: questions.toString().split('').map(Number),
        grade: grade.toString().split('').map(Number),
        time_limit: timeLimit,
    };

    $('.exams_new_input').val(retrieveExamDetails.title);
    $('.textarea').val(retrieveExamDetails.description);
    $('.sstart_datee').val(retrieveExamDetails.start_date);
    $('.eend_datee').val(retrieveExamDetails.end_date);
    $('#time_limit_select').val(retrieveExamDetails.time_limit);

    $('.duration_1').val(retrieveExamDetails.duration[0]);
    $('.duration_2').val(retrieveExamDetails.duration[1]);
    $('.duration_3').val(retrieveExamDetails.duration[2]);
    $('.duration_4').val(retrieveExamDetails.duration[3]);
    $('.duration_5').val(retrieveExamDetails.duration[4]);

    $('.student_1').val(retrieveExamDetails.no_of_students[0]);
    $('.student_2').val(retrieveExamDetails.no_of_students[1]);
    $('.student_3').val(retrieveExamDetails.no_of_students[2]);
    $('.student_4').val(retrieveExamDetails.no_of_students[3]);
    $('.student_5').val(retrieveExamDetails.no_of_students[4]);

    $('.question_1').val(retrieveExamDetails.no_of_questions[0]);
    $('.question_2').val(retrieveExamDetails.no_of_questions[1]);
    $('.question_3').val(retrieveExamDetails.no_of_questions[2]);
    $('.question_4').val(retrieveExamDetails.no_of_questions[3]);
    $('.question_5').val(retrieveExamDetails.no_of_questions[4]);

    $('.grade_1').val(retrieveExamDetails.grade[0]);
    $('.grade_2').val(retrieveExamDetails.grade[1]);
    $('.grade_3').val(retrieveExamDetails.grade[2]);
    $('.grade_4').val(retrieveExamDetails.grade[3]);
    $('.grade_5').val(retrieveExamDetails.grade[4]);

    $('.exams_new_input').addClass('has-val');
    if ($('#create_exam_form').css('display') === 'none') {
      $('.exams_container').css('filter', 'blur(2.5px)');
      $('#create_exam_form').slideDown();
      $('#create_exam_form').css('display', 'flex').css('filter', 'blur(0px)');
      const newEditExamButton = $('<button class="edit_exam_button" style="background: black;padding: 10px 35px; color: #fff; border-radius: 50px; cursor: pointer;">Save changes</button>')
      $('.create_exam_btn').replaceWith(newEditExamButton);
    }

    // ajax request
    $('.edit_exam_button').click(function(e) {
      e.preventDefault();
      const newFormData = fetchFormInputs();
      if (newFormData === null) { return; }
      const educatorId = $('#a_educator_id').attr('href').split('/')[3];
      const examId = editExamId;
      const encodedData = btoa(JSON.stringify(newFormData));
      $.ajax({
        url: `${URLS}/educator/${educatorId}/edit_exam/${examId}/`,
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
    });
  });

})


/**
 * this section is for dynamic question rendering
 */

$(document).ready(function() {
  $("#formatted-text-textarea").jqte();
});
