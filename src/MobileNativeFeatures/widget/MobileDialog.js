/*global logger, define, require, dojo, mx*/
/*jslint nomen: true*/

/*
    MobileDialog
    ========================

    @file      : MobileDialog.js
    @version   : 1.0
    @author    : Eric Tieniber
    @date      : Fri, 10 Jun 2016 20:32:51 GMT
    @copyright : 
    @license   : MIT

    Documentation
    ========================
    A widget that overrides the default Mendix alerts and confirmation windows with mobile native ones, when available. Requires the cordova-plugin-dialogs plugin to be included in your hybrid mobile app:
		<gap:plugin name="cordova-plugin-dialogs" source="npm" />
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase"
], function (declare, _WidgetBase) {
    "use strict";

    // Declare widget's prototype.
    return declare("MobileNativeFeatures.widget.MobileDialog", [ _WidgetBase ], {

        // Parameters configured in the Modeler.

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            
			//if the dialog plugin exists, override the mx.ui.confirmation, info, warning, and error, but only if another copy of this widget hasn't already done so.
			if (navigator && navigator.notification && (typeof mx.ui.mobileDialogLoaded === "undefined" || mx.ui.mobileDialogLoaded === null || mx.ui.mobileDialogLoaded === false)) {
				mx.ui.mobileDialogLoaded = true;
				mx.ui.confirmation = this._confirmationReplacement;
				
				mx.ui.info = this._infoReplacement;
				mx.ui.warning = this._warningReplacement;
				mx.ui.error = this._errorReplacement;
			}
        },
		
		_confirmationReplacement: function (args) {
			//navigator.notification.confirm(message, confirmCallback, [title], [buttonLabels])
			navigator.notification.confirm(args.content, function (buttonNum) {
				if (buttonNum === 1) {
					args.handler();
				//Extra argument so other widgets can get a callback on the cancel button too
				} else if (buttonNum === 2) {
					if (window.plugins && window.plugins.nativepagetransitions) {
						window.plugins.nativepagetransitions.cancelPendingTransition(
							function (msg) {
								//console.log("success: " + msg)
							} // called when the screenshot was hidden (almost instantly)
						);
					}
					if (args.handlerCancel) {args.handlerCancel(); }
				}
			}, "Confirm", [args.proceed, args.cancel]);
		},
		
		_infoReplacement: function (msg, modal) {
			//navigator.notification.alert(message, alertCallback, [title], [buttonName])
			navigator.notification.alert(msg, null, "Info");
		},
		_warningReplacement: function (msg, modal) {
			//navigator.notification.alert(message, alertCallback, [title], [buttonName])
			navigator.notification.alert(msg, null, "Warning");
		},
		_errorReplacement: function (msg, modal) {
			//navigator.notification.alert(message, alertCallback, [title], [buttonName])
			navigator.notification.alert(msg, null, "Error");
		}
    });
});

require(["MobileNativeFeatures/widget/MobileDialog"]);
