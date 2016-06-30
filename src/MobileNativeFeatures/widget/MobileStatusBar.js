/*global logger*/
/*
    MobileSpinner
    ========================

    @file      : MobileStatusBar.js
    @version   : 1.0
    @author    : Eric Tieniber
    @date      : Fri, 10 Jun 2016 20:32:51 GMT
    @copyright : 
    @license   : MIT

    Documentation
    ========================
    A widget that lets you control the color and presence of your mobile app's menu bar./>
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase"
], function (declare, _WidgetBase) {
    "use strict";

    // Declare widget's prototype.
    return declare("MobileNativeFeatures.widget.MobileStatusBar", [ _WidgetBase ], {

        // Parameters configured in the Modeler.
        backgroundColor: "",
		textColor: "white",
		showStatusBar: true,
		overlayWebView: false,


        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            if (typeof StatusBar !== 'undefined') {
				if (this.backgroundColor && StatusBar.backgroundColorByHexString) {
					StatusBar.backgroundColorByHexString(this.backgroundColor);
				}
				if (this.textColor === "white" && StatusBar.styleLightContent) {
					StatusBar.styleLightContent();
				} else {
					StatusBar.styleDefault();
				}														 
				if (this.showStatusBar) {StatusBar.show();} else {StatusBar.hide();}
				if (StatusBar.overlaysWebView) {StatusBar.overlaysWebView(this.overlayWebView);}				
			}
			
        }
    });
});

require(["MobileNativeFeatures/widget/MobileStatusBar"]);
