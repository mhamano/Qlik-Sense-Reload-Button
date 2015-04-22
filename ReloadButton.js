define(["jquery", "qlik", "text!./lib/css/reload_btn.css", "text!./lib/css/jquery-ui.min.css", "./lib/js/jquery-ui.min"], function($, qlik, cssContent, jqueryUICSS, jqueryUI) {
  
    $("<style>").html(cssContent).appendTo("head");
	$("<style>").html(jqueryUICSS).appendTo("head");
 
	return {
		paint: function ($element, layout) {
                    
                      
            var app = qlik.currApp(this);  
          
            var html = html = '<a href="#" class="reload_btn">Reload</a><div class="myCustomScope" ></div><div id="show_dialog"></div>'; 
            $element.html( html );
			          
		                       
            $(".reload_btn").click(function(event){             
              	event.preventDefault();                          
				ShowJQueryConfirmDialog();              
            });
			
            // Display complete/cancellation message
			function ShowJQueryAlertDialog( strTitle, strComment ) {	
				$( "#show_dialog" ).html( strComment );

				$( "#show_dialog" ).dialog({
					modal: true,
					title: strTitle,
					buttons: {
						"OK": function() {
							$( this ).dialog( "close" );
						}
					}
				});
			}
          
			 // Display confirmation dialogue
			function ShowJQueryConfirmDialog() {
				var strTitle = "Confirmation";
				var strComment = "Are you sure to execute reload?";
				
				$( "#show_dialog" ).html( strComment );
				
				var d =  $( "#show_dialog" ).dialog({
                  	//autoOpen: false,
					modal: true,
					title: strTitle,
					buttons: {
						"OK": function() {
							$( this ).dialog( "close" );
							
							dispLoading("Reloading...");
                          
							//Execute reload
							app.doReload().then(function(){ 
								app.doSave();
								removeLoading();
								ShowJQueryAlertDialog( "Completed", "Reload execution completed" );
							});							
						},
						"Cancel": function() {
							$( this ).dialog( "close" );
							ShowJQueryAlertDialog( "Cancelled", "Reload was cancelled." );
						}
					}
				}).parent(".ui-dialog").wrap("<div class='myCustomScope'></div>");
			}
	
            // Start to display loading circle
			function dispLoading(msg){
				var dispMsg = "";
 
				if( msg != "" ){
					dispMsg = "<div class='loadingMsg'>" + msg + "</div>";
				}
				
				if($("#loading").size() == 0){
					$("body").append("<div id='loading'>" + dispMsg + "</div>");
				}	
			}
 
            // Stop to display loading circle
			function removeLoading(){
				$("#loading").remove();
			}
		}
	};
} );

