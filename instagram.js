$(document).ready(function(){

			var nextURL = "https://api.instagram.com/v1/users/187220380/media/recent/?access_token=187220380.a4b6bce.708a47bb94dd44509481342d36733f75"
			var uusiMaxID;
			kutsuKuvat(nextURL);

			$('#testi').click(function(){

				kutsuLisaaKuvia();
				console.log(nextURL);
			});
		



			function kutsuKuvat(url){
				
				$.ajax({
					type: 'GET',
					dataType:'jsonp',
					url: url,
					success:  function(data){
						//päivitetään nextURL jos halutaan lisää kuvia.
						nextURL = data.pagination.next_url;
						
						var items = [];
						//loopataan lista läpi
						var x = 0;
						$.each( data.data, function( i, item ){  
							x++;
							
	          					items.push("<li><a target='_blank' href='" + data.data[i].link + "'><img src='" + data.data[i].images.thumbnail.url + "'></img></a></li>");
	     
	          				
						}); 

						$( "<ul/>", {
						    "class": "instakuvat",
						    html: items.join( "" )
							}).appendTo( "body" );
						}

				});
			}

			//käy läpi instafeedin ja lisää kuvat li elementteihin jonka jälkeen ul listaan. 
			function kutsuLisaaKuvia(){
					
					//haetaan uudet kuvat
					$.ajax({
						type: 'GET',
						dataType:'jsonp',
						url: nextURL,
						success:  function(data){
							//päivitetään nextURL
							nextURL = data.pagination.next_url;
							console.log(nextURL);
							var items = [];

							$.each( data.data, function( i, item ){  
			          			items.push("<li><a target='_blank' href='" + data.data[i].link + "'><img src='" + data.data[i].images.thumbnail.url + "'></img></a></li>");
							}); 

							$('.instakuvat').append(items.join(''));
						}
					});
			}


		});