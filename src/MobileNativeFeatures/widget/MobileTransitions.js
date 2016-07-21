/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, document, logger, alert */
/*mendix */
/*
    PageTransitionsNoContext
    ========================

    @file      : PageTransitionsNoContext.js
    @version   : 1.0
    @author    : Bailey Everitt
    @date      : Tue, 14 Jul 2015 16:41:23 GMT
    @copyright :
    @license   : MIT

    Documentation
    ========================
    This widget is used in conjunction with PhoneGap builds to utilize the Native Page Transitions plugin (https://github.com/Telerik-Verified-Plugins/NativePageTransitions)
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare", "mxui/widget/_WidgetBase",
    "dojo/_base/lang", "dojo/on", "dojo/ready", "dojo/aspect", "dojo/query"
], function (declare, _WidgetBase, lang, on, ready, aspect, query) {
    "use strict";

    // Declare widget's prototype.
    return declare("MobileNativeFeatures.widget.MobileTransitions", [_WidgetBase], {
        // _TemplatedMixin will create our dom node using this HTML template
        // Parameters configured in the Modeler.
        clsName: null,
        direction: null,
		fixedPixelsTop: 0,
		fixedPixelsBottom: 0,

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
		_listenerHandle: null,
		_observer: null,

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            ready(lang.hitch(this, this._setupMutationObserver));
			aspect.after(this.mxform, "onLoading", lang.hitch(this, this._prepTransition));
			aspect.after(this.mxform, "onNavigation", lang.hitch(this, this._fireTransition));
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
		uninitialize: function () {
			logger.debug(this.id + ".uninitialize");
			// Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
			if (this._observer) {
				this._observer.disconnect();
			}
			//Disconnect any listeners
			if (this._listenerHandle) {
				this._listenerHandle.remove();
				this._listenerHandle = null;
			}
		},

		_setupMutationObserver: function () {

			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

			this._observer = new MutationObserver(lang.hitch(this, this._setupListeners));

			// define what element should be observed by the observer
			// and what types of mutations trigger the callback
			this._observer.observe(document, {
				subtree: true,
				childList: true,
				attributes: false,
				characterData: false,
				attributeOldValue: false,
				characterDataOldValue: false
			});

			this._setupListeners();
		},

		_setupListeners: function () {
            if (this._listenerHandle) {
				this._listenerHandle.remove();
				this._listenerHandle = null;
			}

            if (typeof window.plugins !== "undefined") {

                if (typeof window.plugins.nativepagetransitions !== "undefined") {
					if (this.direction === "fade") {
						this._listenerHandle = query("."+this.clsName).on("click", lang.hitch(this, function () {
							window.plugins.nativepagetransitions.nextTransition = this.direction;
							window.plugins.nativepagetransitions.nextOptions = {
								"duration"       :  this.duration, // in milliseconds (ms), default 400
								"iosdelay"       :   -1, // ms to wait for the iOS webview to update before animation kicks in, default 60
								"androiddelay"   :   -1
							};
						}));
					} else {

						this._listenerHandle = query("."+this.clsName).on("click", lang.hitch(this, function () {
							window.plugins.nativepagetransitions.nextTransition = this.direction;
							window.plugins.nativepagetransitions.nextOptions = {
								"direction": this.direction, // "left|right|up|down", default "left" (which is like "next")
								"duration": this.duration, // in milliseconds (ms), default 400
								"slowdownfactor": 2, // overlap views (higher number is more) or no overlap (1), default 4
								"iosdelay": -1, //defer transitions until they"re called later ////60, // ms to wait for the iOS webview to update before animation kicks in, default 60
								"androiddelay": -1, //defer transitions until they"re called later ////70 // same as above but for Android, default 70
								"winphonedelay": 200, // same as above but for Windows Phone, default 200,
								"fixedPixelsTop": this.fixedPixelsTop, // the number of pixels of your fixed header, default 0 (iOS and Android)
								"fixedPixelsBottom": this.fixedPixelsBottom // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
							};
						}));
					}
                }
            } else {
                console.log("page transition plugin not found");
            }
        },

		_prepTransition: function(deferred) {
			//instead of setting up a pending when a button is clicked, we're just going to leave options on the plugin object, then prep it before onNavigation.
			//Then we'll call the actual animation after onNavigation
			//This should solve a bunch of problems with taking a screenshot too early, and covering up things like errors

			if (window.plugins && typeof window.plugins.nativepagetransitions !== "undefined" && window.plugins.nativepagetransitions.nextTransition) {
				//clean up any pending transitions, in case they didn't get fired yet.
				//Otherwise you can mess up the plugin by creating 2 screenshots and one of them never gets removed
				this._cancelTransition();

				if (window.plugins.nativepagetransitions.nextTransition === "fade") {
					window.plugins.nativepagetransitions.fade(
						window.plugins.nativepagetransitions.nextOptions,
						function (msg) {
							//console.log("success: " + msg);
						}, // called when the animation has finished
						function (msg) {
							alert("error: " + msg);
						} // called in case you pass in weird values
					);
				} else {
					window.plugins.nativepagetransitions.slide(
						window.plugins.nativepagetransitions.nextOptions,
						function (msg) {
							//console.log("success: " + msg);
						}, // called when the animation has finished
						function (msg) {
							alert("error: " + msg);
						} // called in case you pass in weird values
					);
				}
				window.plugins.nativepagetransitions.nextTransition = null;
				window.plugins.nativepagetransitions.nextOptions = null;
			}

			//set a limit on how long we're going to keep the transition waiting, in case something breaks
			setTimeout(this._cancelTransition, 5000);

			return deferred;
		},

		_fireTransition: function(deferred) {
			//Run whatever pending transition is waiting
			if (window.plugins && typeof window.plugins.nativepagetransitions !== "undefined") {
				window.plugins.nativepagetransitions.executePendingTransition(
				  function (msg) {console.log("success: " + msg);}, // called when the animation has finished
				  function (msg) {alert("error: " + msg);} // called in case you pass in weird values
				);
			}

			return deferred;
		},

    	_cancelTransition: function() {
			window.plugins.nativepagetransitions.cancelPendingTransition(
			  function (msg) {} // called when the screenshot was hidden (almost instantly)
			);
    	}
    });
});

require(["MobileNativeFeatures/widget/MobileTransitions"]);
