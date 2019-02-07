$(document).ready(function(){

  // Определение window.location.search

  $.extend({
    getUrlVars: function () {
      var vars = [],
          hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++)
      {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },

    getUrlVar: function (name) {
      return $.getUrlVars()[name];
    }
  });

  // Определение главной страницы

  var isIndexPage = document.querySelector('[data-isindex]');

  // Мобильное меню

  function showMenu(){
    $('.js-open-mob').on('click', function(e){
      e.preventDefault();

      $('.toolbar-bg-1').addClass('active');
      setTimeout(function(){
        $('.toolbar-bg-2').addClass('active');
      }, 200);
      setTimeout(function(){
        $('.toolbar-bg-3').addClass('active');
      }, 400);
      setTimeout(function(){
        $('.right-toolbar').fadeIn(300);
      }, 1000);
    });
    $('.mobile-menu-close').on('click', function(e){
      e.preventDefault();

      $('.right-toolbar').fadeOut(300);
      setTimeout(function(){
        $('.toolbar-bg-3').removeClass('active');
      }, 400);
      setTimeout(function(){
        $('.toolbar-bg-2').removeClass('active');
      }, 600);
      setTimeout(function(){
        $('.toolbar-bg-1').removeClass('active');
      }, 1000);
    });
    $('.mobile-menu-close-2').on('click', function(e){
      $('.right-toolbar').fadeOut(300);
      setTimeout(function(){
        $('.toolbar-bg-3').removeClass('active');
      }, 400);
      setTimeout(function(){
        $('.toolbar-bg-2').removeClass('active');
      }, 600);
      setTimeout(function(){
        $('.toolbar-bg-1').removeClass('active');
      }, 1000);
    });
  }

  // Определение предыдущей страницы

  function referrerLink(){
    if($.cookie('entered_from') != undefined){
      if($.cookie('entered_from').length > 0){
        $('.js-entered-from').each(function(){
          var el = $(this);
          var elAttr = el.attr('href');

          el.attr('href', $.cookie('entered_from') + elAttr);
          el.css('display', 'inline-block');
        });
        $('.js-partner-tickets').each(function(){
        	var el = $(this);
          	var elAttr = el.attr('data-lid-id');
          	el.attr('href', 'https://' + $.cookie('entered_from').replace('https://', '') + '/admin2/tickets_jwt/create_ticket?partner=' + elAttr);
            el.css('display', 'inline-block');
        });
      }
    } else{
      $('.js-partner-tickets').attr('href', 'https://auth.insales.ru/login.ru');
      $('.js-partner-tickets').css('display', 'inline-block');
    }
  }

  // Мобильный фильтр

  function showFilter(){
    $('.js-open-filter').on('click', function(e){
      e.preventDefault();

      $('.js-mob-filter').addClass('active');
    });
    $('.js-mob-filter-close').on('click', function(e){
      e.preventDefault();

      $('.js-mob-filter').removeClass('active');
    });
  }

  window.addEventListener('load',function(){
    if(isIndexPage){

      // Анимированные иконки при наведении

      $('.main-adver-item:nth-child(1) .main-advert-ico').mouseover(function(){
        $('#icon-circle-1').animate({cy:'19'},500).animate({cy:'14'},500);
        $('#icon-circle-2 circle').animate({cy:'14'},500).animate({cy:'8'},500);
        $('#icon-circle-3').animate({cy:'5'},500).animate({cy:'16'},500);
      });

      $('.main-adver-item:nth-child(2) .main-advert-ico').mouseover(function(){
        anime.timeline({
          duration: '750',
        }).add({
          targets: '#svg-icon-arrow',
          scale: ['0','1']
        });
      });

      $('.main-adver-item:nth-child(3) .main-advert-ico').mouseover(function(){
        anime.timeline({
          duration: '750',
        }).add({
          delay: '750',
          targets: '#rect-design',
          scale: ['0','1']
        });
      });

      $('.main-adver-item:nth-child(4) .main-advert-ico').mouseover(function(){
        $('#pathEya').delay(1600).animate({ry:'0'},500).animate({ry:'1.5'},500);
      });
    }

  });

  // Переключатель тарифа год / месяц

  function tarifChange(){
    if($('[name="pay_radio"]:checked').val() == 'pay_month'){
      $('.pseudo-switch').removeClass('pay_year').addClass('pay_month');
      $('[data-tarif="month"]').css('display', 'block');
      $('[data-tarif="year"]').css('display', 'none');
    } else{
      $('.pseudo-switch').removeClass('pay_month').addClass('pay_year');
      $('[data-tarif="month"]').css('display', 'none');
      $('[data-tarif="year"]').css('display', 'block');
    }
  }

  var tarifRadio = $('[name="pay_radio"]');
  var pseudoSwitch = $('.pseudo-switch');

  tarifRadio.each(function(){
    var tarifRadio = $(this);
    tarifChange();
  });
  tarifRadio.change(function(){
    var tarifRadio = $(this);
    tarifChange();
  });
  pseudoSwitch.on('click', function(){
    var checkedVal = $('[name="pay_radio"]:checked').val();

    tarifRadio.each(function(){
      var tarifRadio = $(this);
      if(tarifRadio.attr('value') == checkedVal){
        tarifRadio.prop('checked', false);
      } else{
        tarifRadio.prop('checked', true);
      }
    });

    tarifChange();
  });

  // Аккордеон

  function dropdownSimple(){
    $('.dropdown-title').on('click', function(){
      var dropdownTitle = $(this);
      var dropdownParent = dropdownTitle.parents('.dropdown-point:first');
      var dropdownBody = dropdownParent.find('.dropdown-text');

      if(dropdownParent.hasClass('active')){
        dropdownBody.slideUp(300);

        setTimeout(function(){
          dropdownParent.removeClass('active');
        }, 300);
      } else{
        dropdownBody.slideDown(300);

        setTimeout(function(){
          dropdownParent.addClass('active');
        }, 300);
      }
    });
  }

  // Кружки, линия прогресса в регистрации

  $('.reg-circle').each(function(){
    $(this).html('<div></div><div></div><div></div><div></div>');
  });
  $('.reg-line').each(function(){
    $(this).html('<div class="reg-start"></div><div class="reg-end"></div>');
  });

  // Добавление активного класса кружку

  function addCircleActive(){
    $('.registration-template').each(function(){
      $('.reg-circle').each(function(){
        $(this).removeClass('active');
      });

      var i = $('.registration-template').attr('data-step') * 1;
      $('.reg-step-container:nth-child(' + i + ')')
        .addClass('active').css('opacity', '1')
        .nextAll('.reg-step-container').css('opacity', '0.6');
    });
  }

  // Поиск координаты линии прогресса в регистрации

  function findCoord(){
    $('.reg-step-container.active .reg-circle').each(function(){
      var activeElem = $(this);
      var activeElemWidth = activeElem.width() / 2;
      var posX = activeElem.offset().left + activeElemWidth;
      $('.reg-end').css('left', posX + 'px');
    });
  }

  $('select[name="order"]').change(function(){
    $(this).parents('form:first').submit();
  });

  addCircleActive();
  findCoord();

  // Недавно просмотренные статьи

  $('.doc-recently').each(function(){
    var thisEl = $(this);
    var recentlyLinks = thisEl.find('.recently-links');
    var myRecentlyView = new RecentlyView({
      success: function (_products) {
        if(_products.length > 0){
          for(i = 0; i < _products.length; i++){
            recentlyLinks.append('<li><a href="' + _products[i].url + '">' + _products[i].title + '</a></li>');
          }
          thisEl.css('display', 'block');
        }
      },
      debug: true
    })
  });

  // Появление тултипа на странице тарифов

  $('[rel="tooltip"]').each(function(){
    var elem = $(this);
    var elemTitle = elem.attr('title');
    if(elemTitle != undefined){
    	elem.append('<div class="abbr-tooltip">' + elemTitle + '</div>');
    } else{
    	elem.append('<div class="abbr-tooltip">' + elem.attr('data-title') + '</div>');
    }
  });

  // Тарифы мобильные

  $('.js-drop > .row.flex-middle').each(function(i,item){
    let isOpen = false;
    $(item).on('click',function(e){
      if(isOpen){
        isOpen = false;
        var elParent = $(this).parents('.js-drop:first');
        elParent.find('.js-drop-content').slideUp(500);
        elParent.css('borderLeft','');
        elParent.css('background','');
        elParent.find('.rect-toggler').css('transform','');
      } else{
        isOpen = true;
        var elParent = $(this).parents('.js-drop:first');
        elParent.css('background','#fff');
        elParent.css('borderLeft','5px solid #148bdd');
        elParent.find('.rect-toggler').css('transform','rotate(0)');
        elParent.find('.js-drop-content').slideDown(500);
      }
    });

    if($(item).parent().hasClass('suppliers')){
      if($(item).parent().index() == '0'){
        isOpen = true;
        $(this).parent().css('background','#fff');
        $(this).parent().css('borderLeft','5px solid #148bdd');
        $(this).parent().find('.rect-toggler').css('transform','rotate(0)');
        $(this).parent().find('.js-drop-content').slideDown(500);
      }
    } else{
      if($(item).parent().index() == '1'){
        isOpen = true;
        $(this).parent().css('background','#fff');
        $(this).parent().css('borderLeft','5px solid #148bdd');
        $(this).parent().find('.rect-toggler').css('transform','rotate(0)');
        $(this).parent().find('.js-drop-content').slideDown(500);
      }
    }

  })

  // Фикс шапка

  function fixedHeaderIndizHeight(){
    $('.pseudo-inside-scroll').css('height', $('.js-inside-scroll').innerHeight() + 'px');
  }

  function fixedHeader(){
    var w = $(window).scrollTop();
    if(w > 250){
      $('.header-top').addClass('fixed');
      if($('header').hasClass('mainpage')){
        $('header').find('.bttn-transparent').removeClass('bttn-transparent').addClass('bttn-reg');
      }

      $('.header-pseudo').css({
        'width' : '100%',
        'height' : $('.header-top').innerHeight() + 'px'
      });
    } else{
      $('.header-top').removeClass('fixed');
      if($('header').hasClass('mainpage')){
        $('header').find('.bttn-reg').removeClass('bttn-reg').addClass('bttn-transparent');
      }

      $('.header-pseudo').css({
        'width' : '100%',
        'height' : '0'
      });
    }
  }

  // Фикс шапка для индизов

  function fixedHeaderIndiz(){
    $('.js-inside-scroll').each(function(){
      var w = $(window).scrollTop();
      if(w > 350){
        $('.js-inside-scroll').addClass('fixed');
      } else{
        $('.js-inside-scroll').removeClass('fixed');
      }
    });
  }

  // слайдер с отзывами

  function indexThemeSlider(){
    var themeSlider = new Swiper('.index-theme-slider',{
      direction: 'horizontal',
      slidesPerView: 3,
      loop: false,
      spaceBetween: 30,
      draggable: false,
      followFinger: false,
      navigation: {
        nextEl: '.swiper-button-next.index-slider-arrow',
        prevEl: '.swiper-button-prev.index-slider-arrow',
      },
      breakpoints: {
        1024: {
          slidesPerView: 1,
          spaceBetween: -250,
          centeredSlides: true,
          draggable: true,
          followFinger: true,
          loop: true
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 0,
          centeredSlides: true,
          draggable: true,
          followFinger: true
        },
      }
    });
  }

  // слайдер в карточке приложения

  function appsSlider(){
    window.addEventListener('load',function(){
      let isAppPage = document.querySelector('.js-app');
      if(isAppPage){


        var appsSliderTop = new Swiper('.apps-slider-top', {
          slidesPerView: 1,
          spaceBetween: 30,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
        var appsSliderThumb = new Swiper('.app-slider-thumb', {
          slidesPerView: 3,
          spaceBetween: 10,
          centeredSlides: true,
          touchRatio: 0.2,
          slideToClickedSlide: true
        });

        appsSliderTop.controller.control = appsSliderThumb;
        appsSliderThumb.controller.control = appsSliderTop;
      }
    })
  }


  // слайдер в карточке отзыва

  function reviewSlider(){
    var reviewSlider = new Swiper('.js-reviews-slider', {
      direction: 'horizontal',
      loop: false,
      autoHeight: false,
      navigation: {
        nextEl: '.review-slider-btn.swiper-button-next',
        prevEl: '.review-slider-btn.swiper-button-prev',
      }
    });
  }

  // слайдер университет на главной

  function indexUniversitetSlider(){
    var videoSlider = new Swiper('.index-universitet-slider', {
      direction: 'horizontal',
      slidesPerView: 3,
      loop: true,
      spaceBetween: 30,
      draggable: true,
      followFinger: true,
      navigation: {
      nextEl: '.index-theme-slider-next',
      prevEl: '.index-theme-slider-prev',
      },
      breakpoints: {
        1024: {
          slidesPerView: 1,
          initialSlide: 1,
          spaceBetween: -250,
          centeredSlides: true,
          draggable: true,
          followFinger: true
        },
        768: {
          slidesPerView: 1,
          initialSlide: 1,
          spaceBetween: 0,
          centeredSlides: true,
          draggable: true,
          followFinger: true
        },
      }
    });
  }

  // слайдер в карточке темы

  function themeSlider(){
    var productSlider = new Swiper('.js-product-slider-container',{
      autoHeight: true,
      slidesPerView: 1,
      initialSlide: 1,
      spaceBetween: 0,
      navigation: {
        nextEl: '.product-slider-arrow-next',
        prevEl: '.product-slider-arrow-prev',
      }
    });
  }

  // 0-450000

  function rangeCount(){
    (function(){
      let scrollWindow = document.documentElement.scrollTop || window.pageYOffset;
      let startPoint = document.querySelector('.index-reviews-wrapper').getBoundingClientRect().top + scrollWindow - document.documentElement.clientHeight / 1.2
      let breakPoint = 0;
      let counters = {
        counter1: '0',
        counter2: '0',
        counter3: '0',
      }

      window.addEventListener('scroll',function(e){
        let scrolled = document.documentElement.scrollTop || window.pageYOffset;
        if (scrolled >= startPoint && breakPoint < 1) {
          breakPoint++;
          anime({
            targets: counters,
            counter1: '7000+',
            counter2: '450000+',
            counter3: '3 млрд +',
            easing: 'easeInOutExpo',
            round: 1,
            duration: '1500',
       update: function() {
         let counter = document.querySelectorAll('.index-counter');
         counter[0].innerHTML = counters.counter1;
         counter[1].innerHTML = counters.counter2;
         counter[2].innerHTML = counters.counter3;
       }
          })
        }
      });

    })();
  }

  // Ленивая загрузка картинкок data-lazy-load="img src"

  function lazyLoadImage(){
    $('[data-lazy-load]').each(function(){
      var elem = $(this);
      var w = $(window).scrollTop();
      var h = $(window).height();
      var z = elem.offset().top;
      var startLoadImg = w + h + 500;

      if(startLoadImg >= z){
        var elemSrc = elem.attr('data-lazy-load');

        if(elem.is('img')){
          elem.attr('src', elemSrc);
        } else{
          elem.attr('style', elemSrc);
        }
        elem.removeAttr('data-lazy-load');
      }

    });
  }

  // Ресайз главного bg

  function resizeMainBg(){
    var elem = $('.js-resizemain');
    var h = elem.height() * 1;
    var t = elem.offset().top * 1;

    var result = t + (h * 0.75) + 'px';
    $('.index-header-bg').css('height', result);
  }

  // Запуск и остановка прелоадера при фильтрации

  function preloadStart(){
    $('body').addClass('ajax-filter-load')
  }
  function preloadEnd(){
    $('body').removeClass('ajax-filter-load');
    $('.js-mob-filter').removeClass('active');
  }

  function sendFilterForm(checkbox){
    var elForm = checkbox.parents('form:first');
    var ajaxContainer = $('[data-ajax]');

    $.ajax({
      type: 'GET',
      url: elForm.attr('action'),
      dataType: 'html',
      data: elForm.serialize(),
      beforeSend: function(){
        preloadStart();
      },
      success: function(result){
        console.log(result);

        var allProducts = $(result).find('[data-ajax]').html();
        var allPaginate = $(result).find('.pagination').html();
        $('[data-ajax]').html(allProducts);
        $('.pagination').html(allPaginate);

        var redUrl = elForm.serialize();
        window.history.pushState('object or string', 'Title', '?' + redUrl);

        lazyLoadImage();
        preloadEnd();
      }
    });
  }

  $('.price-filter-point').on('click', function(e){
    e.preventDefault();

    $(this).parent().find('.active').removeClass('active').find('input').each(function(){
      var elem = $(this);
      elem.attr('disabled', 'disabled').prop('checked', false);
    });
    $(this).addClass('active');

    var checkItem = $(this).find('input');
    checkItem.each(function(){
      var elem = $(this);
      elem.removeAttr('disabled').prop('checked', true);
    });
    sendFilterForm($(this).find('input:last-child'));
  });

  $('[data-check]').on('change', function(){
    var elem = $(this);
    sendFilterForm(elem);
  });

  // Преобразовываем страницу faq

  $('.js-faq-parcing').each(function(){
    var elem = $(this);
    var elemTitle = elem.find('h2');
    elemTitle.after('<div class="dropdown-text"></div>');
    var elemText = elem.find('.dropdown-text');

    elemText.each(function(){
      var elemText = $(this);
      var nextAll = $(this).nextAll();

      nextAll.each(function(){
        var thisEl = $(this);

        if(thisEl.is('h2')){
          return false;
        } else{
          thisEl.appendTo(elemText);
        }
      });
    });

    elemTitle.each(function(){
      var thisHtml = $(this).html();
      var titleTemplate  = '<div class="dropdown-title">';
            titleTemplate += '<span>' + thisHtml + '</span>';
            titleTemplate += '<div class="dropdown-open">';
              titleTemplate += '<span class="js-dropdown-plus"></span>';
              titleTemplate += '<span class="js-dropdown-minus"></span>';
            titleTemplate += '</div>';
          titleTemplate += '</div>';

      $(this).after(titleTemplate);
      $(this).remove();
    });

    $('.dropdown-title').each(function(){
      var elem = $(this);
      var nextEl = $(this).next('.dropdown-text');

      elem.wrap('<div class="dropdown-point"></div>');
      nextEl.appendTo(nextEl.prev('.dropdown-point'));
    });

    $('.js-dropdown-minus').each(function(){
      $(this).html($('.js-insert-minus').html());
    });
    $('.js-dropdown-plus').each(function(){
      $(this).html($('.js-insert-plus').html());
    });

    // $('.dropdown-point:first-child').addClass('active');
    $('.js-faq-parcing').removeClass('js-faq-parcing');
    dropdownSimple();
  });

  // Полезная статья?

  function usefulArticle(){
    var parentContainer = $('.useful-article');
    var usefulLabel = parentContainer.find('.useful-stars label');
    var usefulStar = usefulLabel.find('input');

    usefulStar.change(function(){
      var elem = $(this);
      elem.parents('.useful-stars:first').find('label').each(function(){
        $(this).removeClass('checked');
      });
      elem.parents('label:first').addClass('checked');
    });

    let $textarea = $('.useful-textarea');
    let $text = $('.useful-textarea textarea');
    let star = 0;

    $('.useful-stars input').on('click',function(){
      let tagTmp = $('.useful-stars input:checked').val();
      if(tagTmp > -1 && tagTmp < 5 ){
        $text.attr('placeholder','Что мы можем исправить?');
      } else
      if(tagTmp == 5){
        $text.attr('placeholder','Мы стараемся для Вас');
      }
      star = tagTmp;
      $textarea.slideDown(400);
    });

    $('.useful-button button').on('click',function(e){
      e.preventDefault();
      if(star){
        $.post('/client_account/feedback.json', {
          feedback: {
            from: 'from@mail.ru',
            name: 'Оценка статьи',
            phone: '+7 (111) 111 11 11',
            subject: 'Оценка полезности статьи',
            content: 'Ссылка статьи: <a href="' + document.location.href + '">' + $('title').html() + '</a><br>Сообщение: ' + $text.val() + '<br>Оценка статьи: ' + star + ''
          }
        }).done(function (done) {
          $('.useful-article').slideUp(400);
          $('.useful-article').parent().append('<div class="succes-review-tag succes-review-tag bg-grad-2 p-t-20 p-r-20 p-b-20 p-l-20 text-center c-fff">Спасибо за Ваш отзыв!</div>');
        });
      }
    })
  }

  // определение города для телефона

  function phoneCity(){
    $.ajax({
      url: 'https://kladr.insales.ru/current_location.json',
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data.region == 'Москва') {
          $('.js-locale').html('+7 (495) 649-83-14').attr('href', 'tel:+74956498314');
          $('.js-locale-2').attr('href', 'tel:+74956498314');
        }
      }
    });
  }

  // Удалить bg-color с главного экрана

  function removeMainBg(){
    $('.index-header-bg').removeClass('not-ready');
  }

  // Инициализация портфолио

  $('[data-fancybox="portfolio-design"]').fancybox({
    clickContent: 'close',
    scrolling: 'yes'
  });

  // Инициализация мобильного меню

  $('[data-fancybox="mobile-filter"]').fancybox({
    scrolling: 'yes',
    centerOnScroll: true
  });

  // Инициализация табов

  $(".js-tabs").dataTabs({
    state: "tab",
    event: "click",
    activeIndex: 1,
    speedSwitching: 5000,
    useToggle: false,
    autoSwitching: false,
    hideOnClosest: false,
    hideOnMouseout: false,
    prevent: true,
    debug: false,
    useHash: true,
    useJqMethods: true,
    loop: false,
    initOpenTab: true,
    pauseVideoAudio: true,
    mouseoutTimeOut: false,
    jqMethodOpenSpeed: 300,
    jqMethodOpen: "fadeIn",
    jqMethodCloseSpeed: 0,
    jqMethodClose: "hide",
    onInit: function() {},
    onTab: function() {},
    onMouseover: function() {},
    onMouseout: function() {}
  });

  // Ссылка на следующий отзыв

  $('.js-next-case').each(function(){
    var el = $(this);
    var elId = el.attr('data-product-id');

    $.post('/collection/cases.json', {

    }).done(function (products) {
      for(i = 0; i < products.count; i++){
        if(i == (products.count - 1)){
          el.remove();
        } else{
          if(products.products[i].id == elId){
            el.attr('href', products.products[i + 1].url).css('display', 'inline');
          }
        }
      }
    });

  });

  // Автоотправка форм на сервер

  $('.js-registration-form.autosend').each(function(){
    submitForm($(this));
  });
  $('.js-registration-partner-form.autosend').each(function(){
    submitForm($(this));
  })

  // Генерация пароля

  function PasGen(){
    var chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var lengths = 8;
    var res="";
    var r;
    var i;
    for (i=1;i<=lengths;i++)
    {
      r=Math.floor(Math.random()*chars.length);
      res=res+chars.substring(r,r+1);
    }
    res = res.replace("&","&amp;");
    res = res.replace(">","&gt;");
    res = res.replace("<","&lt;");
    return res;
  }

  function submitForm(form){

    // Регистрация редирект
    if(form.hasClass('js-registration-redirect')){
        var elMail = form.find('[type="email"]').val();
      var options = {
        path: '/',
        expires: null
      };

      $.cookie('user_email', elMail, options);

      if($.getUrlVar('plan') != undefined){
        var formAction = form.attr('action');
        form.attr('action', formAction + '?plan=' + $.getUrlVar('plan'));
      }

      if($.getUrlVar('remote_theme_id') != undefined){
      	var formAction = form.attr('action');
        form.attr('action', formAction + '?remote_theme_id=' + $.getUrlVar('remote_theme_id'));
      }

      location.href = form.attr('action');
    } else

    // Регистрация партнера редирект
    if(form.hasClass('js-partnership-redirect')){
      var elMail = form.find('[type="email"]').val();
      var elSelect = form.find('select').val();
      var options = {
        path: '/',
        expires: null
      };

      $.cookie('user_email', elMail, options);
      $.cookie('user_partner', elSelect, options);

      var formAction = form.attr('action');
      var formAction = form.attr('action');

      location.href = formAction + '?program=' + elSelect;
    } else

    // Форма регистрации
    if(form.hasClass('js-registration-form')){

      if($.getUrlVar('plan') != undefined){
        form.find('[name="account[plan_handle]"]').each(function(){
          $(this).attr('value', $.getUrlVar('plan')).val($.getUrlVar('plan'));
        });
      }

      if($.getUrlVar('remote_theme_id') != undefined){
      	form.find('[name="account[remote_theme_id]"]').each(function(){
          $(this).attr('value', $.getUrlVar('remote_theme_id')).val($.getUrlVar('remote_theme_id'));
        });
      }

      var pass = PasGen();
      var randomLine = String(new Date().getTime());
      var resultLine = hex_md5(randomLine);

      $('input[name="account[key1]"]').each(function(){
        $(this).attr('value', randomLine).val(randomLine);
      });
      $('input[name="account[key2]"]').each(function(){
        $(this).attr('value', resultLine).val(resultLine);
      });
      $('input[name="user[email]"]').each(function(){
        $(this).attr('value', $.cookie('user_email')).val($.cookie('user_email'));
      });
      $('input[name="user[password]"]').each(function(){
        $(this).attr('value', pass).val(pass);
      })

      var fields = form.serialize();
      if ($.cookie('referer')) fields += "&referer=" + escape($.cookie('referer'));
      if ($.cookie('visited_at')) fields += "&visited_at=" + $.cookie('visited_at');
      if ($.cookie('current_location')) fields += "&current_location=" + escape($.cookie('current_location'));
      if ($.cookie('first_current_location')) fields += "&first_current_location=" + escape($.cookie('first_current_location'));
      if ($.cookie('first_referer')) fields += "&first_referer=" + escape($.cookie('first_referer'));
      if ($.cookie('secret_key')) fields += "&secret_key=" + $.cookie('secret_key');

      $.ajax({
        type: 'POST',
        url: form.attr('action') + '.json',
        data: fields,
        dataType: 'jsonp',

        success: function(result){
          console.log(result);
          if(result.status == 'ok'){
            var options = {
              path: '/',
              expires: null
            };
            $.cookie('host', result.host, options);
            $.cookie('salt', result.salt, options);
            $.cookie('account_id', result.account_id, options);

            $("#autologin").attr('action', 'https://auth.insales.ru/login?auth_domain=' + result.subdomain);
            $('#autologin').find('[name="salt"]').attr('value', result.salt).val(result.salt);

            autologin();
          }
        }
      });

    } else

    // Форма регистрации партнера
    if(form.hasClass('js-registration-partner-form')){

      if($.getUrlVar('program') != undefined){
        form.find('[name="account[program_type_id]"]').each(function(){
          $(this).attr('value', $.getUrlVar('program')).val($.getUrlVar('program'));
        });
      }

      var pass = PasGen();
      var randomLine = String(new Date().getTime());
      var resultLine = hex_md5(randomLine);

      $('input[name="account[key1]"]').each(function(){
        $(this).attr('value', randomLine).val(randomLine);
      });
      $('input[name="account[key2]"]').each(function(){
        $(this).attr('value', resultLine).val(resultLine);
      });
      $('input[name="user[email]"]').each(function(){
        $(this).attr('value', $.cookie('user_email')).val($.cookie('user_email'));
      });
      $('input[name="user[password]"]').each(function(){
        $(this).attr('value', pass).val(pass);
      })

      var fields = form.serialize();
      if ($.cookie('referer')) fields += "&referer=" + escape($.cookie('referer'));
      if ($.cookie('visited_at')) fields += "&visited_at=" + $.cookie('visited_at');
      if ($.cookie('current_location')) fields += "&current_location=" + escape($.cookie('current_location'));
      if ($.cookie('first_current_location')) fields += "&first_current_location=" + escape($.cookie('first_current_location'));
      if ($.cookie('first_referer')) fields += "&first_referer=" + escape($.cookie('first_referer'));
      if ($.cookie('secret_key')) fields += "&secret_key=" + $.cookie('secret_key');

      $.ajax({
        type: 'POST',
        url: form.attr('action') + '.json',
        data: fields,
        dataType: 'jsonp',

        success: function(result){
          console.log(result);
          if(result.status == 'ok'){
            var options = {
              path: '/',
              expires: null
            };
            $.cookie('host', result.host, options);
            $.cookie('salt', result.salt, options);
            $.cookie('account_id', result.account_id, options);

            var resHost = result.host.replace('.myinsales.ru', '');
            $("#autologin").attr('action', 'https://auth.insales.ru/login?auth_domain=' + resHost);
            $('#autologin').find('[name="salt"]').attr('value', result.salt).val(result.salt);

            autologin();
          }
        }
      });

    }

    // Заявки из форм
    if(form.hasClass('js-feedback-form')){
      form.find('[name="feedback[from]"]').addClass('has-name');
      form.find('[name="feedback[name]"]').addClass('has-name');
      form.find('[name="feedback[phone]"]').addClass('has-name');
      form.find('[name="feedback[subject]"]').addClass('has-name');

      var inputFrom = form.find('[name="feedback[from]"]').val();
      var inputName = form.find('[name="feedback[name]"]').val();
      var inputPhone = form.find('[name="feedback[phone]"]').val();
      var inputSubject = form.find('[name="feedback[subject]"]').val();

      if(inputFrom == undefined){ var inputFrom = ''; }
      if(inputName == undefined){ var inputName = ''; }
      if(inputPhone == undefined){ var inputPhone = ''; }
      if(inputSubject == undefined){ var inputSubject = ''; }

      var tableStyles = 'cellpadding="0" cellspacing="0" style="width: 100%; border-left: 1px solid #bdbdbd; border-right: 1px solid #bdbdbd; border-bottom: 1px solid #bdbdbd; font-size: 12px;"';
      var td1Styles = 'style="border-top: 1px solid #bdbdbd; border-right: 1px solid #bdbdbd; padding: 5px; width: 30%;"';
      var td2Styles = 'style="border-top: 1px solid #bdbdbd; padding: 5px;"';

      var inputContent = '<table ' + tableStyles + '>';

      form.find('input, textarea, select').each(function(){
        var elem = $(this);

        if(elem.hasClass('has-name')){

        } else{
          var elemPlaceholder = elem.attr('placeholder');
          var elemValue = elem.val();

          inputContent += '<tr>';
            inputContent += '<td ' + td1Styles + '>' + elemPlaceholder + ':</td>';
            inputContent += '<td ' + td2Styles + '>' + elemValue + '</td>';
          inputContent += '</tr>';
        }
      });
      inputContent += '<tr>';
        inputContent += '<td ' + td1Styles + '>Отправлено со страницы:</td>';
        inputContent += '<td ' + td2Styles + '><a href="' + window.location.href + '">' + $('title').html(); + '</a></td>';
      inputContent += '</tr>';

      inputContent += '</table>';

      $.post('/client_account/feedback.json', {
        feedback: {
          from: inputFrom,
          name: inputName,
          phone: inputPhone,
          subject: inputSubject,
          content: inputContent
        }
      }).done(function (done) {

        if(done.status == 'ok'){
          var modalThanks = '<div class="message modal-thanks text-center">';
               modalThanks += '<div class="m-b-20">';
                 modalThanks += '<div class="thanks-check-outer circle">'
                   modalThanks += '<div class="thanks-check-inner bg-color-fff circle">';
                     modalThanks += '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 13 10"><defs><path id="fr3ta" d="M343.68 592l-5.94 6.09-2.79-2.64-1.95 1.96 4.74 4.59 7.9-8.05z"/></defs><g><g transform="translate(-333 -592)"><use fill="#6d10a8" xlink:href="#fr3ta"/></g></g></svg>';
                   modalThanks += '</div>';
                 modalThanks += '</div>';
               modalThanks += '</div>';
               modalThanks += '<div class="h2-like m-b-15">Заявка принята</div>';
               modalThanks += '<div class="m-b-25">Спасибо за обращение в компанию InSales!<br>';
                modalThanks += 'В ближайшее время с Вами свяжется менеджер по работе с клиентами&nbsp;<br>';
                modalThanks += '(в рабочее время)';
               modalThanks += '</div>';
               modalThanks += '<button class="bttn-reg" data-fancybox-close title="Закрыть">Закрыть</button>';
             modalThanks += '</div>';

          $.fancybox.close('#indiz-start');
          $.fancybox.open(modalThanks);

        } else
        if(done.status == 'error'){
          alert(done.status);
        }
      });

      if(form.hasClass('js-send-idbi-crm')){
        var inputFrom = form.find('[name="feedback[from]"]').val();
        var inputName = form.find('[name="feedback[name]"]').val();
        var inputPhone = form.find('[name="feedback[phone]"]').val();
        var inputNeed = form.find('.js-subject').val();
		var tarif = form.find('[data-naming]').text();
        var fromUrl = form.find('.js-url').val();
        var fromSite = 'insales';

        $.post('https://letidbi.ru/lid_in.php', {
          client_name: inputName,
          client_phone: inputPhone,
          client_email: inputFrom,
          client_need: inputNeed,
          from_site: fromSite,
          from_form: tarif,
          client_site: fromUrl
        })
      }

    } else

    // Отзывы
    if(form.hasClass('js-review-form')){
      $.ajax({
        type: 'POST',
        url: form.attr('action') + '.json',
        data: form.serialize(),

        success: function(result){
          if(result.status == 'ok'){
            form.slideUp(300);
            form.after('<div class="p-like p-t-10 p-b-10 p-l-20 p-r-20 c-fff bg-grad-1 text-center">Спасибо за отзыв! В скором времени мы его опубликуем.</div>');
          } else{
            form.find('.error-text').html('Введите правильный код с картинки!');
          }
        }
      });
    } else
    if(form.hasClass('js-login-form')){
      var formSubdomain = form.find('[name="subdomain"]').val();
      form.attr('action', 'https://auth.insales.ru/login?auth_domain=' + formSubdomain);
      form.submit();
    }

  }

  // Валидация форм
  $(document).on('submit', '.js-validate-form', function(){
    var form = $(this);
    var re = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,7}$/i;

    var inputReqContainer = form.find('.required')

    var inputMailContainer = form.find('.required-mail');
    var inputMail = inputMailContainer.find('input');
    var inputMailVal = inputMail.val();

    var errorText = form.find('.error-text');
    var errors = false;

    if(inputMailContainer.length > 0){
      if(!re.test(eval('inputMailVal'))){
        errorText.html('Введите корректный e-mail');
        inputMailContainer.addClass('input-error').find('.error-warning').remove();
        inputMailContainer.append('<div class="error-warning">!</div>');

        errors = true;
      }
    }

    inputReqContainer.each(function(){
      var elem = $(this);

      var inputReq = elem.find('[name]');
      var inputReqVal = inputReq.val();

      if(inputReqVal.length == 0){
        elem.addClass('input-error').find('.error-warning').remove();
        elem.append('<div class="error-warning">!</div>');
        errors = true;

        if(inputReqContainer.hasClass('domain')){
          errorText.html('Пожалуйста введите имя магазина. Примечание: без ".myinsales.ru"');
        }
      }
    });

    if(errors == true) return false;

    submitForm($(this));

    return false
  });

  $(document).on('focus keyup', '.input-error input, .input-error textarea', function(){
    var elemInput = $(this);
    var elemParent = elemInput.parent();
    elemParent.removeClass('input-error').find('.error-warning').remove();
    if(elemParent.hasClass('required-mail') || elemParent.hasClass('domain')){
      elemParent.parents('form:first').find('.error-text').html('');
    }
  });

  // Забыли пароль? в форме логина
  $('.js-forgot-pass').on('click', function(e){
    e.preventDefault();
    var elForm = $(this).parents('form:first');
    if(elForm.find('.required.domain').find('input').val().length > 0){
      location.href='http://' + elForm.find('[name="subdomain"]').val() + '.myinsales.ru/admin/password/forgot';
    } else{
      elForm.find('.required.domain').addClass('input-error').append('<div class="error-warning">!</div>');
      elForm.find('.error-text').html('Пожалуйста введите имя магазина. Примечание: без ".myinsales.ru"');
    }
  });

  // Плавный якорь
  $('.js-scroll-to').on('click', function(e){
      e.preventDefault();
      var elementClick = $(this).attr('href');
      var destination = $(elementClick).offset().top - 100;
      $('html:not(:animated),body:not(:animated)').animate({
        scrollTop: destination
      }, 800);
  });

  // Плавный якорь при загрузке страницы
  function searchScroll(){
  var winHash = window.location.hash;
  if(winHash.length > 0){
      var destination = $(winHash).offset().top - 100;
      $('html:not(:animated),body:not(:animated)').animate({
        scrollTop: destination
      }, 800);
    }
  }

  $(function () {

    //если пришли с контекстной рекламы, обнулять secret_key (параметр партнерской программы)
    var contextReferer = false;

    //1. Если хост заканчивается на yandex.ru или ".google.*"
    if (document.referrer) {
      var refUrl = document.referrer;
      console.log(refUrl);
      var urlParts = /^(?:\w+\:\/\/)?([^\/]+)(.*)$/.exec(refUrl);
      var hostname = urlParts[1];
      if (hostname.indexOf('yandex.ru') != -1 || hostname.indexOf('.google.') != -1) {
        contextReferer = true;
      }
      //если mail.ru и есть параметр redir
      if (hostname.indexOf('mail.ru') != -1 && refUrl.indexOf('redir') != -1) {
          contextReferer = true;
      }
    }

    //2. Есть парметр utm_source и его значение начинается на yandex
    if ($.getUrlVar('utm_source') && $.getUrlVar('utm_source').indexOf('yandex') == 0 ) {
      contextReferer = true;
    }

    //3. Есть параметры gclid или yclid
    if ($.getUrlVar('yclid') || $.getUrlVar('gclid')) {
      contextReferer = true;
    }

    var options = {
      path: '/',
      expires: 2629746000
    };

    if (contextReferer == false) {
      if ($.getUrlVar('secret_key') || $.getUrlVar('aff')) {
        $.cookie('secret_key', $.getUrlVar('secret_key') || $.getUrlVar('aff'), options);
      }
    }


    console.log($.cookie('secret_key'));

    if (contextReferer == true) {
      $.cookie('secret_key', null, {path: '/'});
    }

    var d = new Date();
    $.cookie('visited_at', d.toUTCString(), options);
    $.cookie('referer', document.referrer, options);
    $.cookie('current_location', document.URL, options);

  });

  // Пробрасывание тарифа в заявку
  function dataIndiz(){
    $('[data-indiz]').on('click', function(){
      var indizTarif = $(this).attr('data-indiz');
      $('[data-naming]').html('Пакет "' + indizTarif + '"');

      var newInput = '<div class="new-input" style="display: none;"><input type="text" placeholder="Пакет разработки" value="' + indizTarif + '" /></div>';
      $('[data-naming]').parents('form:first').find('.new-input').remove();
      $('[data-naming]').parents('form:first').append(newInput);
    });
  }

  // Попап регистрации

  function registerPopup(){
    function openRegisterPopup(){
      $('.register-modal').each(function(){
        $('.register-bg').fadeIn(300);
        $('.register-modal').fadeIn(300);
      });
    }
    function closeRegisterPopup(e){
      e.preventDefault();
      $('.register-bg').fadeOut(300);
      $('.register-modal').fadeOut(300);
    }

    $('.register-bg').on('click', function(e){
      closeRegisterPopup(e);
    });
    $('.register-modal-close').on('click', function(e){
      closeRegisterPopup(e);
      if($(this).hasClass('clear-cookie')){
        var options = {
          path: '/',
          expires: 30
        };
        $.cookie('first_visit_reg', 'true', options );
      }
    });

    if($.cookie('first_visit_reg') == undefined){
      setTimeout(function(){
        openRegisterPopup();
      }, 10000);

      var options = {
        path: '/',
        expires: 1
      };
      $.cookie('first_visit_reg', 'true', options);
    }
  }

  function pseudoIframe(){
    $('.js-videoframe').each(function(){
      var thisEl = $(this);
      var dataSrc = thisEl.attr('data-src');

      var dataSrcArr = dataSrc.split('/');

      for(i = 0; i < dataSrcArr.length; i++){
        if(i == (dataSrcArr.length - 1)){
          var dataSrc = dataSrcArr[i].split('?')[0];
          console.log(dataSrc);

          var finalVideo = '<div class="iframe-video" data-src="' + dataSrc + '">';
                finalVideo += '<a class="video__link" href="https://youtu.be/' + dataSrc + '">';
                  finalVideo += '<img class="video__media" src="https://i.ytimg.com/vi/' + dataSrc + '/maxresdefault.jpg">';
                finalVideo += '</a>';
                finalVideo += '<button class="video__button" type="button" aria-label="Запустить видео">';
                  finalVideo += '<svg width="68" height="48" viewBox="0 0 68 48"><path class="video__button-shape" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path class="video__button-icon" d="M 45,24 27,14 27,34"></path></svg>';
                finalVideo += '</button>';
              finalVideo += '</div>';

          thisEl.after(finalVideo);
        }
      }
    });

    $('.iframe-video a, .iframe-video button').on('click', function(e){
      e.preventDefault();

      var thisEl = $(this);
      var dataParent = thisEl.parents('.iframe-video:first');
      var dataSrc = dataParent.attr('data-src');

      var allUrl = 'https://www.youtube.com/embed/' + dataSrc + '?rel=0&showinfo=0&autoplay=1';
      dataParent.append('<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="' + allUrl + '"></iframe>');
      dataParent.find('a').remove();
      dataParent.find('button').remove();
    });
  }

  lazyLoadImage();
  fixedHeader();
  fixedHeaderIndizHeight();
  fixedHeaderIndiz();
  themeSlider();
  appsSlider();
  dropdownSimple();
  usefulArticle();
  phoneCity();
  showMenu();
  showFilter();
  referrerLink();
  searchScroll();
  dataIndiz();
  registerPopup();
  pseudoIframe();

  // formsSubmit();

  // Если только главная страница

  if(isIndexPage){
    indexThemeSlider();
    indexUniversitetSlider();
    reviewSlider();
    rangeCount();
  }

  // Разные функции, требующие ресайза и скролла страницы.

  $(window).resize(function(){
    addCircleActive();
    findCoord();
  });

  $(window).scroll(function(){
    fixedHeader();
    fixedHeaderIndiz();
    lazyLoadImage();
  });

  $(window).load(function(){
    removeMainBg();
  });

});
