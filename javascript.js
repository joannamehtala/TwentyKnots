

/* Mobile detection*/
var isMobile = false;

if(Modernizr.touch){
	isMobile = true;
}



$(function() {

	initContentPage();

	/* execute backgrounResize on window resize only on desktop */
	$(window).resize(function(){
		//switchBackgroundImg();
		if($(window).width() > 640){
			$('.sup.navigation-sup').addClass('full');
			setWindowHeight();
			setContentMargin(true);
		} else {
			$('.sup.navigation-sup').removeClass('full');
			setContentMargin(false);
		}
	});

})


/* document on ready has ended -> functions from now on!*/



	

	var initContentPage = function(){
			try{Typekit.load();}catch(e){}
			console.log('init content page fired');
			//switchBackgroundImg();
			setMobileNavigation();
			initDropdownMenuMobile();
			if($(window).width() > 640){
				$('.sup.navigation-sup').addClass('full');
				setWindowHeight();
				setContentMargin(true);
				initDropdownMenu();
			} else {
				$('.sup.navigation-sup').removeClass('full');
				setContentMargin(false);
			}
	}

	


	/* adjusting margin-height for main content div*/
	var setContentMargin = function(trueOrFalse){
        if(trueOrFalse){
        	var korkeus = $( window ).height()-25;
        	$(".content-wrapper").css('margin-top', korkeus);
        	console.log(korkeus);
        } else {
        	$(".content-wrapper").css('margin-top', '0');
        }      
	}

	var setWindowHeight = function(){
		
		var height = $(window).height();
		$('.background').css('height', height);

	}
    
    /*    
	var switchBackgroundImg = function(){
			var newImgURL;
			console.log('img switcher fired')

			if(activePage == 'sup'){	
				if($(window).width() > 480){
			          $('.fullscreen.background').css("background", "url(images/SUPtwentyknots-14.jpg) no-repeat center center fixed"); 
			          $('.fullscreen.background').css("background-size", "cover");
			    } else {
			          $('.fullscreen.background').css("background", "url(images/suposio.jpg) no-repeat scroll 0px 0px / 100% auto"); 
			    }
		    }
		    if(activePage == 'purjelautailu'){
				if($(window).width() > 480){
			          $('.fullscreen.background').css("background", "url(images/background-plauta-1-2560.jpg) no-repeat center center fixed"); 
			          $('.fullscreen.background').css("background-size", "cover");
			    } else {
			          $('.fullscreen.background').css("background", "url(images/suposio.jpg) no-repeat"); 
			    }
		    }
		    if(activePage == 'home'){
				if($(window).width() > 480){
			          $('.fullscreen.background').css("background", "url(images/SUPtwentyknots-12Crop.jpg) no-repeat center center fixed"); 
			          $('.fullscreen.background').css("background-size", "cover");
			    } else {
			          $('.fullscreen.background').css("background", "url(images/supgradient2.jpg) no-repeat scroll 0px 0px / 100% auto"); 
			    }
		    }
	}
	*/


    /* mobile navigation menu*/
    var setMobileNavigation = function(){
    	var onkoAuki = false;
	    $(".mobile-navigation-button").click(function(){
	        if(!onkoAuki){
	            $(".mobile-navigation").css('display', 'block');
	            onkoAuki = true;
	        } else {
	              console.log("hello");
	              $(".mobile-navigation").css('display', 'none');
	              onkoAuki = false;
	        }
	    });
    }
    


    /*    Dropdown for main navigation   */
    var initDropdownMenu = function(){
    	var korkeus2;
    	$('.navigation-sup li').hover(
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
				$(this).css('height', korkeus2);
				$('ul', this).fadeOut();
				
			}
		); 
    }

    /*    Dropdown for main navigation   */
    var initDropdownMenuMobile = function(){
    	$('.navigation-sup li').click(function(){

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

    }


	/* adjusting height according to screen height */
	$('.mobile-navigation li').css('line-height', $(window).height()/120);


	/* Background image */
	/*
	var backgroundResize = function(){
	    var windowH = $(window).height();
	    $(".background").each(function(i){
		        var path = $(this);
		        // variables
		        var contW = path.width();
		        var contH = path.height();
		        var imgW = path.attr("data-img-width");
		        var imgH = path.attr("data-img-height");
		        var ratio = imgW / imgH;
		        // overflowing difference
		        var diff = parseFloat(path.attr("data-diff"));
		        diff = diff ? diff : 0;
		        // remaining height to have fullscreen image only on parallax
		        var remainingH = 0;
		        if(path.hasClass("parallax")){
		            var maxH = contH > windowH ? contH : windowH;
		            remainingH = windowH - contH;
		        }
		        // set img values depending on cont
		        imgH = contH + remainingH + diff;
		        imgW = imgH * ratio;
		        // fix when too large
		        if(contW > imgW){
		            imgW = contW;
		            imgH = imgW / ratio;
		        }
		        //
		        path.data("resized-imgW", imgW);
		        path.data("resized-imgH", imgH);
		        path.css("background-size", imgW + "px " + imgH  + "px");
	    });
	}
		
	*/


	

	/*
	var makeUnselectable = function( $target ) {
	    $target
	        .addClass( 'unselectable' ) // All these attributes are inheritable
	        .attr( 'unselectable', 'on' ) // For IE9 - This property is not inherited, needs to be placed onto everything
	        .attr( 'draggable', 'false' ) // For moz and webkit, although Firefox 16 ignores this when -moz-user-select: none; is set, it's like these properties are mutually exclusive, seems to be a bug.
	        .on( 'dragstart', function() { return false; } );  // Needed since Firefox 16 seems to ingore the 'draggable' attribute we just applied above when '-moz-user-select: none' is applied to the CSS 
	};

	makeUnselectable($('.fullscreen.background'));
*/











