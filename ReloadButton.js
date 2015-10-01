define(["jquery", "qlik", "text!./lib/css/reload_btn.css"], function($, qlik, cssContent) {
  
    $("<style>").html(cssContent).appendTo("head");

	return {
		paint: function ($element, layout) {
		                                           
            var app = qlik.currApp(this);  	
		  
		    //Check if Qlik Sense Desktop or Server
		  	var isPersonalMode = true;
		  
			var global = qlik.getGlobal();
			global.isPersonalMode( function ( reply ) {
				isPersonalMode = reply.qReturn;
			});
			
		    // Display Extension Visualization
            var html = html = '<a href="#" id="modal-open" class="btn btn-primary">Reload</a>'; 
            $element.html( html );
		
			// Open modal 
			$("#modal-open").click(
				function(event){
					event.preventDefault(); 
					
					$(this).blur() ;	
					
					// Check if modal is displayed 
					if($("#modal-overlay")[0]) return false ;
					
					// Add modal overlay
					$(".qv-panel-sheet").append('<div id="modal-overlay"></div>');
					$("#modal-overlay").fadeIn("slow");

					// Add modal panel
					$(".qv-panel-sheet").append('<div id="modal-content" style="display:none"><div id="modal-message"><h2>Are you sure to execute reload?</h2></div><div id="modal-checkbox"><input type="checkbox" id="partial" name="partial" value=""><label for="partial">Partial reload</label></div><div id="modal-botton"><a href="#" id="execute-reload" class="btn btn-primary"> OK </a><a href="#" id="modal-close" class="btn btn-default">Cancel</a></div></div>');					
					$("#modal-content").fadeIn("slow");
					
					// Close modal 
					$("#modal-overlay, #modal-close").unbind().click(
						function(event){
							event.preventDefault(); 
					
							$("#modal-content,#modal-overlay").fadeOut("slow",function(){
								$("#modal-content").remove();
								$("#modal-overlay").remove();
							});
						}
					);

					// Execute reload								
					$("#execute-reload").click(	
						function(event){
							event.preventDefault();
							
							// Check if reload is partial
							var isPartial = false;
							if($("#partial").prop('checked')) {
								isPartial = true;
							}
													
							// Remove modal
							$("#modal-content").remove();
							
							// Open loader circle
							$("#modal-overlay").append('<div class="loader">Loading...</div>');
							
							//console.log("isPersonalMode: " + isPersonalMode);
							//console.log("isPartial: " + isPartial);
							
							//Execute reload
							if ( isPersonalMode ) {
								app.doReload( 0, isPartial, false ).then( function () {
									app.doSave();
									$("#modal-overlay").remove();
								} );
							} else {
								// qlik.callRepository( '/qrs/app/' + appid + '/reload', 'POST' ).success( function ( reply ) {
								//	$("#modal-overlay").remove()
								// } );
								app.doReload( 0, isPartial, false ).then( function () {
									app.doSave();
									$("#modal-overlay").remove();
								} );
							}
						}										
					);					

						
				}
			);
		}
	};
} );


