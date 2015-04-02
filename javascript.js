

$(function() {

	initContentPage();

	/* execute backgrounResize on window resize only on desktop */
    var onkoScroll = true;
    
    $(window).scroll(function(){
        if($(window).width() > 1049){
            if($(window).scrollTop() > 190){
                if(onkoScroll){
                    $('.sub-navigation').addClass('change-to-black');
                    onkoScroll = false;
                } 
            } else {
                if(!onkoScroll){    
                    $('.sub-navigation').removeClass('change-to-black');
                    onkoScroll = true;
                }
            }
        }
    });
    
	$(window).resize(function(){
		fixMobileDropdownAfterResize();
	
		if($(window).width() > 640){
			$('.sub-navigation').addClass('full');
			setWindowHeight();
			setContentMargin(true);
			initDropdownMenu();
		} else {
			$('.sub-navigation').removeClass('full');
			setContentMargin(false);
			//initDropdownMenuMobile();
		}
	});

})




/* document on ready has ended -> functions from now on!*/





	var initContentPage = function(){
			try{Typekit.load();}catch(e){}
			setMobileNavigation();
			initDropdownMenuMobile();
			if($(window).width() > 640){
				$('.sub-navigation').addClass('full');
				setWindowHeight();
				setContentMargin(true);
				initDropdownMenu();
			} else {
				$('.sub-navigation').removeClass('full');
				setContentMargin(false);
			}
	}


	/* adjusting margin-height for main content div*/
	var setContentMargin = function(trueOrFalse){
        if(trueOrFalse){
        	var korkeus = $( window ).height()-25;
        	$(".content-wrapper").css('margin-top', korkeus);
        } else {
        	$(".content-wrapper").css('margin-top', '0');
        }      
	}

	var setWindowHeight = function(){
		var height = $(window).height();
		$('.background').css('height', height);
	}


    /* mobile navigation menu*/
    var setMobileNavigation = function(){
    	var onkoAuki = false;
	    $(".mobile-navigation-button").click(function(){
	        if(!onkoAuki){
	            $(".mobile-navigation").css('display', 'block');
	            onkoAuki = true;
	        } else {
	              $(".mobile-navigation").css('display', 'none');
	              onkoAuki = false;
	        }
	    });
    }
    


    /*    Dropdown for main navigation   */
    var initDropdownMenu = function(){
    	var korkeus2;
	    	if($(window).width() > 640){
		    	$('.main-navigation li').hover(
					// When mouse enters the .navigation element
					function () {
						//Fade in the navigation submenu
						$('ul', this).css('display', 'block'); // fadeIn will show the sub cat menu
							korkeus2 = $(this).height();
							$(this).css('height', $('ul', this).height());

					},
					// When mouse leaves the .navigation element
					function () {
						//Fade out the navigation submenu
						if($(window).width() > 640){
							$(this).css('height', korkeus2);
						}
						$('ul', this).fadeOut();	
					}
				); 
    		} 
    }

    var fixMobileDropdownAfterResize = function(){
    		if($(window).width() < 641){
    			/* remove hover effects on mobile */
    			$('.main-navigation li').unbind('mouseenter mouseleave');
    			/* set li height back to auto on mobile*/
    			$('.main-navigation li').css('height', 'auto');

    		}
    }


    /*    Dropdown for main navigation mobile & mobile navigation   */
    var initDropdownMenuMobile = function(){
    	$('.main-navigation li').css('height', 'auto');
    	$('.main-navigation li').click(function(){
			if($(this).hasClass('closed')) {
				//Fade in the navigation submenu
				$(this).addClass('open');
				$(this).removeClass('closed');
				$(this).find('ul').fadeIn(); // fadeIn will show the sub cat menu
			} else if($(this).hasClass('open')){
    			$(this).removeClass('open');
				$(this).addClass('closed');
    			$(this).find('ul').fadeOut();
    		}
		}); 

		$('.mobile-navigation li').click(function(){
			if($(this).hasClass('closed')) {
				//Fade in the navigation submenu
				$(this).addClass('open');
				$(this).removeClass('closed');
				$(this).find('ul').fadeIn(); // fadeIn will show the sub cat menu
			} else if($(this).hasClass('open')){
    			$(this).removeClass('open');
				$(this).addClass('closed');
    			$(this).find('ul').fadeOut();
    		}
		}); 

		/* Scroll down sub-navigation */
		$(".sub-navigation li").click(function() {
			var kohde = $(this).attr("class");
	    	$.scrollTo( '#'+kohde+'-anchor', 1000, {
	    		'axis':'y'
	    	});

	    });

	    /* Scroll down arrow-logo */
		$(".scrollto").click(function() {
	    	$.scrollTo($(this).attr("href"), 1000, {
	    		'axis':'y'
	    	});	
	    	return false; 
		});

    }







	




