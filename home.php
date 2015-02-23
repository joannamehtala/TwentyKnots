                  
<?php
$title = 'Home Page';
$contents = '
                  <script src="//use.typekit.net/pwf2wwo.js"></script>
                  <script>try{Typekit.load();}catch(e){}</script>
                  <div id="logo" alt="TwentyKnots"></div>
                  <div id="nav-container" class="navigation-index section group">
                      <ul>
                        <div class="closed">
                                <img class="menu_logo" src="images/mobilelogos2015/activitylogo.png">
                                <img class="dots_logo" src="images/mobilelogos2015/dotslogo.png">
                                <h4>elämykset</h4>
                                <p>Merellinen tarjontamme</p>
                                <ul class="submenu">
                                    <li><a class="page" href="purjelautailu.php"><h4>purjelautailu</h4></a></li>
                                    <li><a class="page" id="sup" href="sup.php"><h4>sup-melonta</h4></a></li>
                                    <li><a class="page" href=""><h4>retket</h4></a></li>
                                    <li><a class="page" href=""><h4>rib-veneily</h4></a></li>
                                </ul>
                                <div class="clear"></div>
                        </div>
                        <div>
                          <img class="menu_logo" src="images/mobilelogos2015/peoplelogo.png">
                          <a href=""><h4>yritykset</h4></a>
                          <p>Elämyksellinen päivä yritykselle tai ryhmälle</p>
                        </div>
                        <div class="closed">
                                <img class="menu_logo sijainti" src="images/mobilelogos2015/sijaintilogo.png">
                                <img class="dots_logo" src="images/mobilelogos2015/dotslogo.png">
                                <h4>sijainti</h4>
                                <p>Missä, Milloin ja Miten?</p>
                                <ul class="submenu">
                                    <li><a href=""><h4>helsinki</h4></a></li>
                                    <li><a href=""><h4>espoo</h4></a></li>
                                    <li><a href=""><h4>kirkkonummi</h4></a></li>
                                </ul>
                                <div class="clear"></div>
                        </div>
                        <div>
                          <img class="menu_logo" src="images/mobilelogos2015/calendarlogo.png">
                          <a href=""><h4>Varaukset</h4></a>
                          <p>Näin pääset mukaan vesille!</p>
                        </div>
                        <div>
                          <img class="menu_logo" src="images/mobilelogos2015/infologo.png">
                          <img class="dots_logo" src="images/mobilelogos2015/dotslogo.png">
                          <a href=""><h4>twentyknots</h4></a>
                          <p>Our team, thinking and community</p>
                        </div>
                      </ul>
                      <img class="arrow_logo" src="images/mobilelogos2015/arrowdownlogobw.png">
                  </div>
                  <div class="content-wrapper">
                          <div id="sub-wrapper1" class="sub-wrapper">
                              <h3>TwentyKnots</h3>
                              <p class="bread index">
                                TwentyKnots on elämyspalveluyritys ja Pohjoismaiden ensimmäinen ASI-akreditoitu (Academy of Surfing Instructors) SUP koulu. Tarjoamme kokemuksia luonnon ja veden äärellä, järjestämme toiminnallisia tiimipäiviä, kursseja ja tapahtumia pienistä tempauksista suurempiin kokonaisuuksiin. Lajitarjontamme koostuu SUP (stand-up paddle) -melonnasta, purjelautailusta, RIB-veneilystä sekä erilaisista elämyksistä luonnon parissa. Tiimimme koostuu reippaista ja intohimoisista ohjaajista, jotka inspiroivat ja auttavat uusien elämysten löytämisessä.
                                <br><br>
                                Nähdään rannassa! //TwentyKnots Team
                              </p>
                          </div>
                          <div id="sub-wrapper2" class="sub-wrapper">
                                <div class="infobox">
                                    <h3>CONTACT US!</h3>
                                    <a href="">info@twentyknots.fi</a>
                                    <a href="">+358 44 7688464</a>
                                </div>
                                <div class="infobox">
                                    <h3>FOLLOW US!</h3>
                                    <a href="">Facebook</a>
                                    <a href="">Instagram</a>
                                    <a href="">Vimeo</a>
                                </div>
                                <div class="infobox clearright">
                                    <h3>UUTISKIRJE</h3>
                                    <a href="">info@twentyknots.fi</a>
                                    <a href="">+358 44 7688464</a>
                                </div>
                                <div class="clear"></div>
                          </div>
                          <div id="sub-wrapper3" class="sub-wrapper">
                                <div class="infobox yhteistyo clear">
                                    <h3>YHTEISTYÖSSÄ:</h3>
                                </div>
                                <div class="infobox imgbox clearleft">
                                    <img src="images/hiltonbw.png">
                                </div>
                                <div class="infobox extrapadding imgbox">
                                  <img src="images/langvik.png">
                                </div>
                                <div class="infobox imgbox">
                                  <img src="images/haglofs.jpg">  
                                </div>
                                <div class="infobox extrapadding imgbox">
                                    <img src="images/varustenet.gif">
                                </div>      
                          </div>
                  </div>
                  <script>
                      //setActivePage("home");
                  </script>
                  

';


if(getenv('HTTP_X_PJAX') == 'true'){
        echo $contents;
        echo "";
}else{
        include 'wrapper.php'; 
}
?>