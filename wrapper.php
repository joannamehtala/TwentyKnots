


<!doctype html>
<!--[if lt IE 9]>
  <html class="ie">
  <script src="dist/html5shiv.js"></script>
<![endif]-->
<!--[if gte IE 9]><!--><html class="no-js"><!--<![endif]-->
<!--
	The comment jumble above is handy for targeting old IE with CSS.
	http://paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/
-->

<head>
  <meta charset="utf-8">
  <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,700,900italic' rel='stylesheet' type='text/css'>
  <title>TwentyKnots SUP- ja Purjelautailuelämyksiä</title>
  <!-- Please don't add "maximum-scale=1" here. It's bad for accessibility. -->
  <meta name="viewport" content="width=device-width, initial-scale=1"/>

  <link rel="stylesheet" href="fonts.css">
  <link rel="stylesheet" href="main.css">

  <!-- Javascript (remember to move to bottom of page.) -->
  <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
  <script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
  <script type="text/javascript" src="jquery.cycle.lite.js"></script>
  <script src="jquery.pjax.js"></script>
  <script src="modernizr.js"></script>
  <script src="javascript.js"></script>
  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>
	<body>
			<div class="fullscreen background unselectable" data-img-width="1600" data-img-height="1064">
            </div>
			<div id="pjax-container">
				<?php echo $contents; ?>
			</div> 
			<script type="text/javascript">
                  /* on first page load we need to load homepage content with pjax*/
                  $( document ).ready(function() {
                    initContentPage();
                  });
            </script>
	</body>
</html>