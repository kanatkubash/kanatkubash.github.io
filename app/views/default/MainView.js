define([
 	'jquery',
 	'underscore',
 	'backbone',
	//'fullpage',
	'imagesLoaded',
	'layoutmanager'




 	// 'text!templates/tourContainerTemplate.html'

  // 'text!templates/manager/postsListTemplate.html'
], function($, _, Backbone,  imagesLoaded){

  	var view = {
	    el: "#main",
	    fullpage: "#main .main-wrapper",
      svg: '.svg-container',

	    events: {
	      //'scroll': 'detect_scroll'
	      'click .navmenu a.menu-item': 'EVENT_hiJack',
	      'click .servicemenu a.menu-item': 'EVENT_hiJack',
	      'click #ourbrief .portfolio-covers a.cover-item': 'EVENT_hiJack',
	      'click #ourbrief .portfolio-contents .ui-close' : 'EVENT_closeBrief',
	    },

	    displayRatio: (window.devicePixelRatio >= 1.5) ? '2x' : '',

      // 0 - MAIN
      // 1 - SERVICE
      // 2 - PORTFOLIO
      // 3 - PROJECTS
      // 4 - CONTACTS

      scene: {
        wordmark: [
          {css: {transform: 'translateX(0%)', WebkitTransform: 'translateX(0%)', opacity: 1}},
          {css: {transform: 'translateX(200%)', WebkitTransform: 'translateX(200%)', opacity: 1}},
          {css: {opacity: 0}},
          {css: {opacity: 0}},
          {css: {transform: 'translateX(200%)', WebkitTransform: 'translateX(200%)', opacity: 1}}
        ],
      },

      locale: {
        page: [
          {title: ''}, {title: '• Services'}, {title: '• Portfolio'}, {title: '• Projects'}, {title: '• Contacts'}
        ]
      },

	    initialize:function(options) {
	    	console.log('[-> require MainView...]');

	    	this.vent = options.vent;

	    },

	    afterRender: function(){

	    	console.log('------------- afterRender');
	    	if($.fn.fullpage.inited){
          console.log('BOLDY2');
	    		$.fn.fullpage.setScrollingSpeed(0);
			    $.fn.fullpage.moveTo($.fn.fullpage.inited.id);
			    $.fn.fullpage.setScrollingSpeed(700);
	    		Backbone.history.navigate($.fn.fullpage.inited.route.join('/'), true);
	    	}
        $.fn.fullpage.inited = true;

  			// if ( ! Detector.webgl ) {
  			//     Detector.addGetWebGLMessage();
  			//     container.innerHTML = "";
  			// }
	    	$(this.el).addClass('loaded');
        $(this.svg).addClass('loaded');

  			if($.fn.fullpage.disablePaneScroll){
  				$.fn.fullpage.setAllowScrolling(false);
  			}
			// $('#wordmark').css({transform: 'scale('+(window.innerHeight/600)+'%)',
	  	// /				WebkitTransform: 'scale('+(window.innerHeight/600)+'%)'});

  			$.ajax({
  				url: window.location.pathname+'?manifest=true',
  			}).done(function(data) {
  			  console.log(data);
  				_.mapObject(data, function(content, selector){
  					//console.log(selector, content);
  					if(content.length){
  						$(selector).append(content);
  					}
  				});
  			});


        var mapCanvas = document.getElementById('gmap');
        var mapOptions = {
          center: new google.maps.LatLng(44.5403, -78.5463),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          scrollwheel: false,
          //navigationControl: false,
          mapTypeControl: false,
          scaleControl: false,
          //draggable: false,
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);




			// BGCanvas.init();
			// BGCanvas.animate();
	    },

	    renderPane: function(layoutID, layout, pane, section){
	    	console.log('layout: '+layout, pane, section);

	    	if($.fn.fullpage.inited){
	    		$.fn.fullpage.moveTo(layoutID);
	    	}
	    	else{
	    		var arr = [layout, pane, section];
	    		arr = arr.filter(function(n){ return n != undefined });
	    		$.fn.fullpage.inited = {id: layoutID, route: arr};
	    	}

	    	console.log('lauout-id', layoutID);

        $('#wordmark').css(this.scene.wordmark[layoutID-1].css);

        document.title = 'KemengerLAB '+this.locale.page[layoutID-1].title;

	    	if((layoutID==2) || (layoutID==4)){
	    		$('.navmenu').addClass('inversed');
	    	} else{
	    		$('.navmenu').removeClass('inversed');
	    	}

	    	if(layoutID==3){

	    		// Portfolio layout switches

	    		$('.portfolio-contents .content').removeClass('content_active');
	   			$('.portfolio-covers .cover-item').removeClass('cover-item_active');
	   			$('.portfolio-covers .cover-item').removeClass('insuff');
	   			$('.portfolio-covers .cover-item').css({
	    				'-webkit-transform': 'translate(0px, 0px)',
           				'-ms-transform': 'translate(0px, 0px)',
           				'transform': 'translate(0px, 0px)'});

	    		if(pane){
	    			// console.log('-#-',$.fn.fullpage, $.fn.fullpage.inited);
	    			if($.fn.fullpage.inited == true){
	    				$.fn.fullpage.setAllowScrolling(false);
	    				var self = this;

	    				if($('.portfolio-contents').find('.brief-'+pane).length != 0){
	    					self.renderBriefCase(pane);
	    				} else{
	    					var tt = new Date();
	    					console.info("XHR: sent");
	    					$.ajax({
								url: '/briefcase/'+pane,
							}).done(function(data) {
							  	console.info(data);

								console.info("XHR: success "+(new Date()-tt))
								$(data.article).appendTo('.portfolio-contents').imagesLoaded().always(function(instance){
									console.info("XHR: loaded "+(new Date()-tt));

									console.log(instance);
									self.renderBriefCase(pane);
									console.log($(data.article));
								});

								// $('.portfolio-contents').append(data.article);

								//
							});
	    				}





	    			} else{
	    				$.fn.fullpage.disablePaneScroll = true;
	    				this.renderBriefCase(pane);
	    			}



	    			console.log('brief renderPane');



	    		} else if($.fn.fullpage.inited == true){
	    			$.fn.fullpage.setAllowScrolling(true);
	    		}
	    	}

	    	if(layoutID==2){

	    		$('#ourservice .service-contents .service-content').removeClass('content_active');
	    		$('#ourservice .service-contents .service-content .service-content-section').removeClass('section_active');

	    		if(pane){
	    			$('#ourservice .service-contents .service-'+pane).addClass('content_active');

	    				if(section){
	    				$('#ourservice .service-contents .service-'+pane+' .section-'+section).addClass('section_active');
	    			} else{
	    				$('#ourservice .service-contents .service-'+pane+' .section-default').addClass('section_active');
	    			}
	    		}


	    	}





	    },

	    renderBriefCase: function(briefcase){
	    	$('.portfolio-contents .brief-'+briefcase).addClass('content_active');

			$('.portfolio-covers .cover-item:not(#cover-'+briefcase+')').addClass('insuff');

			var cover_item = $('#cover-'+briefcase);

			cover_item.addClass('cover-item_active');

			cover_item.css({
				'-webkit-transform': 'translate(-'+(cover_item.offset().left-(window.innerWidth/4-cover_item.width())/2)+'px, '+((window.innerHeight/2-cover_item.height()/2)-(cover_item.offset().top))+'px)',
   				'-ms-transform': 'translate(-'+(cover_item.offset().left-(window.innerWidth/4-cover_item.width())/2)+'px, '+((window.innerHeight/2-cover_item.height()/2)-(cover_item.offset().top))+'px)',
   				'transform': 'translate(-'+(cover_item.offset().left-(window.innerWidth/4-cover_item.width())/2)+'px, '+((window.innerHeight/2-cover_item.height()/2)-(cover_item.offset().top))+'px)'});
	    },


		detect_scroll: function(e){
			console.log('scroll', e);
		},




		EVENT_closeBrief: function(e){
			$.fn.fullpage.setAllowScrolling(true);
			this.EVENT_hiJack(e);
		},


		EVENT_hiJack: function(e){
			var href = e.currentTarget.getAttribute('href');
			// console.warn(e.currentTarget);
			var protocol = this.protocol + "//";
		    if ((href.slice(protocol.length) !== protocol) && $(e.currentTarget).hasClass('insuff')!=true) {
		    	e.preventDefault();


		      Backbone.history.navigate(href, true);
		    } else if($(e.currentTarget).hasClass('insuff')){
		    	e.preventDefault();
		    }
		}

	};

	var MainView = Backbone.Layout.extend(view);
	return MainView;
});
