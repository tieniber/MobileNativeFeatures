/*global logger*/
/*
    MobileHideSplash
    ========================

    @file      : MobileHideSplash.js
    @version   : 1.0
    @author    : Eric Tieniber
    @date      : Fri, 10 Jun 2016 20:32:51 GMT
    @copyright : 
    @license   : MIT

    Documentation
    ========================
    A widget that hides the PhoneGap/Cordova native splash screen. Requires the cordova-plugin-splashscreen plugin to be included in your hybrid mobile app. As of 6.5.1, this was in the default hybrid config file.
	Place this widget on your master layout, and use this in conjunction with this line in your config.xml file:
		preference name="AutoHideSplashScreen" value="false"
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase"
], function (declare, _WidgetBase) {
    "use strict";

    // Declare widget's prototype.
    return declare("MobileNativeFeatures.widget.MobileHideSplash", [ _WidgetBase ], {

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            
			//if the splashscreen plugin exists, hide it.
			if (navigator && navigator.splashscreen) {
				navigator.splashscreen.hide();
			}
        }
    });
});

require(["MobileNativeFeatures/widget/MobileHideSplash"]);
