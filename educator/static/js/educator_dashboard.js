$(document).ready(function() {
    'use strict';

    // error message temporary view
    if ($('.success_notification').length) {
        setTimeout(function () {
          $('.success_notification').slideUp();
        }, 2000);
    };
    $('.exam-box .active_exam').css('width', '100%');

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
    $('.right').css('margin-left', '14%');
    $('.first_ul a').css('display', 'block');
    $('.second_ul a').css('display', 'block');
    $(this).replaceWith(closeBUtton);
  });

  $(document).on('click', '.close-button', function () {
    const menuBUtton = $('<button class="menu-button">&#9776;</button>');
    $('.right').css('margin-left', '5%');
    $('.first_ul a').css('display', 'none');
    $('.second_ul a').css('display', 'none');
    $(this).replaceWith(menuBUtton);
  });
})
