     
        
        
        
            
    /********  GOOGLE MAPS SETIT ALKAA ********/    
     
    /* meidän pääkartta */    
    var map;
    var retket = [];
    var zoomNyt = 10;
    
    function initialize() {
        var mapOptions = {
          center: { lat: 60.13176, lng: 24.793814},
          zoom: 10
        };
        
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
        
        
        
        
        //alustetaan kaikki retket
        var j = 0;
        while(j < retket.length){
            var retki = retket[j];
            retki.ikonit[0].setMap(map);
            
            google.maps.event.addListener(retki.ikonit[0], 'click', function() {
                    
                var klikattuRetki = retket[this.retkenNumero];
                
                //suljetaan muut retket 
                for(var i = 0; i < retket.length; i++){
                    var retki2 = retket[i];
                    if(retki2 != klikattuRetki){
                        if(retki2.onkoAvattu == true){
                             // otetaan reitti pois
                            retki2.suljeReitti();
                            // otetaan ikonit pois
                            retki2.poistaIkonit();
                            retki2.onkoAvattu = false;
                        }
                    }
                }
                
                //jos retki ei oo vielä auki
                if(klikattuRetki.onkoAvattu == false) {
                    klikattuRetki.piirraReitti(map);

                    var i = 0;
                    while(i < klikattuRetki.ikonit.length){
                        klikattuRetki.ikonit[i].setMap(map);
                        i++;
                    } 
                    
                    klikattuRetki.onkoAvattu = true;
                } else {
                    // otetaan reitti pois
                    klikattuRetki.suljeReitti();
                    // otetaan ikonit pois
                    skaalaaIkoneita(35, map, false, true);
                    klikattuRetki.poistaIkonit();
                    klikattuRetki.onkoAvattu = false;
                
                }
            });

            google.maps.event.addListener(retki.ikonit[1], 'click', function() {
                    var klikattuRetki1 = retket[this.retkenNumero];
                    klikattuRetki1.tiedot.avaaInfoWindow(map, klikattuRetki1.ikonit[1]);
            });
            
            /*
            google.maps.event.addListener(retki.ikonit[2], 'click', function() {
                    var klikattuRetki2 = retket[this.retkenNumero];
                    klikattuRetki2.saa.avaaSaaWindow(map, klikattuRetki2.ikonit[2]);
            });
            */
        
            google.maps.event.addListener(retki.ikonit[2], 'click', function() {
                    var klikattuRetki3 = retket[this.retkenNumero];
                    klikattuRetki3.kalenteri.avaaKalenteriWindow(map, klikattuRetki3.ikonit[2]);
            });
            
            google.maps.event.addListener(retki.ikonit[3], 'click', function() {
                    var klikattuRetki4 = retket[this.retkenNumero];    
                    klikattuRetki4.kuva.avaaKuvaWindow(map, klikattuRetki4.ikonit[3]);
            });
            

            j++;
        };
        
        
        google.maps.event.addListener(map, 'zoom_changed', function() {
            var nouseeko = true;

            if(map.getZoom() > zoomNyt){
                nouseeko = true;
                console.log('nousee');
            } else {
                nouseeko = false;
                console.log('laskee');
            }
            zoomNyt = map.getZoom();
            
            /* suljetaan retket kun zoom vaihtuu  */
            if(map.getZoom() < 13) {
                var j = 0;
                while(j < retket.length){
                    var retki = retket[j];
                    if(retki.onkoAvattu){
                        console.log(retki.reitti2);
                        retki.suljeReitti();
                        retki.poistaIkonit();
                        retki.onkoAvattu = false;
                    }
                    j++;
                }
            }
            
            /* skaalataan avoimien retkien ikoneita kun zoom vaihtuu */
            var skaalauksenMaara;
            
            console.log(map.getZoom());
            switch( map.getZoom() ) {
                case 13:
                    skaalauksenMaara = 35;
                    break;
                case 14:
                    skaalauksenMaara = 40;
                    break;
                case 15:
                    skaalauksenMaara = 45;
                    break;
                case 16:
                    skaalauksenMaara = 50;
                    break;
                
                default:
                    skaalauksenMaara = 35;
            }
                    
            skaalaaIkoneita(skaalauksenMaara, map, nouseeko, false);
            
            
        });
    
    }
        
    
        
    google.maps.event.addDomListener(window, 'load', initialize);
        
        
        
        
        
        
    /********************************************************/
    /****************** luodaan retki olio ******************/
    /********************************************************/
        
    function retki(koordinaatit, tiedot, kalenteri, kuva, zoomLevel){
        
        /* attribuutit */
        this.koordinaatit = koordinaatit;
        this.tiedot = tiedot;
        //this.saa = saa;
        this.kalenteri = kalenteri;
        this.kuva = kuva;
        this.zoomLevel = zoomLevel;
        this.ikonit = []; 
        this.reitti2;
        this.onkoAvattu = false;
        
        /* lasketaan reittipisteiden latitude keskiarvo 
        var summa = 0;
        for( var i = 0; i < this.koordinaatit.length; i++ ){
            summa += this.koordinaatit[i].lat();
        }
        this.latAvg = summa/this.koordinaatit.length;
        
        if( this.latAvg > this.koordinaatit[0].lat() ){
            this.ikonilisa = -0.003;
        }
        */
        
        /* funktioita */
        this.muutaZoom = function(kartta) {
          kartta.setZoom(this.zoomLevel);
        }
        
        this.muutaCenter = function(kartta){
            kartta.setCenter(this.koordinaatit[0]);
        }
    
        this.piirraReitti = function(kartta) {
           
            var x = 0;
            var departure = this.koordinaatit[x];
            var arrival = this.koordinaatit[x+1];
            var reitti = new google.maps.Polyline({
                path: [departure, departure],
                strokeColor: "#335A9F",
                strokeOpacity: 1,
                strokeWeight: 6,
                geodesic: true, //set to false if you want straight line instead of arc
                map: kartta,
            });
               
            var step = 0;
            var numSteps = 50; //Change this to set animation resolution
            var timePerStep = 1; //Change this to alter animation speed
            var interval;
            var path = [];
            var ensimmainenKerta = true;
            
            function alustaAnimaatio(){
                
                departure = koordinaatit[x];
                arrival = koordinaatit[x+1];
                step = 0;
                if(x < koordinaatit.length-1){
                    interval = setInterval(animoiReitti, timePerStep);
                }
            }
                
            function animoiReitti(){
                   
                   step += 1;
                   if (step > numSteps) {  
                       clearInterval(interval);
                       x++;
                       alustaAnimaatio();
                   } else { 
                       var are_we_there_yet = google.maps.geometry.spherical.interpolate(departure,arrival,step/numSteps);
                       if(ensimmainenKerta){
                         path.push(are_we_there_yet);
                         path.push(departure);
                         ensimmainenKerta = false;
                       } else {
                         path.push(departure);
                         path[path.length-1] = are_we_there_yet;
                       }
                       reitti.setPath(path); 
                       this.reitti2 = reitti;
                   }       
            }
            alustaAnimaatio();
            this.muutaZoom(kartta);
            this.muutaCenter(kartta);
            this.reitti2 = reitti;
            console.log(this.reitti2);
        }
        
        this.suljeReitti = function(){
          this.reitti2.setMap(null);
        }   
        
        this.poistaIkonit = function(){
            var i = 1;
            while(i < this.ikonit.length){
                this.ikonit[i].setMap(null);
                i++;
            } 
        }
  
    }

        

        
 /********************************************************/
 /****************** luodaan tiedot olio *****************/
 /********************************************************/        
        
        
    function tiedot(nimi, kuvaus, kesto, hinta, tarvikkeet, taso, lahto, sis, huom){
        this.nimi = nimi;
        this.kuvaus = kuvaus;
        this.kesto = kesto;
        this.hinta = hinta;
        this.tarvikkeet = tarvikkeet;
        this.taso = taso;
        this.lahto = lahto;
        this.sis = sis;
        this.huom = huom;

        this.avaaInfoWindow = function(map, marker){
            var info = this.annaHTMLMuodossa(); 
            var infowindow = new InfoBubble({
                  maxWidth: 500,
                  //maxHeight: 600,
                  map: map,
                  position: new google.maps.LatLng(map.getCenter().lat(), map.getCenter().lng()),
                  disableAutoPan: true,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 3,
                  borderColor: 'rgba(255,255,255,0.9)',
                  shadowStyle: 0,
                  content: info,
                  arrowStyle: 3
            });
            console.log(map.getCenter().lat(), map.getCenter().lng());
            infowindow.open(map, marker);
        }

        this.annaHTMLMuodossa = function(){
            var htmlMuodossa = '<div class="infobox">'+
            '<h1>'+this.nimi+'</h1>'+
            '<div class="content">'+
            '<p>'+this.kuvaus+'</p>'+
            '<div class="wrapper left">'+
            '<p>'+this.kesto+'</p>'+
            '<p>'+this.tarvikkeet+'</p>'+
            '<p>'+this.taso+'</p>'+
            '<p>'+this.lahto+'</p>'+
            '</div>'+
            '<div class="wrapper right">'+
            '<p>'+this.hinta+'</p>'+
            '<p>'+this.sis+'</p>'+
            '<p>'+this.huom+'</p>'+
            '</div>'+
            '</div>'+
            '</div>';

            return htmlMuodossa;
        }
    }

 /********************************************************/
 /****************** luodaan kuva olio *******************/
 /********************************************************/            
   
        
    function kuva(otsikko, kuvatiedosto){
        this.otsikko = otsikko;
        this.kuvatiedosto = kuvatiedosto;

        this.avaaKuvaWindow = function(map, marker){
            var kuvaWindow = new InfoBubble({
                  map: map,
                  maxWidth: 500,
                  position: new google.maps.LatLng(map.getCenter().lat(), map.getCenter().lng()),
                  disableAutoPan: true,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 3,
                  borderColor: 'rgba(255,255,255,0.9)',
                  shadowStyle: 0,
                  arrowStyle: 3,
                  content: '<div class="infobox">'+
                            '<h1>'+this.otsikko+'</h1>'+
                            '<img src="'+this.kuvatiedosto+'">'+
                            '<img src="'+this.kuvatiedosto+'">'+
                            '<img src="'+this.kuvatiedosto+'">'+
                            '<img src="'+this.kuvatiedosto+'">'+
                            '</div>'
                            });

            kuvaWindow.open(map, marker);
        }
    }

 /********************************************************/
 /****************** luodaan saa olio *******************/
 /********************************************************/


    function saa(otsikko, kuvaus){
        this.otsikko = otsikko;
        this.kuvaus = kuvaus;

        this.avaaSaaWindow = function(map, marker){
            var saaWindow = new InfoBubble({
                  maxWidth: 500,
                  map: map,
                  position: new google.maps.LatLng(map.getCenter().lat(), map.getCenter().lng()),
                  disableAutoPan: true,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 3,
                  borderColor: 'rgba(255,255,255,0.9)',
                  shadowStyle: 0,
                  arrowStyle: 3,
                  content: '<div class="infobox">'+
                           '<h1>'+this.otsikko+'</h1>'+
                           '<div class="content">'+
                           '<p>'+this.kuvaus+'</p>'+
                           '</div>'+
                           '</div>'
                          });

            saaWindow.open(map, marker);
        }
    }

 /********************************************************/
 /****************** luodaan kalenteri olio *******************/
 /********************************************************/


    function kalenteri(otsikko, kuvaus){
        this.otsikko = otsikko;
        this.kuvaus = kuvaus;

        this.avaaKalenteriWindow = function(map, marker){
            var kalenteriWindow = new InfoBubble({
                  maxWidth: 500,
                  map: map,
                  position: new google.maps.LatLng(map.getCenter().lat(), map.getCenter().lng()),
                  disableAutoPan: true,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 3,
                  borderColor: 'rgba(255,255,255,0.9)',
                  shadowStyle: 0,
                  arrowStyle: 3,
                  content: '<div class="infobox">'+
                           '<h1>'+this.otsikko+'</h1>'+
                           '<div class="content">'+
                           '<p>'+this.kuvaus+'</p>'+
                           '<a class="varauslinkki" target="_blank" href="http://www.varaaheti.fi/twentyknots/">'+"www.varaaheti.fi/twentyknots"+'</a>'+
                           '</div>'+
                           '</div>'
                          });

            kalenteriWindow.open(map, marker);
        }

    }

        
 /* luodaan google maps kuvaikonit */        
        
    var image = new google.maps.MarkerImage("images/karttaicons/kamera.png", null, null, null, new      google.maps.Size(35, 35));
    var image2 = new google.maps.MarkerImage("images/karttaicons/markkeri.png", null, null, null, new      google.maps.Size(54, 84));
    var imageinfo = new google.maps.MarkerImage("images/karttaicons/info.png", null, null, null, new      google.maps.Size(35, 35));
    var imagesaa = new google.maps.MarkerImage("images/karttaicons/saa.png", null, null, null, new      google.maps.Size(35, 35));
    var imagekalenteri = new google.maps.MarkerImage("images/karttaicons/kalenteri.png", null, null, null, new      google.maps.Size(35, 35));        
        

        
        
        
        
        
 /********************************************************/
 /****************** luodaan retkiä **********************/
 /********************************************************/    
        
    /* luodaan retkiä */ 
    var nimi = "Suvisaaristo";
    var kuvaus = "Tällä retkellä kierrämme kauniin Suinon saaren. Monipuolisen melontareitin varrella pääsee ihastelemaan saaren kaunista luontoa, upeita näkymiä aavalle merelle sekä suloisia saaristohuviloita. Pysähdymme retken aikana luodolle nauttimaan kuumaa juotavaa ja retkieväitä. Jokainen osallistuja saa paikan päältä lämpimän märkäpuvun ja tossut.";
    var kesto = '<b>'+"Kesto:"+'</b>'+" n. 3 tuntia (on mahdollista että retken kesto menee yli 3 tunnin).";
    var hinta = '<b>'+"Hinta:"+'</b>'+" 50€ (Kausikorttilaiset: 25€ ja sarjakorttilaiset: 3 * SUP-vuokra)"; 
    var tarvikkeet = '<b>'+"Mitä tarvitsen:"+'</b>'+" Kuoritakki/tuulitakki, pipo, ohuet hanskat, pyyhe, kuivat vaatteet, vesipullo, ja retkievästä.";
    var taso = '<b>'+"Retken taso:"+'</b>'+" Reitin taso on helppo ja melomme rauhallista tahtia osallistujien toiveiden mukaan. Retkelle osallistujilta vaadimme kuitenkin aikaisempaa SUP-melontakokemusta.";
    var lahto = '<b>'+"Lähtöpaikka:"+'</b>'+" Svinön Uimaranta. Suvisaarentie 9, Espoo. Tapaamme suurella hiekkaparkkipaikalla tien vieressä. Paikalle pääsee linja-autolla 145 sekä omalla autolla.";
    var sis = '<b>'+"Hintaan sis:"+'</b>'+" Kova sup-melontalauta, mela, pelastusliivit, märkäpuku ja tossut.";
    var huom = '<b>'+"Muuta huomioitavaa:"+'</b>'+" Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.";
    var tiedotSuvisaaristo = new tiedot(nimi, kuvaus, kesto, hinta, tarvikkeet, taso, lahto, sis, huom);
    var saaSuvisaaristo = new saa("Sää: Suvisaaristo", "Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.<p>Sääpalvelun tarjoaa Foreca</p>");
    var kalenteriSuvisaaristo = new kalenteri("Tulevat retket Suvisaaristoon", "21.5.2015 klo 17:00-20:00");
    var kuvaSuvisaaristo = new kuva("Kuvia retkiltä Suvisaaristoon", "images/supyoga.jpg");

        
    var suvisaaristo = new retki([
            new google.maps.LatLng( 60.12787051824118, 24.691343307495117),
            new google.maps.LatLng( 60.127357522076636, 24.694690704345703),
            new google.maps.LatLng( 60.1282125112417, 24.697608947753906),
            new google.maps.LatLng( 60.12979418263997, 24.701128005981445),
            new google.maps.LatLng( 60.133299237518216, 24.70198631286621),
            new google.maps.LatLng( 60.13547902235875, 24.71022605895996),
            new google.maps.LatLng( 60.136376538846946, 24.72696304321289),
            new google.maps.LatLng( 60.13428229561916, 24.73125457763672),
            new google.maps.LatLng( 60.13278632597922, 24.731769561767578),
            new google.maps.LatLng( 60.13210243148941, 24.735631942749023),
            new google.maps.LatLng( 60.12983692946053, 24.73374366760254),
            new google.maps.LatLng( 60.12757127145036, 24.728593826293945),
            new google.maps.LatLng( 60.12513444629072, 24.730310440063477),
            new google.maps.LatLng( 60.12308224305198, 24.72970962524414),
            new google.maps.LatLng( 60.12252641598807, 24.726791381835938),
            new google.maps.LatLng( 60.123253264875714, 24.724044799804688),
            new google.maps.LatLng( 60.122611928454944, 24.717693328857422),
            new google.maps.LatLng( 60.12205609344919, 24.713315963745117),
            new google.maps.LatLng( 60.12329602019279, 24.71099853515625),
            new google.maps.LatLng( 60.121799551050096, 24.699668884277344),
            new google.maps.LatLng( 60.12539096269888, 24.69426155090332),
            new google.maps.LatLng( 60.127015520191065, 24.68979835510254),
      ], tiedotSuvisaaristo, kalenteriSuvisaaristo, kuvaSuvisaaristo,  13);
        
    retket.push(suvisaaristo);
                
     
        
     /* luodaan retkiä */ 
    var nimi = "Käärmeluodot";
    var kuvaus = "Tällä retkellä kierrämme kauniin Suinon saaren. Monipuolisen melontareitin varrella pääsee ihastelemaan saaren kaunista luontoa, upeita näkymiä aavalle merelle sekä suloisia saaristohuviloita. Pysähdymme retken aikana luodolle nauttimaan kuumaa juotavaa ja retkieväitä. Jokainen osallistuja saa paikanpäältä lämpimän märkäpuvun ja tossut.";
    var kesto = '<b>'+"Kesto:"+'</b>'+" n. 3 tuntia (on mahdollista että retken kesto menee yli 3 tunnin).";
    var hinta = '<b>'+"Hinta:"+'</b>'+" 50€ (Kausikorttilaiset: 25€ ja sarjakorttilaiset: 3 * SUP-vuokra)"; 
    var tarvikkeet = '<b>'+"Mitä tarvitsen:"+'</b>'+" Kuoritakki/tuulitakki, pipo, ohuet hanskat, pyyhe, kuivat vaatteet, vesipullo, ja retkievästä.";
    var taso = '<b>'+"Retken taso:"+'</b>'+" Reitin taso on helppo ja melomme rauhallista tahtia osallistujien toiveiden mukaan. Retkelle osallistujilta vaadimme kuitenkin aikaisempaa SUP-melontakokemusta.";
    var lahto = '<b>'+"Lähtöpaikka:"+'</b>'+" Svinön Uimaranta. Suvisaarentie 9, Espoo. Tapaamme suurella hiekkaparkkipaikalla tien vieressä. Paikalle pääsee linja-autolla 145 sekä omalla autolla.";
    var sis = '<b>'+"Hintaan sis:"+'</b>'+" Kova sup-melontalauta, mela, pelastusliivit, märkäpuku ja tossut.";
    var huom = '<b>'+"Muuta huomioitavaa:"+'</b>'+" Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.";
    var tiedotKaarmeluodot = new tiedot(nimi, kuvaus, kesto, hinta, tarvikkeet, taso, lahto, sis, huom);
    var saaKaarmeluodot = new saa("Sää: Lauttasaari", "Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.<p>Sääpalvelun tarjoaa Foreca</p>");
    var kalenteriKaarmeluodot = new kalenteri("Tulevat retket Käärmeluodoille", "Toistaiseksi ei päivämääriä");
    var kuvaKaarmeluodot = new kuva("Kuvia retkiltä Käärmeluodoille", "images/supyoga.jpg");    
    var kaarmeluodot = new retki([    
    
        new google.maps.LatLng(60.15459937355298, 24.872617721557617),
        new google.maps.LatLng( 60.15171601014133, 24.86952781677246),
        new google.maps.LatLng( 60.15069075331861, 24.86309051513672),
        new google.maps.LatLng( 60.15069075331861, 24.85558032989502),
        new google.maps.LatLng( 60.15113930711245, 24.845237731933594),
        new google.maps.LatLng( 60.15090435112648, 24.840989112854004),
        new google.maps.LatLng( 60.15009267207424, 24.83905792236328),
        new google.maps.LatLng( 60.14896055993272, 24.8386287689209),
        new google.maps.LatLng( 60.14370534038359, 24.837899208068848),
        new google.maps.LatLng( 60.142637103631955, 24.839229583740234),
        new google.maps.LatLng( 60.14250891289015, 24.84236240386963),
        new google.maps.LatLng( 60.14441035763323, 24.844379425048828),
        new google.maps.LatLng( 60.146098064803944, 24.84661102294922),
        new google.maps.LatLng( 60.14579898377164, 24.848756790161133),
        new google.maps.LatLng( 60.14564944223549, 24.85407829284668),
        new google.maps.LatLng( 60.14765751468975, 24.863948822021484),
        new google.maps.LatLng( 60.149238251424435, 24.872102737426758),
        new google.maps.LatLng( 60.15043443411743, 24.873390197753906),
        new google.maps.LatLng( 60.15342470046727, 24.873647689819336 ),

    ], tiedotKaarmeluodot, kalenteriKaarmeluodot, kuvaKaarmeluodot, 13);
        
    retket.push(kaarmeluodot);
        
    
        
    /* luodaan retkiä */ 
    var nimi = "Midnight SUP / Eira - Töölönlahti";
    var kuvaus = "Tällä retkellä kierrämme kauniin Suinon saaren. Monipuolisen melontareitin varrella pääsee ihastelemaan saaren kaunista luontoa, upeita näkymiä aavalle merelle sekä suloisia saaristohuviloita. Pysähdymme retken aikana luodolle nauttimaan kuumaa juotavaa ja retkieväitä. Jokainen osallistuja saa paikanpäältä lämpimän märkäpuvun ja tossut.";
    var kesto = '<b>'+"Kesto:"+'</b>'+" n. 3 tuntia (on mahdollista että retken kesto menee yli 3 tunnin).";
    var hinta = '<b>'+"Hinta:"+'</b>'+" 50€ (Kausikorttilaiset: 25€ ja sarjakorttilaiset: 3 * SUP-vuokra)"; 
    var tarvikkeet = '<b>'+"Mitä tarvitsen:"+'</b>'+" Kuoritakki/tuulitakki, pipo, ohuet hanskat, pyyhe, kuivat vaatteet, vesipullo, ja retkievästä.";
    var taso = '<b>'+"Retken taso:"+'</b>'+" Reitin taso on helppo ja melomme rauhallista tahtia osallistujien toiveiden mukaan. Retkelle osallistujilta vaadimme kuitenkin aikaisempaa SUP-melontakokemusta.";
    var lahto = '<b>'+"Lähtöpaikka:"+'</b>'+" Svinön Uimaranta. Suvisaarentie 9, Espoo. Tapaamme suurella hiekkaparkkipaikalla tien vieressä. Paikalle pääsee linja-autolla 145 sekä omalla autolla.";
    var sis = '<b>'+"Hintaan sis:"+'</b>'+" Kova sup-melontalauta, mela, pelastusliivit, märkäpuku ja tossut.";
    var huom = '<b>'+"Muuta huomioitavaa:"+'</b>'+" Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.";
    var tiedotMidnight = new tiedot(nimi, kuvaus, kesto, hinta, tarvikkeet, taso, lahto, sis, huom);
    var saaMidnight = new saa("Sää: Etelä-Helsinki", "Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.<p>Sääpalvelun tarjoaa Foreca</p>");
    var kalenteriMidnight = new kalenteri("Tulevat retket: Midnight SUP / Eira - Töölönlahti", "Toistaiseksi ei päivämääriä");
    var kuvaMidnight = new kuva("Kuvia Midnight-retkiltä", "images/supyoga.jpg");    
    var midnight = new retki([    
    
        new google.maps.LatLng(60.153809143552216, 24.93570327758789),
        new google.maps.LatLng(60.152783952001904, 24.93844985961914),
        new google.maps.LatLng(60.153809143552216, 24.94668960571289),
        new google.maps.LatLng(60.153894574738345, 24.952526092529297),
        new google.maps.LatLng(60.15227134423812, 24.95819091796875),
        new google.maps.LatLng(60.15440715719298, 24.963855743408203),
        new google.maps.LatLng(60.15722621783532, 24.965229034423828),
        new google.maps.LatLng(60.16021586646704, 24.96316909790039),
        new google.maps.LatLng(60.16311983618494, 24.962997436523438),
        new google.maps.LatLng(60.16636514575052, 24.957332611083984),
        new google.maps.LatLng(60.16807307468363, 24.956817626953125),
        new google.maps.LatLng(60.16952474447549, 24.96042251586914),
        new google.maps.LatLng(60.17037863792086, 24.969005584716797),
        new google.maps.LatLng(60.17234250862234, 24.971580505371094),
        new google.maps.LatLng(60.17533078226463, 24.96969223022461),
        new google.maps.LatLng(60.176526015605326, 24.964027404785156),
        new google.maps.LatLng(60.17729435692852, 24.959392547607422),
        new google.maps.LatLng(60.176782131376854, 24.953556060791016),
        new google.maps.LatLng(60.17626989783665, 24.94823455810547),
        new google.maps.LatLng(60.177550466708695, 24.94342803955078),
        new google.maps.LatLng(60.179257814206515, 24.941024780273438),
        new google.maps.LatLng(60.17977000114811, 24.935359954833984),
        new google.maps.LatLng(60.17729435692852, 24.933643341064453),  

    ], tiedotMidnight, kalenteriMidnight, kuvaMidnight, 13);
        
    retket.push(midnight);    
        
        
        
    /* luodaan retkiä */ 
    var nimi = "Villingin kierto";
    var kuvaus = "Tällä retkellä kierrämme kauniin Suinon saaren. Monipuolisen melontareitin varrella pääsee ihastelemaan saaren kaunista luontoa, upeita näkymiä aavalle merelle sekä suloisia saaristohuviloita. Pysähdymme retken aikana luodolle nauttimaan kuumaa juotavaa ja retkieväitä. Jokainen osallistuja saa paikanpäältä lämpimän märkäpuvun ja tossut.";
    var kesto = '<b>'+"Kesto:"+'</b>'+" n. 3 tuntia (on mahdollista että retken kesto menee yli 3 tunnin).";
    var hinta = '<b>'+"Hinta:"+'</b>'+" 50€ (Kausikorttilaiset: 25€ ja sarjakorttilaiset: 3 * SUP-vuokra)"; 
    var tarvikkeet = '<b>'+"Mitä tarvitsen:"+'</b>'+" Kuoritakki/tuulitakki, pipo, ohuet hanskat, pyyhe, kuivat vaatteet, vesipullo, ja retkievästä.";
    var taso = '<b>'+"Retken taso:"+'</b>'+" Reitin taso on helppo ja melomme rauhallista tahtia osallistujien toiveiden mukaan. Retkelle osallistujilta vaadimme kuitenkin aikaisempaa SUP-melontakokemusta.";
    var lahto = '<b>'+"Lähtöpaikka:"+'</b>'+" Svinön Uimaranta. Suvisaarentie 9, Espoo. Tapaamme suurella hiekkaparkkipaikalla tien vieressä. Paikalle pääsee linja-autolla 145 sekä omalla autolla.";
    var sis = '<b>'+"Hintaan sis:"+'</b>'+" Kova sup-melontalauta, mela, pelastusliivit, märkäpuku ja tossut.";
    var huom = '<b>'+"Muuta huomioitavaa:"+'</b>'+" Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.";
    var tiedotVillinki = new tiedot(nimi, kuvaus, kesto, hinta, tarvikkeet, taso, lahto, sis, huom);
    var saaVillinki = new saa("Sää: Etelä-Helsinki", "Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.<p>Sääpalvelun tarjoaa Foreca</p>");
    var kalenteriVillinki = new kalenteri("Tulevat retket: Midnight SUP / Eira - Töölönlahti", "Toistaiseksi ei päivämääriä");
    var kuvaVillinki = new kuva("Kuvia Midnight-retkiltä", "images/supyoga.jpg");    
    var villinki = new retki([  
        
        
        
        new google.maps.LatLng(60.15942577147994, 25.092215538024902),
        new google.maps.LatLng(60.15765332714606, 25.09328842163086),
        new google.maps.LatLng(60.15558179517417, 25.09152889251709),
        new google.maps.LatLng(60.15370235425736, 25.09324550628662),
        new google.maps.LatLng(60.153040252886626, 25.09723663330078),
        new google.maps.LatLng(60.15340334238627, 25.103416442871094),
        new google.maps.LatLng(60.15530415725744, 25.102901458740234),
        new google.maps.LatLng(60.15583807424682, 25.103158950805664),
        new google.maps.LatLng(60.15459937355298, 25.106635093688965),
        new google.maps.LatLng(60.15229270305451, 25.106334686279297),
        new google.maps.LatLng(60.151182026202235, 25.11054039001465),
        new google.maps.LatLng(60.1514169802039, 25.119552612304688),
        new google.maps.LatLng(60.152506290455314, 25.127792358398438),
        new google.maps.LatLng(60.154962445833206, 25.131611824035645),
        new google.maps.LatLng(60.15545365488861, 25.129637718200684),
        new google.maps.LatLng(60.15624384535904, 25.127277374267578),
        new google.maps.LatLng(60.15822991591224, 25.126633644104004),
        new google.maps.LatLng(60.1598314983052, 25.128350257873535),
        new google.maps.LatLng(60.16115541416126, 25.12723445892334),
        new google.maps.LatLng(60.16224440174394, 25.12650489807129),
        new google.maps.LatLng(60.162116287430635, 25.122127532958984),
        new google.maps.LatLng(60.16279955799712, 25.11899471282959),
        new google.maps.LatLng(60.16290631773987, 25.115175247192383),
        new google.maps.LatLng(60.16292766964683, 25.108909606933594),
        new google.maps.LatLng(60.162116287430635, 25.10423183441162),
        new google.maps.LatLng(60.16045075590866, 25.098567008972168),
        new google.maps.LatLng(60.159511188069885, 25.094575881958008), 
        
    ], tiedotVillinki, kalenteriVillinki, kuvaVillinki, 13);
        
    retket.push(villinki);    
        

        
        
    /* luodaan retkiä */ 
    var nimi = "Porkkala";
    var kuvaus = "Tällä retkellä kierrämme kauniin Suinon saaren. Monipuolisen melontareitin varrella pääsee ihastelemaan saaren kaunista luontoa, upeita näkymiä aavalle merelle sekä suloisia saaristohuviloita. Pysähdymme retken aikana luodolle nauttimaan kuumaa juotavaa ja retkieväitä. Jokainen osallistuja saa paikanpäältä lämpimän märkäpuvun ja tossut.";
    var kesto = '<b>'+"Kesto:"+'</b>'+" n. 3 tuntia (on mahdollista että retken kesto menee yli 3 tunnin).";
    var hinta = '<b>'+"Hinta:"+'</b>'+" 50€ (Kausikorttilaiset: 25€ ja sarjakorttilaiset: 3 * SUP-vuokra)"; 
    var tarvikkeet = '<b>'+"Mitä tarvitsen:"+'</b>'+" Kuoritakki/tuulitakki, pipo, ohuet hanskat, pyyhe, kuivat vaatteet, vesipullo, ja retkievästä.";
    var taso = '<b>'+"Retken taso:"+'</b>'+" Reitin taso on helppo ja melomme rauhallista tahtia osallistujien toiveiden mukaan. Retkelle osallistujilta vaadimme kuitenkin aikaisempaa SUP-melontakokemusta.";
    var lahto = '<b>'+"Lähtöpaikka:"+'</b>'+" Svinön Uimaranta. Suvisaarentie 9, Espoo. Tapaamme suurella hiekkaparkkipaikalla tien vieressä. Paikalle pääsee linja-autolla 145 sekä omalla autolla.";
    var sis = '<b>'+"Hintaan sis:"+'</b>'+" Kova sup-melontalauta, mela, pelastusliivit, märkäpuku ja tossut.";
    var huom = '<b>'+"Muuta huomioitavaa:"+'</b>'+" Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.";
    var tiedotPorkkala = new tiedot(nimi, kuvaus, kesto, hinta, tarvikkeet, taso, lahto, sis, huom);
    var saaPorkkala = new saa("Sää: Etelä-Helsinki", "Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.<p>Sääpalvelun tarjoaa Foreca</p>");
    var kalenteriPorkkala = new kalenteri("Tulevat retket: Midnight SUP / Eira - Töölönlahti", "Toistaiseksi ei päivämääriä");
    var kuvaPorkkala = new kuva("Kuvia Midnight-retkiltä", "images/supyoga.jpg");    
    var porkkala = new retki([  
        
        
        new google.maps.LatLng(60.00851224713561, 24.454236030578613),
        new google.maps.LatLng(60.008834027824285, 24.45582389831543),
        new google.maps.LatLng(60.007225093068755, 24.456725120544434),
        new google.maps.LatLng(60.00467208928044, 24.457411766052246),
        new google.maps.LatLng(60.001904324733495, 24.455394744873047),
        new google.maps.LatLng(59.998921745552465, 24.45234775543213),
        new google.maps.LatLng(59.995917437126245, 24.450631141662598),
        new google.maps.LatLng(59.99565991228063, 24.45359230041504),
        new google.maps.LatLng(59.99183972501014, 24.462733268737793),
        new google.maps.LatLng(59.99055192204061, 24.465737342834473),
        new google.maps.LatLng(59.98735366123218, 24.46526527404785),
        new google.maps.LatLng(59.9851211349558, 24.463205337524414),
        new google.maps.LatLng(59.983060207809096, 24.46603775024414),
        new google.maps.LatLng(59.980827391927946, 24.456682205200195),
        new google.maps.LatLng(59.98014034135802, 24.450931549072266),
        new google.maps.LatLng(59.980655630622195, 24.446382522583008),
        new google.maps.LatLng(59.97906679629742, 24.440889358520508),
        new google.maps.LatLng(59.977864384500954, 24.436168670654297),
        new google.maps.LatLng(59.97593184548288, 24.43385124206543),
        new google.maps.LatLng(59.97610363129646, 24.429731369018555),
        new google.maps.LatLng(59.97567416509143, 24.42561149597168),
        new google.maps.LatLng(59.977864384500954, 24.423208236694336),
        new google.maps.LatLng(59.980655630622195, 24.422435760498047),
        new google.maps.LatLng(59.98353251494715, 24.424667358398438), 
        
    ], tiedotPorkkala, kalenteriPorkkala, kuvaPorkkala, 13);
        
    retket.push(porkkala);        
        
        
        
        
     /* luodaan retkiä */ 
    var nimi = "Itä-Helsingin sisäsaaristo";
    var kuvaus = "Tällä retkellä kierrämme kauniin Suinon saaren. Monipuolisen melontareitin varrella pääsee ihastelemaan saaren kaunista luontoa, upeita näkymiä aavalle merelle sekä suloisia saaristohuviloita. Pysähdymme retken aikana luodolle nauttimaan kuumaa juotavaa ja retkieväitä. Jokainen osallistuja saa paikanpäältä lämpimän märkäpuvun ja tossut.";
    var kesto = '<b>'+"Kesto:"+'</b>'+" n. 3 tuntia (on mahdollista että retken kesto menee yli 3 tunnin).";
    var hinta = '<b>'+"Hinta:"+'</b>'+" 50€ (Kausikorttilaiset: 25€ ja sarjakorttilaiset: 3 * SUP-vuokra)"; 
    var tarvikkeet = '<b>'+"Mitä tarvitsen:"+'</b>'+" Kuoritakki/tuulitakki, pipo, ohuet hanskat, pyyhe, kuivat vaatteet, vesipullo, ja retkievästä.";
    var taso = '<b>'+"Retken taso:"+'</b>'+" Reitin taso on helppo ja melomme rauhallista tahtia osallistujien toiveiden mukaan. Retkelle osallistujilta vaadimme kuitenkin aikaisempaa SUP-melontakokemusta.";
    var lahto = '<b>'+"Lähtöpaikka:"+'</b>'+" Svinön Uimaranta. Suvisaarentie 9, Espoo. Tapaamme suurella hiekkaparkkipaikalla tien vieressä. Paikalle pääsee linja-autolla 145 sekä omalla autolla.";
    var sis = '<b>'+"Hintaan sis:"+'</b>'+" Kova sup-melontalauta, mela, pelastusliivit, märkäpuku ja tossut.";
    var huom = '<b>'+"Muuta huomioitavaa:"+'</b>'+" Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.";
    var tiedotHelsinki = new tiedot(nimi, kuvaus, kesto, hinta, tarvikkeet, taso, lahto, sis, huom);
    var saaHelsinki = new saa("Sää: Etelä-Helsinki", "Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.<p>Sääpalvelun tarjoaa Foreca</p>");
    var kalenteriHelsinki = new kalenteri("Tulevat retket: Midnight SUP / Eira - Töölönlahti", "Toistaiseksi ei päivämääriä");
    var kuvaHelsinki = new kuva("Kuvia Midnight-retkiltä", "images/supyoga.jpg");    
    var helsinki = new retki([  
        
        
        new google.maps.LatLng(60.1854035303126, 25.038270950317383),
        new google.maps.LatLng(60.18463537870094, 25.040502548217773),
        new google.maps.LatLng(60.186427704506514, 25.045995712280273),
        new google.maps.LatLng(60.188049248309405, 25.04908561706543),
        new google.maps.LatLng(60.19058808365017, 25.047712326049805),
        new google.maps.LatLng(60.19203875854727, 25.049514770507812),
        new google.maps.LatLng(60.192358751731966, 25.056509971618652),
        new google.maps.LatLng(60.19331871256899, 25.059900283813477),
        new google.maps.LatLng(60.193745352818084, 25.06208896636963),
        new google.maps.LatLng(60.19545185835815, 25.063891410827637),
        new google.maps.LatLng(60.19649704918505, 25.06633758544922),
        new google.maps.LatLng(60.19596379271815, 25.075435638427734),
        new google.maps.LatLng(60.193916007364926, 25.08054256439209),
        new google.maps.LatLng(60.19242274999457, 25.081615447998047),
        new google.maps.LatLng(60.19095075838491, 25.07882595062256),
        new google.maps.LatLng(60.1898413877556, 25.075221061706543),
        new google.maps.LatLng(60.188923995261575, 25.07183074951172),
        new google.maps.LatLng(60.18696111591289, 25.068955421447754),
        new google.maps.LatLng(60.186150327150294, 25.064363479614258),
        new google.maps.LatLng(60.186747752390296, 25.060415267944336),
        new google.maps.LatLng(60.188006577130146, 25.057368278503418),
        new google.maps.LatLng(60.18696111591289, 25.04809856414795),
        new google.maps.LatLng(60.18536085569452, 25.042004585266113),   
        
    ], tiedotHelsinki, kalenteriHelsinki, kuvaHelsinki, 13);
        
    retket.push(helsinki);            
    
    
        
        /* luodaan retkiä */ 
    var nimi = "SUP & Breakfast";
    var kuvaus = "Tällä retkellä kierrämme kauniin Suinon saaren. Monipuolisen melontareitin varrella pääsee ihastelemaan saaren kaunista luontoa, upeita näkymiä aavalle merelle sekä suloisia saaristohuviloita. Pysähdymme retken aikana luodolle nauttimaan kuumaa juotavaa ja retkieväitä. Jokainen osallistuja saa paikanpäältä lämpimän märkäpuvun ja tossut.";
    var kesto = '<b>'+"Kesto:"+'</b>'+" n. 3 tuntia (on mahdollista että retken kesto menee yli 3 tunnin).";
    var hinta = '<b>'+"Hinta:"+'</b>'+" 50€ (Kausikorttilaiset: 25€ ja sarjakorttilaiset: 3 * SUP-vuokra)"; 
    var tarvikkeet = '<b>'+"Mitä tarvitsen:"+'</b>'+" Kuoritakki/tuulitakki, pipo, ohuet hanskat, pyyhe, kuivat vaatteet, vesipullo, ja retkievästä.";
    var taso = '<b>'+"Retken taso:"+'</b>'+" Reitin taso on helppo ja melomme rauhallista tahtia osallistujien toiveiden mukaan. Retkelle osallistujilta vaadimme kuitenkin aikaisempaa SUP-melontakokemusta.";
    var lahto = '<b>'+"Lähtöpaikka:"+'</b>'+" Svinön Uimaranta. Suvisaarentie 9, Espoo. Tapaamme suurella hiekkaparkkipaikalla tien vieressä. Paikalle pääsee linja-autolla 145 sekä omalla autolla.";
    var sis = '<b>'+"Hintaan sis:"+'</b>'+" Kova sup-melontalauta, mela, pelastusliivit, märkäpuku ja tossut.";
    var huom = '<b>'+"Muuta huomioitavaa:"+'</b>'+" Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.";
    var tiedotBreku = new tiedot(nimi, kuvaus, kesto, hinta, tarvikkeet, taso, lahto, sis, huom);
    var saaBreku = new saa("Sää: Etelä-Helsinki", "Retkillämme on säävaraus. Ilmoitamme edeltävällä viikolla mikäli retki joudutaan perumaan. Retken toteutumiseen tarvitsemme turvalliset sääolosuhteet.<p>Sääpalvelun tarjoaa Foreca</p>");
    var kalenteriBreku = new kalenteri("Tulevat retket: Midnight SUP / Eira - Töölönlahti", "Toistaiseksi ei päivämääriä");
    var kuvaBreku = new kuva("Kuvia Midnight-retkiltä", "images/supyoga.jpg");    
    var breku = new retki([  
        
        
        
        new google.maps.LatLng(60.15359556461562, 24.943599700927734),
        new google.maps.LatLng(60.153339268060094, 24.94746208190918),
        new google.maps.LatLng(60.15365963844227, 24.95093822479248),
        new google.maps.LatLng(60.15393729024815, 24.9534273147583),
        new google.maps.LatLng(60.1532324772389, 24.95540142059326),
        new google.maps.LatLng(60.15216454994801, 24.958019256591797),
        new google.maps.LatLng(60.1504557941272, 24.961280822753906),
        new google.maps.LatLng(60.14876831060311, 24.96145248413086),
        new google.maps.LatLng(60.14836244721602, 24.96394157409668),
        new google.maps.LatLng(60.14733708581839, 24.962611198425293),
        new google.maps.LatLng(60.14759342916527, 24.959306716918945),
        new google.maps.LatLng(60.14853333767379, 24.95621681213379),
        new google.maps.LatLng(60.14964410400151, 24.952569007873535),
        new google.maps.LatLng(60.15004995156907, 24.948148727416992),
        new google.maps.LatLng(60.15054123402743, 24.945788383483887),
        new google.maps.LatLng(60.15160921404731, 24.945530891418457),
        new google.maps.LatLng(60.152629102582466, 24.944608211517334),
        new google.maps.LatLng(60.15332858899359, 24.942376613616943),
        
    ], tiedotBreku, kalenteriBreku, kuvaBreku, 13);
        
    retket.push(breku);      
        
        
    
    // luodaan retkille ikonit
    var k = 0;
    while(k < retket.length){
        var retki = retket[k]
    
            /* luodaan retken ikoneita */ 
        
            var aloitusikoni = new google.maps.Marker({
                  position: { lat: retki.koordinaatit[0].lat(), lng: retki.koordinaatit[0].lng()},
                  map: map,
                  icon: image2,
                  retkenNumero: k
            }); 
        
            var info = new google.maps.Marker({
                          position: { lat: retki.koordinaatit[0].lat()+0.007, lng: retki.koordinaatit[0].lng()+0.005 },
                          map: map,
                          icon: imageinfo,
                          retkenNumero: k,
                          sijaintiVakio: 1
            })

            /*
            var saa = new google.maps.Marker({
                          position: { lat: retki.koordinaatit[0].lat()+0.007, lng: retki.koordinaatit[0].lng()+0.012 },
                          map: map,
                          icon: imagesaa,
                          retkenNumero: k,
                          sijaintiVakio: 2
            })
            */

            var kalenteri = new google.maps.Marker({
                          position: { lat: retki.koordinaatit[0].lat()+0.007, lng: retki.koordinaatit[0].lng()+0.012 },
                          map: map,
                          icon: imagekalenteri,
                          retkenNumero: k,
                          sijaintiVakio: 2
            })

            var kuvat = new google.maps.Marker({
                          position: { lat: retki.koordinaatit[0].lat()+0.007, lng: retki.koordinaatit[0].lng()+0.019 },
                          map: map,
                          icon: image,
                          retkenNumero: k,
                          sijaintiVakio: 3
            });


            /* lisätään retken ikonit listaan */
        
            retki.ikonit.push(aloitusikoni);
            retki.ikonit.push(info);
            //retki.ikonit.push(saa);
            retki.ikonit.push(kalenteri);
            retki.ikonit.push(kuvat);
        
        k++;
    
    }
        
        
        
    /*     Ikonien skaalaus       */
        
    function skaalaaIkoneita(skaalauksenMaara, kartta, nouseeko, takaisinPerus){
        var i = 0;
        while(i < retket.length){
            var retki = retket[i];
            if(retki.onkoAvattu){
                for( var j = 1; j < retki.ikonit.length; j++){
                    var ikoni = retki.ikonit[j];
                    
                    if(!takaisinPerus){
                        ikoni.icon.size.width = skaalauksenMaara;
                        ikoni.icon.size.height = skaalauksenMaara;
                        if(nouseeko){
                            ikoni.position.A -= 0.0025;
                            ikoni.position.F -= ikoni.sijaintiVakio * 0.002;
                        } else {
                            ikoni.position.A += 0.0025;
                            ikoni.position.F += ikoni.sijaintiVakio * 0.002;
                        }
                    } else {
                        ikoni.icon.size.width = skaalauksenMaara;
                        ikoni.icon.size.height = skaalauksenMaara;
                        ikoni.position.A = retki.koordinaatit[0].lat()+0.007;
                        ikoni.position.F = retki.koordinaatit[0].lng()+0.007+(0.007*(ikoni.sijaintiVakio-1));
                        
                    }
                    ikoni.setMap(null);
                    ikoni.setMap(kartta);
                }
            }
                
            i++;    
        }
    }
        