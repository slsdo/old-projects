function mainmenu(){
// $(" #nav ul ").css({display: "none"}); // Opera Fix
$(" #nav li").hover(function(){
		// $(this).find('ul:first').css({visibility: "visible",display: "none"}).show(400);
		$(this).find('ul:first').css({opacity:0, visibility: "visible"}).animate({opacity:0.9},600);
		},function(){
		$(this).find('ul:first').css({visibility: "hidden"});
		});
}
 
 $(document).ready(function(){					
	mainmenu();
});