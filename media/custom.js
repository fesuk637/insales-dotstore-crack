
function declOfNum(number,titles){number=parseInt(number);titles=(titles)?titles:['товар','товара','товаров'];cases=[2,0,1,1,1,2];return titles[(number%100>4&&number%100<20)?2:cases[(number%10<5)?number%10:5]]}

function templateLodashRender(content, templateId){
	var templateContent = $('[data-template-id="'+templateId+'"]').html();
	var renderContent = _.template(templateContent);
	return renderContent(content);
}

$(function(){
	$.fancybox.defaults.backFocus = false;

	$('.js-clone').each(function(){
		var $this = $(this);
		var $thisTarget = $('.'+$this.data('clone-target'));
		$thisTarget.html($this.html());
	});

	/*phone masks*/
	var maskInput = $('input[type="tel"]:not(.js-input-field)');
	var maskMasks = {
		RU: 'Z0 (000) 000-00-00',
		UA: 'Z00 (000) 000-00-00'
	};
	var maskOptions = {
		clearIfNotMatch: true,
		translation: {
			'Z': {
				pattern: /[+]/,
				optional: true
			}
		},
		onKeyPress: function(cep, e, field, options) {
			mask = maskMasks.RU;
			if(cep.indexOf('3') == 0 || cep.indexOf('+3') == 0){
				mask = maskMasks.UA;
			}
			maskInput.mask(mask, maskOptions);
		}
	};
	maskInput.mask(maskMasks.RU, maskOptions);
	/*---*/

	//корзина
	EventBus.subscribe('update_items:insales:cart', function(data){
		if(data.items_count > 0){
			$('.js-user_icons-icon-cart').addClass('is-active');
			$('.js-popup-cart').html('<div class="dropdown_products-header">В вашей корзине<br><span>'+data.items_count+' '+declOfNum(data.items_count)+'</span> на сумму <span>'+Shop.money.format(data.items_price)+'</span></div><div class="dropdown_products js-popup-cart-products"></div><div class="dropdown_products-action"><div class="row"><div class="col-12 col-lg-6"><a href="/cart_items" class="button button--primary button--block button--small">Открыть корзину</a></div><div class="col-12 col-lg-6"><a href="/new_order" class="button button--secondary button--block button--small">Оформить заказ</a></div></div></div>');
			$('.js-popup-cart-products').html(templateLodashRender(data, 'popup-cart'));
			if(Site.template == 'cart'){
				$('.js-cart-order-total_price').html(Shop.money.format(data.total_price));
				if(data.discounts.length > 0){
					$('.js-cart-order-item-discounts').show();
					$('.js-cart-order-item-discounts-amount').html(Shop.money.format(data.discounts[0].amount));
					$('.js-cart-order-item-discounts-description').html(data.discounts[0].description);
				}else{
					$('.js-cart-order-item-discounts').hide();
				}
				$.each(data.order_lines, function(index, item){
					$parent = $('.js-cart-item-'+item.id);
					$('.js-cart-item-quantity', $parent).html(item.quantity);
					$('.js-cart-item-sale_price', $parent).html(Shop.money.format(item.sale_price));
					$('.js-cart-item-total_price', $parent).html(Shop.money.format(item.total_price));
				});
			}
		}else{
			$('.js-user_icons-icon-cart').removeClass('is-active');
			$('.js-popup-cart').html(templateLodashRender({popup: {title: 'В вашей корзине пока пусто', icon: '<i class="far fa-shopping-cart fa-3x"></i>'}}, 'popup-empty'));
			if(Site.template == 'cart'){
				$('#insales-section-cart').html(templateLodashRender({popup: {title: 'В вашей корзине пока пусто', icon: '<i class="far fa-shopping-cart fa-3x"></i>'}}, 'popup-empty'));
			}
		}
		$('.js-bage-cart').html(data.items_count);
	});
	EventBus.subscribe('add_items:insales:cart', function(data){
		$.each(data.action.items, function(index, item){
        	item_id = index;
        	item_quantity = item;
        });
        $.each(data.order_lines, function(index, item){
        	if(item_id == item.id){
				$.fancybox.close();
				$.fancybox.open({
					src: '<div class="message message--cart"><div class="message-title">Товар добавлен в корзину!</div><div class="message-content">'+templateLodashRender({data: data, item: item, item_quantity: item_quantity}, 'message-cart')+'</div></div>',
					type: 'inline',
					touch: false,
					backFocus: false,
					smallBtn: true
				});
				return false;
            }
        });
	});
	EventBus.subscribe('delete_items:insales:cart', function(data){
		$.each(data.action.items, function(index, item){
			$('[data-item-id="'+item+'"]').remove();
		});
	});
	EventBus.subscribe('before:insales:cart', function (data) {
		if(data.action.method != undefined && data.action.method == 'delete_items'){
			$.each(data.action.items, function(index, item){
				$('[data-item-id="'+item+'"]').addClass('in-progress');
			});
		};
	});

	//сравнение
	EventBus.subscribe('update_items:insales:compares', function(data){
		$('[data-compare-add]').removeClass('is-added');
		if(data.products.length > 0){
			$('.js-user_icons-icon-compares').addClass('is-active');
			$('.js-popup-compares').html('<div class="dropdown_products js-popup-compares-products"></div><div class="dropdown_products-action"><div class="row"><div class="col-12"><a href="/compares" class="button button--primary button--block button--small">Перейти к сравнению</a></div></div></div>');
			$('.js-popup-compares-products').html(templateLodashRender(data, 'popup-compares'));
			$.each(data.products, function(index, item){
				$('[data-compare-add="'+item.id+'"]').addClass('is-added');
			});
		}else{
			$('.js-user_icons-icon-compares').removeClass('is-active');
			$('.js-popup-compares').html(templateLodashRender({popup: {title: 'Товары для сравнения не&nbsp;выбраны', icon: '<i class="far fa-align-right fa-3x" data-fa-transform="rotate-90"></i>'}}, 'popup-empty'));
		}
		$('.js-bage-compares').html(data.products.length);
		if(Site.template == 'compare'){
			$('.js-compares-row').each(function(){
				$this = $(this);
				$similar = true;
				$html = '';
				$htmlEmpty = '';
				$('.compares-item-characteristics', $this).each(function(index, item){
					$htmlEmpty += $(this).html();
					if(index == 0){
						$html = $(this).html();
					}else{
						if($(this).html() == $html){
							$similar = true;
						}else{
							$similar = false;
							return false;
						}
					}

				});
				if($htmlEmpty == ''){
					$this.remove();
				}
				if($similar){
					$this.addClass('compares-same-row js-compares-same-row');
				}else{
					$this.removeClass('compares-same-row js-compares-same-row');
				}
			})
			if($('.js-compares-same-row').length == 0 || data.products.length == 1){
				$('.js-compares-same-row').removeClass('d-none');
				$('.js-compares-same-toggle').addClass('button--disabled').removeClass('is-toggle');
			}else{
				$('.js-compares-same-toggle').removeClass('button--disabled');
			}
			if($('.js-compares-same-toggle').hasClass('is-toggle')){
				$('.js-compares-same-row').addClass('d-none');
			}else{
				$('.js-compares-same-row').removeClass('d-none');
			}
		}
	});
	EventBus.subscribe('add_item:insales:compares', function(data){
		if(!$('[data-compare-add="'+data.action.item+'"]').hasClass('is-added')){
			//console.log('Товар добавлен в сравнение');
		}else{
			Compare.remove({
				item: data.action.item
			});
		}
	});
	EventBus.subscribe('always:insales:compares', function(data){
		if(data.method == 'overload'){
			if(!$('[data-compare-add="'+data.item+'"]').hasClass('is-added')){
				showMessage('alert', 'Внимание!', 'Сравнить можно не более 4 товаров.');
			}else{
				Compare.remove({
					item: data.item
				});
			}
		}
	});
	EventBus.subscribe('remove_item:insales:compares', function(data){
		if(Site.template != 'compare'){
			return false;
		}
		$('[data-compared-id="'+data.action.item+'"]').remove();
		$('.js-compares-table').addClass('compares-table-'+data.products.length);
		if(data.products.length == 1){
			$('.js-compares-same-row').removeClass('d-none');
			$('.js-compares-same-toggle').addClass('button--disabled').removeClass('is-toggle');
		}
		if(data.products.length == 0){
			$('.insales-section-compares').html(templateLodashRender({popup: {title: 'Товары для сравнения не&nbsp;выбраны', icon: '<i class="far fa-align-right fa-3x" data-fa-transform="rotate-90"></i>'}}, 'popup-empty'));
		};
	});
	$('.js-compares-same-toggle').on('click', function(e){
		e.preventDefault();
		if(!$(this).hasClass('button--disabled')){
			$('.js-compares-same-row').toggleClass('d-none');
			$(this).toggleClass('is-toggle');
		}
	})

	//избранное
	var Favorite = new Favorites({
		replaceTitle: false
	});
	EventBus.subscribe('add:insales:favorites', function(data){
		//console.log('Товар добавлен в избранное');
	});
	EventBus.subscribe('update:insales:favorites', function(data){
		if(data.favorites.size > 0){
			$('.js-user_icons-icon-favorites').addClass('is-active');
			$('.js-popup-favorites').html('<div class="dropdown_products-header">В вашем избранном<br><span>'+data.favorites.size+' '+declOfNum(data.favorites.size)+'</span> на сумму <span>'+Shop.money.format(data.favorites.totalPrice)+'</span></div><div class="dropdown_products js-popup-favorites-products"></div><div class="dropdown_products-action"><div class="row"><div class="col-12"><a href="/page/favorites" class="button button--primary button--block button--small">Перейти к избранному</a></div></div></div>');
			$('.js-popup-favorites-products').html(templateLodashRender(data, 'popup-favorites'));
		}else{
			$('.js-user_icons-icon-favorites').removeClass('is-active');
			$('.js-popup-favorites').html(templateLodashRender({popup: {title: 'В вашем избранном пока пусто', icon: '<i class="far fa-heart fa-3x"></i>'}}, 'popup-empty'));
		}
		if($('.js-favorites-block').length > 0){
			if(data.favorites.size > 0){
				$('.js-favorites-block').show();
				$('.js-favorites-loader').hide();
				$('.js-favorites-products').html(templateLodashRender(data, 'product-card'));
				Compare.update();
				Favorite.checkFavoritesProducts();
			}else{
				$('.js-favorites-block').hide();
				$('.js-favorites-loader').show();
				$('.js-favorites--wait').addClass('d-none');
				$('.js-favorites--empty').removeClass('d-none');
			}
		}
		$('.js-bage-favorites').html(data.favorites.size);
	});
  console.log(Site.template);

	//страница товара
	if(Site.template == 'product'){
		var variant_is_click = false;
		var variant_is_first = true;
    console.log("hello");
		$(document).on('click', '[data-option-bind]', function(e){
			variant_is_click = true;
		});
		EventBus.subscribe('update_variant:insales:product', function(data){
			if(!data.action.product.is('[data-main-form]')){
				return;
			}
			$('.js-product-variants-loader').addClass('d-none');
			$('.js-product-variants-data').removeClass('d-none');
			var $product = data.action.product;
			$product.find('.js-product-price').html(Shop.money.format(data.action.price));
			$product.find('.js-product-sku').html((data.sku != null)?data.sku:'—');
			$('.js-product-weight').html((data.weight != null)?data.weight:'—');
			if(data.old_price){
				$product.find('.js-product-price').addClass('product-price--sale');
				$product.find('.js-product-old_price').html(Shop.money.format(data.old_price)).fadeIn(200);
				$product_discount = Math.round(data.action.price / data.old_price * -100 + 100);
				if($product_discount > 0){
					$product.find('.js-product-label--sale').html('Скидка '+$product_discount+'%').removeClass('d-none');
				}else{
					$product.find('.js-product-label--sale').html('Скидка').removeClass('d-none');
				}
			}else{
				$product.find('.js-product-price').removeClass('product-price--sale');
				$product.find('.js-product-old_price').fadeOut(200);
				$product.find('.js-product-label--sale').addClass('d-none');
			}
			if(variant_is_click || variant_is_first){
				var $carousel = $('.js-product-gallery-thumb[href="'+data.first_image.original_url+'"]:first-child');
				$carousel.trigger('click');
				$('.js-owl-carousel-gallery').trigger('to.owl.carousel', [($carousel.data('index')-1), 200]);
			}
			variant_is_click = false;
			variant_is_first = false;
			if(data.available){
				$product.find('.js-product-buttons').removeClass('product-buttons--soldout');
				$product.find('.js-product-available').removeClass('product-available--soldout');
			}else{
				$product.find('.js-product-buttons').addClass('product-buttons--soldout');
				$product.find('.js-product-available').addClass('product-available--soldout');
			}
			if(Site.account.bonus_system){
				var $quantity = (data.action.quantity.current > 0) ? data.action.quantity.current : 1;
				var $bonuses = Math.floor(data.action.price * $quantity * (Site.account.bonus_system.bonus_percent / 100));
				$('.js-product-bonuses').html($bonuses+' '+declOfNum($bonuses, ['бонус', 'бонуса', 'бонусов']));
			}
			$('.js-options_description').remove();
			$('.js-message-options_description').each(function(index, item){
				var $this = $(this);
				var $handle = $this.data('handle');
				var $title = $this.data('title');
				$('.option-'+$handle+' .option-label').append('<button type="button" class="button button--empty button--info button--small js-options_description" data-target="'+$handle+'"><i class="far fa-question-circle fa-lg"></i><span>'+$title+'</span></button>');
			});
		});
	}

	//просмотренные товары
	var myRecentlyView = new RecentlyView({
		success: function(_products){
			if(_products.length > 0){
				$('.js-owl-carousel-products-recently-slider').html(templateLodashRender(_products, 'product-card-recently'));
				$('#insales-section-products--recently').removeClass('d-none');
				$('.js-owl-carousel-products-recently-slider').owlCarousel({
					items:2,
					margin:20,
					loop:false,
					nav:false,
					navText:['<i class="far fa-chevron-left fa-lg"></i>','<i class="far fa-chevron-right fa-lg"></i>'],
					dots:true,
					responsive:{
						0:{
							items:2,
							nav:false,
							dots:true
						},
						768:{
							items:3,
							nav:false,
							dots:true
						},
						992:{
							items:4,
							nav:true,
							dots:false
						}
					}
				});
				Compare.update();
				Favorite.checkFavoritesProducts();
			}else{
				$('#insales-section-products--recently').addClass('d-none');
			}
		}
	});
	$('.js-recently-clear').on('click', function(e){
		e.preventDefault();
		$('#insales-section-products--recently').slideUp(400, function(){
			$('#insales-section-products--recently').addClass('d-none');
			if(localforage){
				localforage.removeItem('recently_view');
			}
		});
	});

	//выделение активной категории
	$.each(Site.current_collections, function(index,item){
		$('[data-collection-id="'+item.id+'"]').addClass('is-active is-open');
		$('.header-main [data-collection-id="'+item.id+'"]').parent().addClass('overflow-hidden');
	});

	//форма подписки
	$('.js-footer-subscribe').on('submit', function(e){
		e.preventDefault();
		if($(this).attr('action') == '#'){
			showMessage('alert', 'Форма не настроена!', 'Т.к. заранее не известно какой сервис будет использоваться для сбора контактов, то для формы подписки требуется отдельная настройка специалистом под конкретную службу.');
		}
	});
	//галерея в товаре
	$('.data-fancybox').fancybox({
		loop: true,
		infobar: false,
		animationEffect: 'fade',
		transitionEffect: 'slide',
		baseClass: 'fancybox-gallery',
		buttons:[
			'close'
		]
	});
	$(document).on('click', '.js-product-gallery-thumb', function(e){
		e.preventDefault();
		$this = $(this);
		if(!$this.hasClass('is-active')){
			$('.js-product-gallery-thumb').removeClass('is-active');
			$this.addClass('is-active');
			$original_url = $this.attr('href');
			$large_url = $('span', $this).attr('style');
			$('.js-product-image-thumb').animate({
				opacity: 0,
				left: -20
			}, 200, function(){
				$('.js-product-image-thumb').css('left', 20).attr('href', $original_url).data('index', $this.data('index'));;
				$('.js-product-image-thumb span').attr('style', $large_url);
			}).animate({
				opacity: 1,
				left: 0
			}, 200);

		}
	});
	$(document).on('click', '.js-product-image-thumb', function(e){
		e.preventDefault();
		$('.js-product-gallery-thumb-'+$(this).data('index')).trigger('click');
	});

	var navCollectionsTimer = false;
	var $navCollections = $('.js-nav-collections-trigger');
	var $navTarget = 'hamburger';
	$navCollections.on('mouseenter', function(e){
		$navTarget = $(this).data('target');
		if(navCollectionsTimer != false){
			clearTimeout(navCollectionsTimer);
		}
		if($navTarget == 'hamburger'){
			navCollectionsTimer = setTimeout(function(){
				$navCollections.addClass('is-active');
				navCollectionsTimer = false;
			}, 200);
		}
	}).on('mouseleave', function(e){
		if(navCollectionsTimer != false){
			clearTimeout(navCollectionsTimer);
		}
		navCollectionsTimer = setTimeout(function(){
			$navCollections.removeClass('is-active');
			navCollectionsTimer = false;
		}, 200);
	});

	$('.js-user_icons-item').on('click', function(e){
		if(window.outerWidth < 1025 && !$(this).hasClass('is-open') && !$(e.target).hasClass('js-popup-close')){
			e.preventDefault();
			if($(this).hasClass('user_icons-item-menu') && $('.js-popup-content-menu').html() == ''){
				$('.js-popup-content-menu').append($('.js-nav-collections > ul').html());
				if($('.header-main .js-popup-content-menu').find('.is-open').size() > 1){
					$('.js-popup-scroll').addClass('overflow-hidden');
				}else{
					$('.js-popup-scroll').removeClass('overflow-hidden');
				}
			}
			$(this).addClass('is-open');
			$('body').addClass('overflow-hidden');
		}
	});
	$('body').on('click', '.js-popup-close', function(){
		$('.js-user_icons-item.is-open').removeClass('is-open');
		$('body').removeClass('overflow-hidden');
	});

	$('body').on('click', '.js-nav-collections-toggle', function(e){
		if(window.outerWidth < 1025){
			e.preventDefault();
			var $this = $(this)
			var $type = $this.data('type');
			var $target = $this.data('target');
			var $object = $('[data-collection-id="'+$target+'"]');
			if($type == 'next'){
				$object.parent().addClass('overflow-hidden');
				$object.addClass('is-open');
			}else{
				$object.parent().removeClass('overflow-hidden');
				$object.removeClass('is-open');
			}
			if($('.header-main .js-popup-content-menu').find('.is-open').size() > 1){
				$('.js-popup-scroll').addClass('overflow-hidden');
			}else{
				$('.js-popup-scroll').removeClass('overflow-hidden');
			}
		}
	});

	$('body').on('click', '.js-nav-sidebar-clone .js-nav-arrow-toggle', function(e){
		e.preventDefault();
		var $this = $(this);
		var $target = $this.parent().data('target');
		var $object = $('[data-collection-id="'+$target+'"]');
		$object.toggleClass('is-open');
	});

	$('.js-bundle-title').on('click', function(){
		var $this = $(this);
		$this.toggleClass('is-active').next().slideToggle(400);
	});

	$(document).on('click', '.js-tabs-list-item', function(){
		var $this = $(this);
		if(!$this.hasClass('is-active')){
			$('.js-tabs-list-item, .js-tabs-content').removeClass('is-active');
			$this.addClass('is-active');
			$('[data-tab="'+$this.data('target')+'"]').addClass('is-active');
		}
	});

	/*filter*/
	var priceSlider = $('.js-ion-range-slider-price');
	var priceSliderData = priceSlider.data('ionRangeSlider');
	var priceSliderMin = $('.js-range-'+priceSlider.data('input')+'-min');
	var priceSliderMax = $('.js-range-'+priceSlider.data('input')+'-max');
	priceSlider.ionRangeSlider({
		type: 'double',
		min_interval: 10,
		step: 10,
		hide_min_max: true,
		hide_from_to: false,
		grid: false,
		drag_interval: true,
		force_edges: true,
		onFinish: function(data){
			priceSliderUpdate(data);
			loadCollectionData('filter','');
		}
	});

	function priceSliderUpdate(data){
		if(data.update){
			priceSliderData.update({
				from: data.min,
				to: data.max,
				min: data.min,
				max: data.max
			});
		}
		var counterPriceCount = 0;
		if(data.min != data.from){
			priceSliderMin.prop('disabled', false);
			counterPriceCount++;
		}else{
			priceSliderMin.prop('disabled', true);
		}
		if(data.max != data.to){
			priceSliderMax.prop('disabled', false);
			counterPriceCount++;
		}else{
			priceSliderMax.prop('disabled', true);
		}
		priceSliderMin.val(data.from);
		priceSliderMax.val(data.to);
		$parent = priceSlider.closest('.js-filter-item');
		$('.js-filter-item-counter', $parent).html('Диапазон<span>'+Shop.money.format(data.from).replace(priceSlider.data('postfix'),'')+' – '+Shop.money.format(data.to)+'</span>');
		if(counterPriceCount != 0){
			$('.js-filter-item-reset_price', $parent).removeClass('d-none');
			$parent.addClass('is-active');
		}else{
			$('.js-filter-item-reset_price', $parent).addClass('d-none');
			$parent.removeClass('is-active');
		}
	}

	var propertySlider = $('.js-ion-range-slider-property');
	propertySlider.ionRangeSlider({
		type: 'double',
		min_interval: 1,
		step: 1,
		hide_min_max: true,
		hide_from_to: false,
		grid: false,
		drag_interval: true,
		force_edges: true,
		onFinish: function(data){
			propertySliderUpdate(data);
			loadCollectionData('filter','');
		}
	});

	function propertySliderUpdate(data){
		console.log(data)
		var obj = $(data.input).data('input');
		var propertySliderMin = $('.js-range-'+obj+'-min');
		var propertySliderMax = $('.js-range-'+obj+'-max');
		if(data.update){
			propertySliderData.update({
				from: data.min,
				to: data.max,
				min: data.min,
				max: data.max
			});
		}
		var counterPropertyCount = 0;
		if(data.min != data.from){
			propertySliderMin.prop('disabled', false);
			counterPropertyCount++;
		}else{
			propertySliderMin.prop('disabled', true);
		}
		if(data.max != data.to){
			propertySliderMax.prop('disabled', false);
			counterPropertyCount++;
		}else{
			propertySliderMax.prop('disabled', true);
		}
		propertySliderMin.val(data.from);
		propertySliderMax.val(data.to);
		$parent = $(data.input).closest('.js-filter-item');
		$('.js-filter-item-counter', $parent).html('Диапазон<span>'+data.from+' – '+data.to+'</span>');
		if(counterPropertyCount != 0){
			$('.js-filter-item-reset_price', $parent).removeClass('d-none');
			$parent.addClass('is-active');
		}else{
			$('.js-filter-item-reset_price', $parent).addClass('d-none');
			$parent.removeClass('is-active');
		}
	}

	$('.js-filter-item-title').on('click', function(e){
		e.preventDefault();
		if(!$(this).parent().hasClass('is-open')){
			$('.is-open', $('.filter')).removeClass('is-open');
		}
		$(this).parent().toggleClass('is-open');
	});

	$('body').on('click', function(e){
		if($(e.target).closest('.js-filter-item').length == 0){
			$('.is-open', $('.filter')).removeClass('is-open');
		}
	});

	$('.js-filter-value-checkbox').on('change', function(e){
		e.preventDefault();
		loadCollectionData('filter','');
		$parent = $(this).closest('.js-filter-item');
		checkFilterCounter($parent);
	});

	$('.js-filter-item-reset_this').on('click', function(e){
		e.preventDefault();
		$parent = $(this).closest('.js-filter-item');
		if($parent.hasClass('is-active')){
			$('.js-filter-value-checkbox', $parent).prop('checked', false);
		}else{
			$('.js-filter-value-checkbox', $parent).prop('checked', true);
		}
		loadCollectionData('filter','');
		checkFilterCounter($parent);
	});

	$('.js-filter-item-reset_price').on('click', function(e){
		e.preventDefault();
		$parent = $(this).closest('.js-filter-item');
		$parent.removeClass('is-active');
		$(this).addClass('d-none');
		if($parent.data('type') == 'price'){
			priceSliderData = priceSlider.data('ionRangeSlider');
			priceSliderUpdate({
				from: priceSlider.data('min'),
				to: priceSlider.data('max'),
				min: priceSlider.data('min'),
				max: priceSlider.data('max'),
				update: true
			});
		}
		if($parent.data('type') == 'properties_range'){
			propertySlider = $('.js-ion-range-slider-property', $parent);
			propertySliderData = propertySlider.data('ionRangeSlider');
			propertySliderUpdate({
				from: propertySlider.data('min'),
				to: propertySlider.data('max'),
				min: propertySlider.data('min'),
				max: propertySlider.data('max'),
				input: propertySlider,
				update: true
			});
		}
		loadCollectionData('filter','');
	});

	$('body').on('click', '.js-filter-reset_all', function(e){
		e.preventDefault();
		$('.js-filter-form')[0].reset();
		$('.js-filter-value-checkbox').prop('checked', false);
		$('.js-filter-item').each(function(){
			$parent = $(this);
			$parent.removeClass('is-active');
			if($(this).data('type') == 'price'){
				priceSliderData = priceSlider.data('ionRangeSlider');
				priceSliderUpdate({
					from: priceSlider.data('min'),
					to: priceSlider.data('max'),
					min: priceSlider.data('min'),
					max: priceSlider.data('max'),
					update: true
				});
				$('.js-filter-item-reset_price').addClass('d-none');
			}else{
				if($(this).data('type') == 'properties_range'){
					propertySlider = $('.js-ion-range-slider-property', $parent);
					propertySliderData = propertySlider.data('ionRangeSlider');
					propertySliderUpdate({
						from: propertySlider.data('min'),
						to: propertySlider.data('max'),
						min: propertySlider.data('min'),
						max: propertySlider.data('max'),
						input: propertySlider,
						update: true
					});
					$('.js-filter-item-reset_price').addClass('d-none');
				}else{
					$('.js-filter-item-counter', $parent).html('0 выбрано');
					$('.js-filter-item-reset_this', $parent).text('Выбрать всё');
				}
			}
		});
		loadCollectionData('filter','');
	});

	$('.js-filter-hidden-toggle').on('click', function(e){
		e.preventDefault();
		$target = $('.'+$(this).data('target'));
		$target.toggleClass('is-hidden')
		$(this).toggleClass('is-active')
	});

	$('.js-filter-open').on('click', function(e){
		$('body').addClass('overflow-hidden');
		$('.js-filter-container').addClass('is-open');
	});

	$('.js-filter-close').on('click', function(e){
		$('body').removeClass('overflow-hidden');
		$('.js-filter-container').removeClass('is-open');
	});

	$('.js-filter-sort').on('change', function(e){
		$('#order').val($(this).val());
		if($(this).val() != ''){
			$('#order').prop('disabled', false);
		}else{
			$('#order').prop('disabled', true);
		}
		loadCollectionData('sort','');
	});

	var pagingPosition = 'bottom';
	function loadCollectionData(type, url){
		if(type == 'pagination'){
			loadUrl = url;
			loadContent = loadUrl+' .js-products-data-content';
			loadData = '';
			loadDataHistory = loadUrl;
			$contentCache = $('.js-content-cache');
			pageWindowScroll = $(window).scrollTop();
			if($('.pagination-separator').length > 0){
				pageSeparatorPosition = $('.pagination-separator:first').offset().top;
				pageSeparatorCurrent = $('.pagination-separator:first');
			}
			$contentCache.load(loadContent, loadData, function(){
				window.history.replaceState({}, '', loadDataHistory);
				if(pagingPosition == 'bottom'){
					$('.js-collection-data .js-products-row').append($('.js-content-cache .js-products-row').html());
					$('.js-collection-data .pagination-bottom').html($('.js-content-cache .pagination-bottom').html());
				}else{
					$('.js-collection-data .js-products-row').prepend($('.js-content-cache .js-products-row').html());
					$('.js-collection-data .pagination-top').html($('.js-content-cache .pagination-top').html());
					if($('.pagination-separator').length > 0){
						pageSeparatorCurrentPosition = pageSeparatorCurrent.offset().top
						$(window).scrollTop(pageSeparatorCurrentPosition-(pageSeparatorPosition-pageWindowScroll));
					}
				}
				$('.js-content-cache').html('');
				$('.js-pagination-load').removeClass('button--progress');
				Compare.update();
				Favorite.checkFavoritesProducts();
			});
		}else{
			$contentCache = $('.js-content-cache');
			onlySort = false;
			if(type == 'filter' || type == 'sort'){
				loadUrl = $('.js-filter-form').attr('action');
				loadContent = loadUrl+' .js-collection-data-content';
				loadData = $('.js-filter-form').serialize();
				loadDataHistory = loadUrl+((loadData != '')?'?':'')+loadData;
			}else{
				loadUrl = url;
				loadContent = loadUrl+' .js-collection-data-content';
				loadData = $('.js-filter-form').serialize();
				loadDataHistory = loadUrl;
			}
			if(loadData.indexOf('options') < 0 && loadData.indexOf('characteristics') < 0 &&  loadData.indexOf('price_min') < 0 && loadData.indexOf('price_max') < 0 && loadData.indexOf('properties_gt') < 0 && loadData.indexOf('properties_lt') < 0){
				onlySort = true;
			}
			if(loadData != '' && !onlySort){
				$('.js-filter-item-reset').removeClass('d-none');
			}else{
				$('.js-filter-item-reset').addClass('d-none');
			}
			$contentCache.load(loadContent, loadData, function(){
				if($('.js-content-cache .js-collection-description').data('handle') != ''){
					window.history.replaceState({},'',$('.js-content-cache .js-collection-description').data('handle'));
				}else{
					window.history.replaceState({},'',loadDataHistory);
				}
				$('.js-collection-data .js-products-data').html($('.js-content-cache .js-products-data').html());
				$('.js-collection-data .js-collection-description').html($('.js-content-cache .js-collection-description').html());
				$('.js-collection-data .js-collection-seo_description').html($('.js-content-cache .js-collection-seo_description').html());
				$('.js-content-cache').html('');
				Compare.update();
				Favorite.checkFavoritesProducts();
			});
		}
	};

	$('body').on('click','.js-pagination-load',function(e){
		e.preventDefault();
		if(!$(this).hasClass('button--progress')){
			pagingPosition = $(this).data('position');
			$(this).addClass('button--progress').html('<i class="far fa-spinner-third fa-spin fa-lg"></i>Загружаем&hellip;');
			loadCollectionData('pagination', $(this).attr('href'));
		}
	});

	var isFiltered = false;
	function checkFilterCounter(parent){
		$parent = parent;
		var counterText = '';
		var counterCount = 0;
		$('.js-filter-value', $parent).each(function(){
			if($(this).find('.js-filter-value-checkbox').prop('checked')){
				if(counterCount != 0){
					counterText += ', ';
				}
				counterText += $(this).find('.js-filter-value-label').text();
				counterCount++;
			}
		});
		if(counterCount != 0){
			$('.js-filter-item-counter', $parent).html(counterCount+' выбрано<span>'+counterText+'</span>');
			$('.js-filter-item-reset_this', $parent).text('Сбросить');
			$parent.addClass('is-active');
			isFiltered = true;
		}else{
			$('.js-filter-item-counter', $parent).html('0 выбрано');
			$('.js-filter-item-reset_this', $parent).text('Выбрать всё');
			$parent.removeClass('is-active');
		}
	}

	if($('.js-filter').length > 0){
		$('.js-filter-item').each(function(index, item){
			if($(this).data('type') != 'price' && $(this).data('type') != 'properties_range'){
				checkFilterCounter($(this));
			}
		});
		if(priceSlider.data('min') != priceSlider.data('from') || priceSlider.data('max') != priceSlider.data('to')){
			isFiltered = true;
			priceSliderUpdate({
				from: priceSlider.data('from'),
				to: priceSlider.data('to'),
				min: priceSlider.data('min'),
				max: priceSlider.data('max')
			});
		}
		$('.js-ion-range-slider-property').each(function(){
			var $this = $(this);
			if($this.data('min') != $this.data('from') || $this.data('max') != $this.data('to')){
				isFiltered = true;
				propertySlider = $this;
				propertySliderUpdate({
					from: propertySlider.data('from'),
					to: propertySlider.data('to'),
					min: propertySlider.data('min'),
					max: propertySlider.data('max'),
					input: $this
				});
			}
		});
		if(isFiltered){
			$('.js-filter-item-reset').removeClass('d-none');
		}else{
			$('.js-filter-item-reset').addClass('d-none');
		}
	}
	/*---*/

	$('.js-owl-carousel-slider').owlCarousel({
		items:1,
		loop:true,
		autoHeight:false,
		autoplay:((InsalesThemeSettings.slider_autoplay)?true:false),
		autoplayHoverPause:true,
		autoplayTimeout:8000,
		nav:false,
		dots:true
	});
	$('.js-owl-carousel-gallery').owlCarousel({
		items:1,
		margin:20,
		loop:false,
		nav:false,
		navText:['<i class="far fa-chevron-left fa-lg"></i>','<i class="far fa-chevron-right fa-lg"></i>'],
		dots:true,
		responsive:{
			0:{
				items:1,
				nav:false,
				dots:true
			},
			768:{
				items:6,
				nav:true,
				dots:false
			}
		}
	});
	$('.js-owl-carousel-products-slider').owlCarousel({
		items:2,
		margin:20,
		loop:false,
		nav:false,
		navText:['<i class="far fa-chevron-left fa-lg"></i>','<i class="far fa-chevron-right fa-lg"></i>'],
		dots:true,
		responsive:{
			0:{
				items:2,
				nav:false,
				dots:true
			},
			768:{
				items:3,
				nav:false,
				dots:true
			},
			992:{
				items:4,
				nav:true,
				dots:false
			}
		}
	});
	$('.js-owl-carousel-brands-slider').owlCarousel({
		items:2,
		margin:20,
		loop:true,
		nav:false,
		navText:['<i class="far fa-chevron-left fa-lg"></i>','<i class="far fa-chevron-right fa-lg"></i>'],
		dots:true,
		responsive:{
			0:{
				items:2,
				nav:false,
				dots:true
			},
			768:{
				items:4,
				nav:true,
				dots:false
			},
			992:{
				items:6,
				nav:true,
				dots:false
			}
		}
	});

	//rating
	var $rating = $('.js-rating');
	$rating.each(function(){
		var $this = $(this);
		var $star = $('[data-rating-star]', $this);
		var $single = $('[data-rating-single]', $this);
		var $reset = $('[data-rating-reset]', $this);
		var $input = $('[data-rating-input]', $this);
		var is_click = false;
		if($star.length == 0){
			$star = $single;
		}
		$star.on('mouseenter', function(){
			$(this).prevAll('[data-rating-star]').addClass('rating-item--hover');
			$(this).nextAll('[data-rating-star]').addClass('rating-item--unhover');
			$(this).addClass('rating-item--hover');
		}).on('mouseleave', function(){
			if(!is_click){
				$(this).prevAll('[data-rating-star]').removeClass('rating-item--hover');
				$(this).nextAll('[data-rating-star]').removeClass('rating-item--unhover');
				$(this).removeClass('rating-item--hover');
			}
			is_click = false;
		}).on('click', function(){
			is_click = true;
			$star.removeClass('rating-item--active rating-item--hover rating-item--unhover');
			$star.addClass('rating-item--unactive');
			$(this).prevAll('[data-rating-star]').addClass('rating-item--active');
			$(this).prevAll('[data-rating-star]').removeClass('rating-item--unactive');
			$(this).addClass('rating-item--active');
			$(this).removeClass('rating-item--unactive');
			$input.val($(this).data('rating-rate'));
		});
		$reset.on('click', function(){
			$star.removeClass('rating-item--active rating-item--hover rating-item--unhover');
			$star.addClass('rating-item--unactive');
			$input.val('');
		});
	});

	$('.js-rating-link').on('click', function(e){
		e.preventDefault();
		$('[data-target="reviews"]').trigger('click');
		scrollToElement($('#insales-section-tabs'));
	});

	if(Site.template == 'product' || Site.template == 'article'){
		if(location.hash == "#review_form" ||location.hash == "#comment_form" || location.hash == "#comments"){
			$('[data-target="reviews"]').trigger('click');
			scrollToElement($('#insales-section-tabs'));
		}
	}

	function scrollToElement(obj){
		$('html, body').animate({
			scrollTop: obj.offset().top
		}, 400);
	}

	/*resize*/
	var updateResizeDelay;
	var $navMenu = $('.js-nav-items');
	var $filterClass = $('[data-filter]').attr('class');
	function eventResize(){
		$navMenu.addClass('is-overflow');
		clearTimeout(updateResizeDelay);
		updateResizeDelay = setTimeout(function(){
			$thisExtraMenuWidth = $navMenu.width();
			$thisExtraPupup = $('.js-popup-nav', $navMenu);
			$thisExtraPupup.html('');
			if($thisExtraMenuWidth > 0){
				var $thisExtraPupupLink = $('.js-nav-item--dropdown', $navMenu);
				$thisExtraPupupLink.addClass('d-none');
				$navMenu.addClass('is-overflow');
				var $thisExtraWidthSum = 0;
				$('.js-nav-item', $navMenu).removeClass('d-none');
				$('.js-nav-item', $navMenu).each(function(){
					$thisItem = $(this);
					$thisExtraWidthSum += $thisItem.outerWidth();
					if($thisExtraWidthSum + 44 > $thisExtraMenuWidth || $thisItem.position().top > 0){
						$thisItem.addClass('d-none');
						$thisExtraPupup.append('<li'+(($thisItem.hasClass('is-active'))?' class="is-active"':'')+'>'+$thisItem.html()+'</li>');
						$thisExtraPupupLink.removeClass('d-none');
					}
				});
				if($thisExtraPupupLink.find('.is-active').length > 0){
					$thisExtraPupupLink.addClass('is-active');
				}
				$navMenu.removeClass('is-overflow');
			}
		}, 200);
		if($('[data-filter]').data('filter') == 'content'){
			if(window.outerWidth < 1025){
				$('[data-filter]').attr('class', 'filter-sidebar');
			}else{
				$('[data-filter]').attr('class', $filterClass);
			}
		}
	}

	$(window).on('load resize', function(){
		eventResize();
	});
	eventResize();

	$('.js-header-menu').sticky({
		topSpacing: 0
	}).on('sticky-start', function(){
		eventResize();
	}).on('sticky-end', function(){
		eventResize();
	});
	/*---*/

	$('body').on('click', '.js-text-overflow-toggle', function(e){
		$(this).closest('.js-text-overflow').toggleClass('is-hidden');
	});

	$('.js-faq-toggle').on('click', function(e){
		$(this).toggleClass('is-active').closest('.js-faq-item').find('.js-faq-content').slideToggle(200);
	});

	function showMessage($type, $title, $content){
		$.fancybox.close();
		$.fancybox.open({
			src: '<div class="message message--'+$type+'"><div class="message-title">'+$title+'</div><div class="message-content">'+$content+'</div></div>',
			type: 'inline',
			touch: false,
			smallBtn: true
		});
	}

	$('.js-messages').on('click', function(){
		var $this = $(this);
		var $target = $this.data('target');
		var $type = $this.data('type');
		showMessage($type, $('.js-message-'+$target).data('title'), $('.js-message-'+$target).html());
	});

	$(document).on('click', '.js-options_description', function(e){
		$target = $(this).data('target');
		$type = 'text';
		$title = $('.js-message-options_description[data-handle="'+$target+'"]').data('title');
		$contant = $('.js-message-options_description[data-handle="'+$target+'"]').html();
		showMessage($type, $title, $contant);
	});

	//feedback
	$('body').on('submit', '.js-feedback', function(e){
		e.preventDefault()
		var $form = $(this);
		var $formAlert = $form.data('alert');
		var $formFields = '';
		var $formContent = $form.find('[name="feedback[content]"]');
		var $formSubject = $form.find('[name="feedback[subject]"]');
		$form.addClass('in-progress');
		$form.find('.js-feedback-fields').each(function(index, item){
			if($(this).val() != ''){
				$formFields += $(this).data('title')+': '+$(this).val()+'<br>';
			}
		});
		if($formFields != ''){
			$formContent.val($formFields);
		}else{
			$formContent.val($formSubject.val());
		}
		$.ajax({
			url: $form.attr('action')+'.json',
			data: $form.serialize(),
			type: 'post',
			dataType: 'json'
		}).fail(function(e){
			showMessage('alert', 'Упс!', 'Кажется что-то пошло не так. Попробуйте позже или свяжитесь с нами альтернативным способом.');
		}).done(function(e){
			$.fancybox.close();
			$form[0].reset();
			if(e.status == 'ok'){
				showMessage('alert', 'Отлично!', $formAlert);
			}else{
				showMessage('alert', 'Упс!', 'Кажется что-то пошло не так. Попробуйте позже или свяжитесь с нами альтернативным способом.');
			}
		});
	});

	//search
	var $search = $('.js-search-input');
	if($search.length > 0){
		$search.autocomplete({
			serviceUrl: '/search.json',
			paramName: 'q',
			params: {
				page_size: 1
			},
			dataType: 'json',
			deferRequestBy: 300,
			preserveInput: true,
			noCache: false,
			appendTo: '.js-search-results',
			minChars: 3,
			transformResult: function(response){
				return {
					suggestions: $.map(response, function(dataItem){
						return {
							value: dataItem.title,
							data: {
								url: dataItem.url,
								price: dataItem.variants[0].price,
								image: dataItem.first_image.thumb_url
							}
						};
					})
				};
			},
			formatResult: function(suggestions, currentValue){
				var title = suggestions.value.replace(new RegExp('(?![^&;]+;)(?!<[^<>]*)('+$search.autocomplete().currentValue+')(?![^<>]*>)(?![^&;]+;)','gi'),'<strong>$1</strong>');
				return '<a href="'+suggestions.data.url+'" class="autocomplete-suggestion-link"><span class="autocomplete-suggestion-thumb" style="background-image: url('+suggestions.data.image+');"></span><span class="autocomplete-suggestion-title">'+title+'</span><span class="autocomplete-suggestion-price">'+Shop.money.format(suggestions.data.price)+'</span></a>';
			},
			onSearchStart: function(params){
				$search.addClass('in-progress');
			},
			onSearchComplete: function(query, suggestions){
				$search.removeClass('in-progress');
				if(suggestions.length > 0){
					$('.js-search-results').addClass('is-show');
				}else{
					$('.js-search-results').removeClass('is-show');
				}
			},
			onHide: function(container){
				$('.js-search-results').removeClass('is-show');
			}
		});
	}

	//instafeed
	if($('#instafeed').length > 0){
		var userFeed = new Instafeed({
		  get: 'user',
		  userId: $('#instafeed').data('userid'),
		  accessToken: $('#instafeed').data('accesstoken'),
		  limit: 6,
		  resolution: 'standard_resolution',
		  template: '<div class="col-4 col-lg-2"><a href="{{link}}" target="_blank" style="background-image: url({{image}});"><span><i class="fab fa-instagram fa-2x"></i></span></a></div>'
		});
		userFeed.run();
	}
});
