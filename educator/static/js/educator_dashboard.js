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
        });
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
    });

  // get width for information box
  const scrollInformationWidth = $('.scroll_information').width();
  const scollInformationWordWidth = $('.scroll_information_words').width();
  const gapWidth = (scrollInformationWidth - scollInformationWordWidth) / 1.5;
  console.log(scrollInformationWidth, scollInformationWordWidth)
  console.log(gapWidth)
  $('.scroll_information').css('gap',  `${gapWidth}px`);
})
