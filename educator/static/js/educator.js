const URLS = 'http://localhost:8000';
const $ = window.$;
let formCounter = 0;
let prevFormCounter = null;
var questionExamId;
var mediaQuestion = [];


/**
 * uploadFile - handles dynamic upload file logic
 * @param {str} file
 * @param {str} progressBar
 */
function uploadFile(file, progressBar) {
  let progress = 0;

  let interval = setInterval(function() { 
    progress += Math.random() * 10;
    if (progress >= 100) {
      clearInterval(interval);
      progressBar.children('.progress-bar').css('width', '100%');
      return;
    }
    progressBar.children('.progress-bar').css('width', progress + '%');
  }, 500);
}


/**
 * createNextQuestion - clones the create_question_form form and displays it when next button gets clicked
 */
function createNextQuestion() {
  formCounter++;

  const newForm = `<form id="create_questions_form${formCounter}" style="position: fixed; top: 2%; background: #fff;
  flex-wrap: wrap; width: 90%; box-shadow: 1px 2px 5px #00000057;
  border-radius: 5px; margin-top: 20px; padding: 50px 0px 50px 30px;
  display: none; z-index: 3; right: 2%; width: 0; height: 92%; overflow-y: scroll;">
      <div style="display: grid; grid-template-columns: 1fr 0.1fr; grid-template-rows: 1fr; margin-top: 30px;" class="question_container">

          <div class="question_text_box_container" style="grid-row: 1;">
              <div style="display: flex; gap: 10%; margin-top: 10px; position: relative;" class="question_buttons">
                  <input class="cancel_questions_create" type="button" style="cursor: pointer; background: transparent; font-size: 15px; font-weight: 900; position: absolute; top: -33px;" value="X">
                  <input class="prev_question" type="button" style="font-size: 11px; background: black; padding: 10px 20px; color: #fff; border-radius: 50px; cursor: pointer;" value="Prev question">
                  <input class="go_back" type="button" style="font-size: 11px; background: black; padding: 10px 20px; color: #fff; border-radius: 50px; cursor: pointer;" value="Back to exam">
                  <input class="next_question" type="button" style="font-size: 11px; background: black; padding: 10px 20px; color: #fff; border-radius: 50px; cursor: pointer;" value="Next question">
                  <input class="save_all" type="button" style="font-size: 11px; background: black; padding: 10px 20px; color: #fff; border-radius: 50px; cursor: pointer;" value="Save all">
                  <h5 style="font-size: 10px; position: absolute; top: -40px; right: -5px; display: none; background: gainsboro;
                  padding: 4px 9px;">&#9432;&nbsp; When this button is clicked, all questions are saved including previous ones</h5>
              </div>
              <textarea id="formatted-text-textarea" placeholder="Enter question" class="question_text_box" style="font-size: 14px; width: 720px; height: 320px; border: 1px solid black; padding: 20px 15px;"></textarea>
              <div class="word_counter" style="font-size: 12px; margin-top: -15px;"></div>
              <div class="question_type_select" style="margin-top: 20px; display: flex; gap: 100px;">
                  <div id="qts1">
                      <h5>Select answer type</h5>
                      <select class="select_answer_type" style="padding: 5px 20px; border-radius: 30px; font-size: 12px; margin-top: 10px;">
                          <option value="single">Single answer</option>
                          <option value="multiple">Multiple answers</option>
                      </select>

                      <div style="margin-top: 30px; width: 200px; font-size: 11px;" id="upload_media_files">
                      <h3>Upload local media files</h3>
                                <input style="width: 210px; margin-bottom: 20px; margin-top: 12px;" type="file" id="fileInput" multiple accept=".png, .jpg, .jpeg, .mp4, .gif">
                                <div class="mediaList"></div>
                      </div>
                  </div>
                  <div id="qts2">
                      <ul style="list-style-type: none;" id="add_more_question_ul">
                      <li><h5>Enter answers &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Answer type</h5></li>
                      <li style="display: flex; position: relative;"><span style="font-size: 15px; align-self: center; margin: 15px 10px 0px 0px;">1</span> <input class="question_checked waschecked" style="color: yellow; position: absolute; top: 30px; left: -25px;" type="radio" checked="checked"/>
                      <textarea class="options_textarea" style="margin-top: 15px; border: 1px solid black; padding: 5px 10px; border-radius: 10px; font-size: 12px;" placeholder="Enter answer"></textarea>
                          <select style="padding: 5px 15px; height: fit-content; border-radius: 10px; font-size: 10px; margin-top: 20px; margin-left: 10px;">
                                    <option value="text">Text</option>
                                    <option value="imgurl">Image url</option>
                                    <option value="vidurl">Video url</option>
                                    <option value="youturl">Youtube embed</option>
                                </select>
                          </li>
                          <li style="display: flex; position: relative;"><span style="font-size: 15px; align-self: center; margin: 15px 10px 0px 0px;">2</span> <input class="question_checked" style="color: yellow; position: absolute; top: 30px; left: -25px;" type="radio"/>
                          <textarea class="options_textarea" style="margin-top: 15px; border: 1px solid black; padding: 5px 10px; border-radius: 10px; font-size: 12px;" placeholder="Enter answer"></textarea>
                          <select style="padding: 5px 15px; height: fit-content; border-radius: 10px; font-size: 10px; margin-top: 18px; margin-left: 10px;">
                                    <option value="text">Text</option>
                                    <option value="imgurl">Image url</option>
                                    <option value="vidurl">Video url</option>
                                    <option value="youturl">Youtube embed</option>
                                </select>
                          </li>
                          </ul>
                      <input id="add_more_question_button" style="box-shadow: 1px 2px 5px #00000057; margin-top: 15px; font-size: 10px; padding: 5px 20px; border-radius: 20px;" type="button" value="click to add more answer"/>
                  </div>
              </div>

          </div>
          <div class="question_links_container" style="grid-column: 3; margin-top: -100px;">
              <ul style="list-style-type: none; position: absolute; top: 0; margin-top: 35px; font-size: 13px;">
                  <li style="list-style-type: disc;"><h4>Add links to question</h4></li>
                  <li style="list-style: disclosure-closed; font-size: 12px;">Images, gifs and videos are allowed</li>
                  <li style="list-style: disclosure-closed; font-size: 12px;">for Youtube videos paste the embeded link</li>
              </ul>
              <ul class="question_links_ul" style="list-style-type: none; padding: 35px 0px 0px 30px;">
                  <li>
                      <div class="question_wrap_input" style="position: relative;">
                          <input class="question_new_input" type="url" name="link">
                          <span class="question_new_input_span" data-placeholder=".png, .jpeg, .jpg, .gifs, .mp4 files are allowed"></span>
                          <input class="question_new_input_check_mark" type="button" value="add media to question"
                          style="color: green; position: absolute; right: -115px; top: 35px;
                          font-size: 8px; padding: 4px 10px; border-radius: 15px;">
                          <img style="height: 160px; position: absolute; right: -325px; top: -6px;" class="question_image_viewport"/>
                      </div>
                  </li>
                  <br>
              </ul>
              <input class="add_more_links" style="font-size: 11px; padding: 5px 10px; border-radius: 10px; background: yellow;
              font-weight: bold; cursor: pointer; margin: 30px 0px 0px -10px;" type="button" value="click to add more than one link">
            </div>
      </div>

  </form>`

  if (formCounter > 1) {
    $('.all_question_form').children('form').animate({ width: "0%" }, 500, 'linear');
    setTimeout(function () {
      $('.all_question_form').children('form').hide();
    }, 500);
  } else {
    $('#create_questions_form').animate({ width: '0%' }, 500, 'linear');
    setTimeout(function () {
      $('#create_questions_form').hide();
    }, 500);
  }

  $('.all_question_form').append(newForm);
  $(`#create_questions_form${formCounter}`).animate({ width: '90%' }, 500, 'linear');

  setTimeout(function() {
    $(`#create_questions_form${formCounter}`).css('display', 'flex');
    $(`#create_questions_form${formCounter}`).find('#formatted-text-textarea').jqte();
  }, 500);
};


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

/**
 * getFileExtensionType - checks if a url has a valid file extension and if it's a valid url
 * @param {str} url - url to check
 */
function getFileExtensionType (url) {
  const filenameMatch = url.match(/\/([^\/?#]+)[^\/]*$/);
  const filename = filenameMatch ? filenameMatch[1] : '';

  // check if url starts with 'https://' or 'www.'
  const startsWithHttpOrWww = /^https?:\/\/|^www\./i.test(url);

  // check if the filename has a supported image or video file extension
  // also test for youtube videos
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(filename);
  const isVideo = /\.(mp4)$/i.test(filename);
  const isYouTubeVideo = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm.test(url);

  if (startsWithHttpOrWww && isYouTubeVideo) {
    return 'youtube';
  }
  if (startsWithHttpOrWww && isImage) {
    return 'image';
  }
  if (startsWithHttpOrWww && isVideo) {
    return 'video';
  }
  if (!isImage && !isVideo) {
    return false;
  }
}

/**
 * checkLInk - checks if a url contains valid image or video or gif data
 * @param {str} link url to check if the file is an image or video or gif and if it contains valid image data
 * @returns the data for image
 */
function checkLink (link) {
  return new Promise(function (resolve, reject) {
    const img = new Image();
    img.onload = function () {
      resolve('image');
    };
    img.onerror = function () {
      const video = document.createElement('video');
      video.onloadedmetadata = function () {
        resolve('video');
      };
      video.onerror = function () {
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
function isValidUrl (url) {
  // const urlPattern = /^(?:(?:ftp|http|https):\/\/)?(?:www\.)?[^ "]+$/;
  let regex = new RegExp(
    '^(?:http|ftp)s?://' +  // http:// or https:// or ftp://
    '(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\\.)+(?:[A-Z]{2,6}\\.?|[A-Z0-9-]{2,}\\.?)|' +  // domain...
    'localhost|' +  // localhost...
    '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' +  // ...or ipv4
    '\\[?[A-F0-9]*:[A-F0-9:]+\\]?)' +  // ...or ipv6
    '(?::\\d+)?' +  // optional port
    '(?:/?|[/?]\\S+)$', 'i');  // case-insensitive
    
    if (!regex.test(url)) {
      return false;
    }

    try {
      let parsedUrl = new URL(url);
      return parsedUrl.protocol && parsedUrl.hostname;
    } catch (e) {
      return false;
    }
}

/**
 * fetchFormInputs - fetch values from inputs in the exam form
 * @returns fetched form if all fields contain values else NULL
 */
function fetchFormInputs () {
  const inputTypeNumbers = [1, 2, 3, 4, 5];
  const allInputsDict = {
    // durations: '',
    no_of_students: '',
    no_of_questions: '',
    grade: '',
    time_limit: ''
  };

  for (const c of inputTypeNumbers) {
    // const tempDurationC = $(`input[name=duration_digit-${c}]`).val();
    const tempQuestionsC = $(`input[name=question_digit-${c}]`).val();
    const tempStudentsC = $(`input[name=students_no_digit-${c}]`).val();
    const tempGrade = $(`input[name=grade_digit-${c}]`).val();
    // allInputsDict.durations += /\d/.test(tempDurationC) ? tempDurationC : '';
    allInputsDict.no_of_questions += /\d/.test(tempQuestionsC) ? tempQuestionsC : '';
    allInputsDict.no_of_students += /\d/.test(tempStudentsC) ? tempStudentsC : '';
    allInputsDict.grade += /\d/.test(tempGrade) ? tempGrade : '';
  }
  const timeLimitSe = $('#time_limit_select').val();
  allInputsDict.time_limit += /\d/.test(timeLimitSe) ? timeLimitSe : $('input[name=time_limit]').val();

  const formData = {
    title: $('input[name=title]').val(),
    description: $('textarea[name=description]').val(),
    start_date: $('input[name=start_date]').val(),
    end_date: $('input[name=end_date]').val(),
    // duration: allInputsDict.durations,
    no_of_students: allInputsDict.no_of_students,
    no_of_questions: allInputsDict.no_of_questions,
    grade: allInputsDict.grade,
    time_limit: allInputsDict.time_limit
  };
  // check inputs
  const formDataKeys = Object.keys(formData);
  for (const keys of formDataKeys) {
    if (keys !== 'duration') {
      if (formData[keys].length <= 0) {
        warningSlides({
          warning: 'You have empty fields'
        });
        return null;
      }
    }
  }

  /*if (formData.duration.length <= 1 || formData.duration[0] === '0') {
    warningSlides({
      warning: 'Duration is too short, lets try a time greater than 9 mins'
    });
    return null;
  }*/
  return formData;
}

$(document).ready(function () {
  'use strict';

  // warning_ slideUp
  if ($('.warningg, .redirect').length) {
    setTimeout(function () {
      $('.warningg, .redirect').slideUp();
    }, 3000);
  }

  // redirect sliding stroke
  $('.redirect-sliding-stroke').animate({ width: 0 }, 3000, 'linear');

  // warning width desktop width
  const bodyWidth = $('body').width();
  $('.warning, .warningg, .redirect').css('left', `${bodyWidth / 2.5}px`);
  // all exams gap
  $('.all_exams').css('gap', `${bodyWidth / 6}px`);

  // error message temporary view
  if ($('.success_notification').length) {
    setTimeout(function () {
      $('.success_notification').slideUp();
    }, 2000);
  }
  $('.exam-box .active_exam').css('width', '100%');
  $('.exams_new_input').val('');

  // exam inactive hover details
  $('.toolkit-container').hover(function () {
    $('.toolkit-container h6').css('display', 'block');
  }, function () {
    $('.toolkit-container h6').css('display', 'none');
  });

  // important sliding stroke rectangular sliding stroke
  $('.sliding-stroke').animate({ width: 0 }, 30000, 'linear', function () {
    $('.exams_create_an_exam ul').slideUp();
  });


  // exams box toogle, for dashboard
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

  $('.active').each(function () {
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
  $('.scroll_information').css('gap', `${gapWidth}px`);

  // left side bar toogle
  $(document).on('click', '.menu-button', function () {
    const closeBUtton = $('<span class="close-button">&times;</span>');
    $('.right, .exams_container').css('margin-left', '12%');
    $(this).animate({ width: '100%' }, 500, 'linear');
    $(this).css('text-align', 'end');
    $('.first_ul a').css('display', 'block');
    $(this).replaceWith(closeBUtton);
  });

  $(document).on('click', '.close-button', function () {
    const menuBUtton = $('<button class="menu-button">&#9776;</button>');
    $('.right, .exams_container').css('margin-left', '5%');
    $(this).animate({ width: '100%' }, 500, 'linear');
    $(this).css('text-align', 'start');
    $('.first_ul a').css('display', 'none');
    $(this).replaceWith(menuBUtton);
  });

  // left side icons click ajax requests
  $('.first_ul li, .second_ul li').click(function (e) {
    const aLink = $(this).find('a').attr('href');
    const aLinkURL = `${URLS}${aLink}`;
    $.ajax({
      url: aLinkURL,
      method: 'GET',
      success: function (response) {
        window.location.replace(aLinkURL);
      },
      error: function (xhr, errmsg, err) {
        throw err;
      }
    });
  });


  // exams.js
  $('.input_number, .custom_option').bind('input propertychange', function () {
    let inputValue = $(this).val();
    if (/\D/.test(inputValue)) {
      warningSlides({
        warning: 'Input must be numbers only'
      });
      inputValue = inputValue.replace(/\D/g, ''); // remove user entered input that doesn't match digits
      $(this).val(inputValue);
    } else { $('.warning').hide(); }
  });

  $('.exams_new_input, .question_new_input').each(function () {
    $(this).on('blur', function () {
      if ($(this).val().trim() !== '') {
        $(this).addClass('has-val');
      } else {
        $(this).removeClass('has-val');
      }
    });
  });

  // exams yellow and black background colors
  const allExamItems = $('.all_exams_li');
  const itemsColors = ['yellow', 'black'];
  const itemsTextColors = ['black', 'white'];
  let itemsColorIndex = 0;
  allExamItems.each(function (index) {
    $(this).css('background', itemsColors[itemsColorIndex]).css('color', itemsTextColors[itemsColorIndex]);
    itemsColorIndex = (itemsColorIndex + 1) % itemsColors.length;
  });

  /* NUMBERS INPUT FIELD */
  $('.authy_f').find('input').each(function () {
    $(this).attr('maxlength', 1);
    $(this).on('keyup', function (e) {
      const parent = $($(this).parent());

      if (e.keyCode === 8 || e.keyCode === 37) {
        const prev = parent.find('input#' + $(this).data('previous'));

        if (prev.length) {
          $(prev).select();
        }
      } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
        const next = parent.find('input#' + $(this).data('next'));

        if (next.length) {
          $(next).select();
        } else {
          if (parent.data('autosubmit')) {
            parent.submit();
          }
        }
      }
    });
  });

  $('.exams_create_an_exam h4').click((e) => {
    if ($('#create_exam_form').css('display') === 'none') {
      const inputTypeNumbers = [1, 2, 3, 4, 5];
      $('.exams_container').css('filter', 'blur(2.5px)');
      // clear all value in inputs if found before displauing create exam form
      $('input[name=title]').val('');
      $('textarea[name=description]').val('');
      $('input[name=start_date]').val('');
      $('input[name=end_date]').val('');
      $('input[name=time_limit]').val('');
      for (const c of inputTypeNumbers) {
        $(`input[name=question_digit-${c}]`).val('');
        $(`input[name=students_no_digit-${c}]`).val('');
        $(`input[name=grade_digit-${c}]`).val('');
      }
      const newCreateExamButton = $('<button style="background: black; padding: 10px 25px; color: #fff; border-radius: 50px; cursor: pointer;" class="create_exam_btn"> Create exam now </button>');
      $('.edit_exam_button').replaceWith(newCreateExamButton);
      $('.add_questions').css('display', 'none');
      $('#create_exam_form').css('display', 'flex').css('filter', 'blur(0px)');
    }
  });

  // word counter for description and for question text area
  $('#description, .question_text_box').bind('input propertychange', function () {
    const charCount = $(this).val().length;
    if (charCount <= 650) {
      $('.word_counter').text(`${650 - charCount} characters remaining`);
    }
    if (charCount > 650) {
      $(this).val($(this).val().substring(0, 650));
      warningSlides({
        warning: "oops you've exhausted your words"
      });
    }
  });

  // Create exam ajax post
  $('.create_exam_btn').click(function (e) {
    e.preventDefault();
    const formData = fetchFormInputs();
    if (formData === null) { return; }
    const educatorId = $('#a_educator_id').attr('href').split('/')[2];
    console.log(educatorId)
    const encodedData = btoa(JSON.stringify(formData));
    $.ajax({
      url: `${URLS}/exam/create_exam/${educatorId}/`,
      type: 'POST',
      data: { EX: encodedData },
      headers: {
        'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
      },
      success: function (response) {
        window.location.replace(window.location.href);
      },
      error: function (xhr, errmsg, err) {
        console.log(err);
      }
    });
  });

  // add questions and questions rendering
  $('.add_questions').click(function (e) {
    const formData = fetchFormInputs();

    // extra check to see if other create question forms have been created and it should append to all_questions_form div tag
    if ($('.all_question_form').children().length > 2) {
      // append to all_questions_form
      $('#create_exam_form').css('display', 'none');
      return createNextQuestion();
    }
    if (formData) {
      $('#create_exam_form').css('display', 'none');
      $('#create_questions_form').css('display', 'flex');
      $('#create_questions_form').animate({ width: '90%' }, 500, 'linear');
    } else {
      warningSlides({
        warning: 'you have incomplete fields'
      });
    }
  });

  // go back to exam when add question is clicked
  $(document).on('click', '.go_back', function () {
    let forCounter = $(this).parent('div').parent('div').parent('div').parent('form').attr('id');
    let lastCharCounter = forCounter.toString().split('_')[2].split('m')[1];
    if(/\d/.test(lastCharCounter)) {
      $(`#create_questions_form${lastCharCounter}`).animate({ width: '0%' }, 500, 'linear');
      setTimeout(function () {
        $(`#create_questions_form${lastCharCounter}`).css('display', 'none');
      }, 500);
    } else {
      $('#create_questions_form').animate({ width: '0%' }, 500, 'linear');
      setTimeout(function () {
        $('#create_questions_form').css('display', 'none');
      }, 500);
    }

    $('#create_exam_form').css('display', 'flex');
  });

  // add more links for questions i.e img, gif and video links
  $(document).on('click', '.add_more_links', function () {
    let childrenLiLen = $(this).parent('div').children('.question_links_ul').children('li').length;
    if (childrenLiLen === 5) {
      warningSlides({
        warning: 'Only 5 links are allowed'
      });
    }
    if (childrenLiLen < 5) {
      $('.question_links_ul').append(`
        <li>
        <div class="question_wrap_input" style="position: relative;">
        <input class="question_new_input" type="url" name="link">
        <span class="question_new_input_span" data-placeholder=".png, .jpeg, .jpg, .gifs, .mp4 files are allowed"></span>
        <input class="question_new_input_check_mark" type="button" value="add media to question"
        style="color: green; position: absolute; right: -115px; top: 35px;
        font-size: 8px; padding: 4px 10px; border-radius: 15px;">
        <img style="height: 160px; position: absolute; right: -325px; top: -6px;" class="question_image_viewport"/>
        </div>
        </li><br>`);
    }
  });

  // Options custom field for exam creation time limit
  $('#time_limit_select').change(function () {
    const selectedValue = $(this).val();
    if (selectedValue === 'Custom time') {
      $('.custom_option').show();
    } else { $('.custom_option').hide(); }
  });

  $('.custom_option').bind('input propertychange', function (e) {
    if ($(this).val() < 5 && /\d/.test($(this).val())) {
      warningSlides({
        warning: 'Custom time limit must be greater than 5 mins'
      });
    }
  });
});

/**
 * This section is meant to handle dynamic questions rendering in client side plus
 * other dynamic exams rendering like when a user clicks on more details for an exam
 * also the dashboard calender rendering
 */

$(document).ready(function () {
  'use strict';

  // dashboard calendar rendering
  function dashboardCalendar () {
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
      SUN: 'SUNDAY'
    };
    if (daysOfTheWeek.hasOwnProperty(alphaDay.toUpperCase())) {
      $('.day').text(daysOfTheWeek[alphaDay.toUpperCase()]).css('font-weight', '600');
    }

    if (currentDate.getDay() < 10) {
      $('.num-date').text(currentDate.getDate());
    }

    $('.days div').each(function () {
      const thisClsName = $(this)['0'].className;
      if ($(`.${thisClsName} p`).text().trim() === alphaDay.toUpperCase()) {
        $(this).css('color', 'black').css('font-weight', '600');
      }
    });

    $('.month-hover').each(function () {
      if ($(this).text().trim() === month) {
        $(this).css('color', 'black').css('font-weight', '600');
      }
    });

    // creating dates and days of the week for current month
    const newYear = currentDate.getFullYear();
    const newMonth = currentDate.getMonth();
    const currentNewDate = new Date(newYear, newMonth, 1);
    const newAlphaDate = currentNewDate.toDateString().split(' ')[0].toUpperCase();
    const numberOfDaysInCurrentMonth = new Date(newYear, newMonth + 1, 0).getDate();

    const dates = [];

    const daysOfTheWeekList = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    let currentDay = $.inArray(newAlphaDate, daysOfTheWeekList);

    for (let i = 1; i <= numberOfDaysInCurrentMonth; i++) {
      dates.push({ [daysOfTheWeekList[currentDay]]: i });
      currentDay = (currentDay + 1) % 7;
    }

    $.each(dates, function (index, dict) {
      $.each(dict, function (key, value) {
        $('.days div').each(function (e) {
          const thisClsName = $(this)['0'].className;
          if ($(`.${thisClsName} p`).text().trim() === key) {
            if (value === currentDate.getDate()) { // old current date from line 320
              $($(`.${thisClsName} ul`)).append(`<li style="padding: 16.5px 8px;" class="current_calender_date"> ${value} </li>`);
            } else {
              $($(`.${thisClsName} ul`)).append(`<li style="padding: 16.5px 8px;"> ${value} </li>`);
            }
          }
        });
      });
    });
  }
  dashboardCalendar();

  // more details on exam in exam section
  $('.more_details').click(function () {
    const cont = $(this).siblings('.more_details_container');
    if (cont.css('display') === 'none') {
      $(this).siblings('.more_details_container').slideDown();
    } else {
      $(this).siblings('.more_details_container').slideUp();
    }
  });

  // delete exams
  $('.more_details_delete').click(function (e) {
    e.preventDefault();
    const examId = $(this).data('exam-id');
    const myExamList = $(this).closest('li');
    const numLiElements = myExamList.parent().find('li').length;

    if (confirm('Are you sure you want to delete this exam?')) {
      $.ajax({
        url: `${URLS}/exam/delete_exam/${examId}/`,
        type: 'PUT',
        headers: {
          'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function (response, textStatus, xhr) {
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
              warning: 'Exam does not exist'
            });
          }
        },
        error: function (xhr, status, error) {
          console.error(error);
        }
      });
    }
  });

  // edit exams and send ajax post request with edited values
  $('.more_details_edit').click(function () {
    const listItem = $(this).closest('li');

    const title = listItem.find('[data-exam-title]').data('exam-title');
    const description = listItem.find('[data-exam-description]').data('exam-description');
    const startDate = listItem.find('[data-exam-start-date]').data('exam-start-date');
    const endDate = listItem.find('[data-exam-end-date]').data('exam-end-date');
    // const duration = listItem.find('[data-exam-duration]').data('exam-duration');
    const students = listItem.find('[data-exam-no-of-students]').data('exam-no-of-students');
    const questions = listItem.find('[data-exam-no-of-questions]').data('exam-no-of-questions');
    const grade = listItem.find('[data-exam-grade]').data('exam-grade');
    const timeLimit = listItem.find('[data-exam-time-limit]').data('exam-time-limit');
    const editExamId = listItem.find('[data-exam-id]').data('exam-id');
    questionExamId = editExamId;

    const retrieveExamDetails = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      //duration: duration.toString().split('').map(Number),
      no_of_students: students.toString().split('').map(Number),
      no_of_questions: questions.toString().split('').map(Number),
      grade: grade.toString().split('').map(Number),
      time_limit: timeLimit
    };

    $('.exams_new_input').val(retrieveExamDetails.title);
    $('.textarea').val(retrieveExamDetails.description);
    $('.sstart_datee').val(retrieveExamDetails.start_date);
    $('.eend_datee').val(retrieveExamDetails.end_date);
    if (![5, 10, 15, 20, 30, 40, 50, 60, 90, 120].includes(timeLimit)) {
      $('#time_limit_select').val($('#time_limit_select option:last').val());
      $('.custom_option').val(retrieveExamDetails.time_limit);
      $('.custom_option').css('display', 'block');
    } else {
      $('#time_limit_select').val(retrieveExamDetails.time_limit);
    }

    /*$('.duration_1').val(retrieveExamDetails.duration[0]);
    $('.duration_2').val(retrieveExamDetails.duration[1]);
    $('.duration_3').val(retrieveExamDetails.duration[2]);
    $('.duration_4').val(retrieveExamDetails.duration[3]);
    $('.duration_5').val(retrieveExamDetails.duration[4]);*/

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
      const newEditExamButton = $('<button class="edit_exam_button" style="background: black;padding: 10px 35px; color: #fff; border-radius: 50px; cursor: pointer;">Save changes</button>');
      $('.create_exam_btn').replaceWith(newEditExamButton);
      $('.add_questions').css('display', 'inline');
    }

    // ajax request
    $('.edit_exam_button').click(function (e) {
      e.preventDefault();
      const newFormData = fetchFormInputs();
      if (newFormData === null) { return; }
      const educatorId = $('#a_educator_id').attr('href').split('/')[2];
      const examId = editExamId;
      const encodedData = btoa(JSON.stringify(newFormData));
      $.ajax({
        url: `${URLS}/exam/${educatorId}/edit_exam/${examId}/`,
        type: 'POST',
        data: { EX: encodedData },
        headers: {
          'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function (response) {
          window.location.replace(window.location.href);
        },
        error: function (xhr, errmsg, err) {
          console.log(err);
        }
      });
    });
  });
});

// check mark to lock link input and add input value to question
$(document).on('click', '.question_new_input_check_mark', function () {
  let input = $(this).closest('.question_wrap_input').find('.question_new_input');
  let imgTag = $(this).closest('.question_wrap_input').find('.question_image_viewport');
  let appendVideoTag = $(this).closest('.question_wrap_input');
  let inputValue = input.val().trim();
  let embededYoutubeLink = null;
  let addMediaLinkToQuestion = `<input class="media_link_to_question"
    style="font-size: 9.5px; font-weight: bolder; padding: 4px 10px; border-radius: 10px;"
    type="button" value="add media link to question">`

  if (!isValidUrl(inputValue) && inputValue !== '') {
    if (input.val().trim().split('src="').length > 1) {
      embededYoutubeLink = input.val().trim().split('src="')[1].split(' ')[0].replace('"', '');
    }
  }

  if (inputValue === '') {
    return warningSlides({
      warning: 'link is empty'
    });
  } else if (!isValidUrl(inputValue) && !isValidUrl(embededYoutubeLink)) {
    return warningSlides({
      warning: 'not a valid link'
    });
  }
  if ((inputValue !== '' && isValidUrl(inputValue)) || isValidUrl(embededYoutubeLink)) {
    $(this).siblings('small').html(addMediaLinkToQuestion)
    input.addClass('has-val');
    input.prop('readonly', true);
    $(this).replaceWith(`<input class="question_new_input_clear" type="button" value="remove media"
    style="color: red; position: absolute; right: -100px; top: 35px; padding: 5px 10px; border-radius: 10px; font-size: 10px;">`);
  }

  // images
  if (getFileExtensionType(inputValue) === 'image') {
    imgTag.attr('src', inputValue);
    imgTag.css('width', '200px');
    imgTag.css('border', '2px solid black');
  }

  // mp4 video
  if (getFileExtensionType(inputValue) === 'video') {
    appendVideoTag.append(`<video controls style="width: 200px; height: 160px; position: absolute; right: -325px; top: -6px;" class="question_video_viewport">
    <source src="${inputValue}" type="video/mp4">
    Your browser does not support the video tag.
    </video>`);
  }

  // youtube video
  if (embededYoutubeLink && getFileExtensionType(embededYoutubeLink) === 'youtube') {
    appendVideoTag.append(`<iframe style="width: 200px; height: 160px; position: absolute; right: -325px; top: -10px;" src="${embededYoutubeLink}"
    title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`);
  }

  // add media to question
  mediaQuestion.push(inputValue);
});


// question new input clear
$(document).on('click', '.question_new_input_clear', function () {
  const input = $(this).parent('.question_wrap_input').find('.question_new_input');
  input.prop('readonly', false);
  $(this).replaceWith(`<input class="question_new_input_check_mark" type="button" value="add media to question"
  style="color: green; position: absolute; right: -115px; top: 35px;
  font-size: 8px; padding: 4px 10px; border-radius: 15px;">`);
  for(let c = 0; c < mediaQuestion.length; c++) {
    if (input.val().trim() === mediaQuestion[c]) {
      mediaQuestion.splice(c, 1);
      break;
    }
  }
  input.val('')
  input.bind('input propertychange', function () {
    if ($(this).val() === '') {
      input.removeClass('has-val');
    }
  });
});

/**
 * this section is for dynamic question rendering
 */

$(document).ready(function () {
  // text editor creation
  $('#formatted-text-textarea').jqte();
});

$(document).on('click', '.jqte_editor', function () {
  $(this).prop('contenteditable', true);
});

// add more answers
$(document).on('click', '#add_more_question_button', function () {
  let nearestUl = $(this).parent('div').children('ul');
  if (nearestUl.find('li').length > 16) {
    warningSlides({
      warning: '16 answers are allowed'
    });
  } else {
    let checkedType = $(this).parent('#qts2').children('ul').children('li').children('input').attr('type');
    nearestUl.append(`<li style="display: flex; position: relative;"><span style="font-size: 15px; align-self: center; margin: 15px 10px 0px 0px;">${nearestUl.find('li').length}</span>
    <input class="question_checked" style="color: yellow; position: absolute; top: 30px; left: -25px;" type="${checkedType}"/>
    <textarea class="options_textarea" style="margin-top: 15px; border: 1px solid black; padding: 5px 10px; border-radius: 10px; font-size: 12px;" placeholder="Enter answer"></textarea>
    <select style="padding: 5px 15px; height: fit-content; border-radius: 10px; font-size: 10px; margin-top: 20px; margin-left: 10px;">
                                    <option value="text">Text</option>
                                    <option value="imgurl">Image url</option>
                                    <option value="vidurl">Video url</option>
                                    <option value="youturl">Youtube embed</option>
                                </select>
    <span style="cursor: default; color: red; font-weight: 900; font-size: 13px; top: 25px; position: relative; left: 5px;" class="remove_li_questions">X</span>
    </li>
    `);
  }
});

// answer type click, single and multiple i.e select and option tags
$(document).on('click', '.select_answer_type', function () {
  // answer type select dynamic rendering
  let qChecked = $(this).parent('#qts1').parent('div').children('#qts2').children('ul').children('li').children('input')
  if ($(this).val() === 'single') {
    qChecked.attr('type', 'radio');
    // if more than one answer has been checked uncheck all of them, once the input type is radio
    let addMoreQuestionUl = $(this).parent('div').parent('div').children('#qts2').children('ul').children('li');
    if (addMoreQuestionUl.children('.waschecked').length > 1) {
      addMoreQuestionUl.children('.waschecked').prop('checked', false);
      addMoreQuestionUl.children('.question_checked').removeClass('waschecked');
    }
  } else {
    qChecked.attr('type', 'checkbox');
  }
});

// remove answers when add more answer buttons gets clicked
$(document).on('click', '.remove_li_questions', function () {
  $(this).parent().remove();
});

// answer check dynamic rendering
$(document).on('click', '.question_checked', function () {
  // single type answers
  let selVal = $(this).parent('li').parent('ul').parent('div').parent('div').children('#qts1').children('select').val();
  if (selVal === 'single') {
    let $radio = $(this);
    let masterChecked = $(this).parent('li').parent('ul').children('li').children('.waschecked'); // get checked radio type with wascheck to be true
    let masterCheckedError = false;

    if (masterChecked.length > 0 && !$radio.hasClass('waschecked')) {
      warningSlides({
        warning: 'only one selection for single answer type'
      });
      masterCheckedError = true;
      $radio.prop('checked', false);
      return;
    }
    if (!masterCheckedError) {
      if ($radio.hasClass('waschecked')) {
        $radio.prop('checked', false);
        $radio.removeClass('waschecked');
      } else {
        $radio.addClass('waschecked');
      }
    }
  }

  if (selVal === 'multiple') {
    $(this).addClass('waschecked');
  }
});


// jquery editor, maximum characters to enter
$(document).on('input propertychange', '.jqte_editor', function () {
  // $('.jqte_editor').bind('input propertychange', function() {
  const $this = $(this);
  const charCount = $this.text().length;
  if (charCount <= 650) {
    $(this).parent('.jqte').parent('.question_text_box_container').children('.word_counter').text(`${650 - charCount} characters remaining`);
  }
  if (charCount > 650) {
    $this.prop('contenteditable', false);
    warningSlides({
      warning: "Oops! You've exhausted your words."
    });
  }
});


/* next button click
*/
$(document).ready(function () {

  $(document).on('click', '.next_question', function () {
    /**
    * a check if the current form is the last form then it creates a new form and append it to the div tag that houses all forms
    * otherwise if moves onto the next form and not create a new form
    */
    let currForm = $(this).parent('.question_buttons').parent('.question_text_box_container').parent('.question_container').parent('form');
    /** get all froms in the all question form and compare if the length is more than one
     * and if the last element equals the current element
     * */

    let allFormsLength = $('.all_question_form').children().length;
    $('.all_question_form').find('form').each(function(index, item) {
      // on last form so create new form
      if (index === (allFormsLength - 1) && $(this).attr('id') === currForm.attr('id')) {
        return createNextQuestion();
      }
      if (index !== (allFormsLength - 1) && $(this).attr('id') === currForm.attr('id')){
        // not on last from so move to next form instead of creating new one
        let currentFormCount = currForm.attr('id').toString().split('_')[2].split('m')[1];
        if (/\d/.test(currentFormCount)) {
          const nextCurrentFormCount = parseInt(currentFormCount) + 1;
          $(`#create_questions_form${currentFormCount}`).animate({ width: "0%" }, 500, 'linear');
          $(`#create_questions_form${currentFormCount}`).hide();
          setTimeout(function () {
            $(`#create_questions_form${nextCurrentFormCount}`).animate({ width: '90%' }, 500, 'linear');
            $(`#create_questions_form${nextCurrentFormCount}`).css('display', 'flex');
          }, 500);
        } else {
          $(`#create_questions_form`).animate({ width: "0%" }, 500, 'linear');
          $(`#create_questions_form`).hide();
          setTimeout(function () {
            $(`#create_questions_form1`).animate({ width: '90%' }, 500, 'linear');
            $(`#create_questions_form1`).css('display', 'flex');
          }, 500);
        }
      }
    });
  });
});


// cancel question form create
$(document).on('click', '.cancel_questions_create', function() {
  let forCounter = $(this).parent('div').parent('div').parent('div').parent('form').attr('id');
  let lastCharCounter = forCounter.toString().split('_')[2].split('m')[1];
  if(/\d/.test(lastCharCounter)) {
    $('#create_exam_form').slideUp();
    $(`#create_questions_form${lastCharCounter}`).slideUp();
    $('.exams_container').css('filter', 'blur(0px)');
  } else {
    $('#create_exam_form').slideUp();
    $('#create_questions_form').slideUp();
    $('.exams_container').css('filter', 'blur(0px)');
  }
});


// cancel exam create
$(document).on('click', '.cancel_exam_create', function() {
  $('#create_exam_form').slideUp();
  $('.exams_container').css('filter', 'blur(0px)');
})


/**
 * prev button click
 */
$(document).ready(function () {
  $(document).on('click', '.prev_question', function () {
    let currForm = $(this).parent('.question_buttons').parent('.question_text_box_container').parent('.question_container').parent('form');
    let currentFormCount = currForm.attr('id').toString().split('_')[2].split('m')[1]

    if (currentFormCount === '1') {
      $(`#create_questions_form${currentFormCount}`).animate({ width: '0%' }, 500, 'linear');
      $(`#create_questions_form${currentFormCount}`).hide();
      setTimeout(function () {
        $('#create_questions_form').animate({ width: '90%' }, 500, 'linear');
        $(`#create_questions_form`).css('display', 'flex');
      }, 500);
    }

    if (formCounter > 1 && currentFormCount > 1) {
      $(`#create_questions_form${currentFormCount}`).animate({ width: "0%" }, 500, 'linear');
      $(`#create_questions_form${currentFormCount}`).hide();
      setTimeout(function () {
        $(`#create_questions_form${currentFormCount - 1}`).animate({ width: '90%' }, 500, 'linear');
        $(`#create_questions_form${currentFormCount - 1}`).css('display', 'flex');
      }, 500);
    } else {
      $(`#create_questions_form${formCounter}`).animate({ width: '0%' }, 500, 'linear');
      $(`#create_questions_form${formCounter}`).hide();
      setTimeout(function () {
        $('#create_questions_form').animate({ width: '90%' }, 500, 'linear');
        $(`#create_questions_form`).css('display', 'flex');
      }, 500);
    }
  });

});


/**
 * This section handles jqte editor text collecting and request to server
 */

$(document).ready(function () {

  // warning message when "save all" button is hovered
  $(document).on({
    mouseenter: function () {
      $('.question_buttons h5').css('display', 'block');
    },
    mouseleave: function () {
      $('.question_buttons h5').css('display', 'none');
    }
  }, '.save_all')


/**
  * action: (onclick) button
  * details: gets all questions and details for all question form and saves all questions
  */
$(document).on('click', '.save_all', function () {
  let questionsList = [], options = [], correctAnswer = [], count = 0, optionsLength, sm;

  $('.question_container').each(function() {
    let qQuestion = $(this).find('.jqte_source').children('#formatted-text-textarea').val();
    let mediaQuestionDict = {};

    if (mediaQuestion.length > 0) {
      $.each(mediaQuestion, function(index, item) {
        mediaQuestionDict[index] = ''
        mediaQuestionDict[index] += item
      })
    }

    $(this).find('.options_textarea').each(function(index, item) {
      let optionValue = $(this).val();
      if (optionValue.length > 1) {
        options.push(
          {[optionValue]: $(this).siblings('select').val()
        });
        if ($(this).parent('li').children('.waschecked').length > 0) {
          correctAnswer.push(
            {[optionValue]: $(this).siblings('select').val()
          });
        }
      }
    });

    let correctAnswerType = $(this).find('.waschecked').attr('type');

    if (!qQuestion || options.length < 1 || !correctAnswer || !correctAnswerType) {
      return warningSlides({ warning: `current form has incomplete fields` });
    }

    questionsList.push({
      [`question_${count}`]: [
        { examId: questionExamId },
        { question: mediaQuestion.length > 0 ? {questionMedia: mediaQuestionDict, question: qQuestion } : qQuestion },
        { options: options },
        { correctAnswer: correctAnswer },
        { answerType: correctAnswerType },
      ]
    });
    optionsLength = options.length;
    sm = options;
    options = [];  // reset options list
    correctAnswer = [];  // reset correct answer list
    count++;
  });

  if (optionsLength < 2) {
    return warningSlides({ warning: 'you have incomplete fields' })
  }

  $.ajax({
    url: `${URLS}/question/create_question/`,
    type: 'POST',
    data: { EX: btoa(JSON.stringify(questionsList)) },
    headers: {
      'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
    },
    success: function () {
      window.location.replace(window.location.href);
    },
    error: function (xhr, errmsg, err) {
      console.log(err);
    }
  });
  return;
  })


  /** 
   * section for dynamic file uploading
  */
  $(document).on('change', '#fileInput', function() {
    let files = $(this)[0].files;
    let mediaListLen = $(this).siblings('.mediaList').children('.media-container').length;

    if (files.length === 0) { return warningSlides({ warning: 'select a file' })} ;
    if (files.length + mediaListLen > 5) {
      return warningSlides({
        warning: 'you can only select 5 media files',
      })
    }

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (file) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          return warningSlides({
            warning: 'Invalid file type. Only PNG, JPEG, JPG, MP4, and GIF files are allowed.'
          });
        }
        
        // File size validation
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          return warningSlides({
            warning: 'File size exceeds the limit of 5MB.'
          });
        }
      }


      let mediaContainer = $('<div class="media-container"></div>');
      let progressBar = $('<div class="progress"><div class="progress-bar"></div></div>');
      let fileName = $('<p>' + file.name + '</p>');
      
      mediaContainer.append(fileName, progressBar);
      let mediaList = $(this).siblings('.mediaList');
      mediaList.prepend(mediaContainer);
      
      uploadFile(file, progressBar);
    }
    $(this).val('');
  })
})


/**
 * this setion handles question rendering for exams that has questions
*/
$(document).on('click', '.go_to_questions', function() {
  const listItem = $(this).closest('li');
  const examId = listItem.find('[data-exam-id]').data('exam-id');
  const educatorId = $('#a_educator_id').attr('href').split('/')[2];
  let data = null;
  const background = listItem.css('background');
  const fontColor = listItem.css('color');
  const examName = listItem.find('[data-exam-title]').data('exam-title');
  let li = `<div style="padding: 0px 0px 30px 0px; font-size: 18px; position: absolute; background: inherit;
  width: -moz-available;" class="questions_container_exam_title"><strong style="font-size: 22px;">${examName}</strong></div>`

  // ==== fetch exams based on exam id ====
  function fetchChunk() {
    $.ajax({
      url: `${URLS}/question/fetch_question/${examId}/${educatorId}`,
      type: 'GET',
      headers: {
        'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val()
      },
      success: function (response, errmsg, err) {
        data = response;
        if (data.length > 0) {

          for (let i = 0; i < data.length; i++) {
            let answersType = data[i].answers_type.substring(1, data[i].answers_type.length - 1);
            answersType = answersType === 'radio' ? 'disc': answersType;
            console.log(data[i])

            if (typeof(data[i].question_text) === 'object') {
              const dataQuestion = data[i].question_text;

              // ==== verify questionMedia type ====
              let mediaView = '';
              $.each(Object.values(dataQuestion.questionMedia), function(index, item) {
                let mediaExtensionType = getFileExtensionType(item);
                if (mediaExtensionType === 'image') {
                  mediaView += `<br><img src="${item}" style="width: 200px; height: 180px;"/>`
                }
                if (mediaExtensionType === 'video') {
                  mediaView += `<br><video controls style="width: 200px; height: 160px; position: absolute; right: -325px; top: -6px;" class="question_video_viewport">
                  <source src="${item}" type="video/mp4">
                  Your browser does not support the video tag.
                  </video>`
                }
                if (mediaExtensionType === 'youtube') {
                  mediaView += `<br><iframe style="width: 200px; height: 160px; position: absolute; right: -325px; top: -10px;" src="${item}"
                  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
                }
              })
              // ==== end ====

              li += `<li style="color: black; margin-top: 70px;background: #fff; padding: 20px; border-radius: 15px; margin-bottom: 40px; list-style-type: none;">
                <div class="questions_container_questions_text">
                  <div>
                    <strong>Question ${i + 1}</strong>
                    <div style="display: flex; gap: 10px;">
                    <span style="align-content: center; font-size: 5px;">&#11044;</span>
                    <p style="font-size: 15px; margin-top: 10px;">${dataQuestion.question}</p>
                    </div>
                    <div>
                      ${mediaView}
                    </div>
                  </div>
                </div>
                <div style="margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr;" class="question_container_question_answers">
                  <div>
                    <strong style="font-size: 20px;">Options</strong>
                    <ul style="list-style-type: ${answersType}; padding: 10px 20px; font-size: 13px;">
              `
              // ==== creating options view ====
              $.each(data[i].question_answers, function(index, item) {
                for (let y = 0; y < item.length; y++) {
                  li +=`<li>${Object.keys(item[y]).toString()}</li>`
                }
              })
              // ==== end ====
              li += `</ul></div>
              <div> <strong style="font-size: 20px;">Correct Options</strong>
              <ul style="list-style-type: ${answersType}; padding: 10px 20px; font-size: 13px;">
              `
              // ==== creating correct answer view ====
              $.each(data[i].correct_answers, function(index, item) {
                for (let y = 0; y < item.length; y++) {
                  li += `<li>${Object.keys(item[y]).toString()}</li>`
                }
              })
              // ==== end ====
              li += `</ul></div></div></li>`


            } else {
              li += `<li style="color: black; margin-top: 70px;background: #fff; padding: 20px; border-radius: 15px; margin-bottom: 40px; list-style-type: none;">
                <div class="questions_container_questions_text">
                  <div>
                    <strong>Question ${i + 1}</strong><br>
                    <p style="font-size: 15px; margin-top: 10px;">${data[i].question_text}</p>
                  </div>
                </div>
                <div style="margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr;" class="question_container_question_answers">
                <div>
                  <strong style="font-size: 20px;">Options</strong>
                  <ul style="list-style-type: ${answersType}; padding: 10px 20px; font-size: 13px;">`
              // ==== creating options view ====
              $.each(data[i].question_answers, function(index, item) {
                for (let y = 0; y < item.length; y++) {
                  li +=`<li>${Object.keys(item[y]).toString()}</li>`
                }
              })
              // ==== end ====
              li += `</ul></div>
              <div> <strong style="font-size: 20px;">Correct Options</strong>
              <ul style="list-style-type: ${answersType}; padding: 10px 20px; font-size: 13px;">
              `
              // ==== creating correct answer view ====
              $.each(data[i].correct_answers, function(index, item) {
                for (let y = 0; y < item.length; y++) {
                  li += `<li>${Object.keys(item[y]).toString()}</li>`
                }
              })
              // ==== end ====
              li += `</ul></div></div></li>`
            }
            $('.go_to_ul').append(li);
          };
          //$('.go_to_questions_container ul').append(data)
          $('.go_to_questions_container').css('background', background);
          $('.go_to_questions_container').css('color', fontColor);
          $('.go_to_questions_container').css('display', 'block');
        };
      },
      error: function (xhr, errmsg, err) {
        console.log(err)
      }
    })
  }

  fetchChunk();
})

