
/*global logger, define, require, mx*/
/*jslint nomen:true */
/*
    MobileActionMenu
    ========================

    @file      : MobileActionMenu.js
    @version   : 
    @author    : Eric Tieniber
    @date      : Tues, 05 July 2016
    @copyright : 
    @license   : Apache 2

    Documentation
    ========================
    A widget provides a button that triggers a mobile native action menu, tied to a list of microflows.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "dojo/dom-class",
    "dojo/_base/lang",
    "dojo/text!MobileNativeFeatures/widget/template/MobileActionMenu.html"
], function (declare, _WidgetBase, _TemplatedMixin, dojoClass, dojoLang, widgetTemplate) {
	"use strict";

	// Declare widget's prototype.
	return declare("MobileNativeFeatures.widget.MobileActionMenu", [_WidgetBase, _TemplatedMixin], {
		// _TemplatedMixin will create our dom node using this HTML template.
		templateString: widgetTemplate,

		// DOM elements
		theButton: null,

		// Parameters configured in the Modeler.
		buttonClass: "",
		buttonText: "",
		
		title: "",
		cancelButton: false,
		cancelButtonText: "",
		deleteButton: false,
		deleteButtonText: "",
		deleteButtonMF: "",
		deleteButtonProgress: false,
		deleteButtonModal: false,
		deleteButtonMessage: "",
		deleteButtonPageChange: false,
		
		buttons: null,
		//buttons. text,microflow,progress,modal,message,pageChange

		//Internal variables
		_contextObj: null,
		_listener: null,

		// mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
		update: function (obj, callback) {
			logger.debug(this.id + ".update");

			this._contextObj = obj;
			
			if (window.plugins && window.plugins.actionsheet) {
				this._setupEvents();
				this._updateRendering();
			}

			callback();
		},

		// Rerender the interface.
		_updateRendering: function () {
			logger.debug(this.id + "._updateRendering");
			this.theButton.innerHTML = this.buttonText;

			if (this.buttonClass !== "") {
				dojoClass.add(this.theButton, this.buttonClass);
			}
		},

		_setupEvents: function () {
			if (this._listener) {
				this.disconnect(this._listener);
			}
			this._listener = this.connect(this.theButton, "click", this._showMenu);
		},
		
		_showMenu: function () {
			var i, labels = [], options;
			
			for (i = 0; i < this.buttons.length; i += 1) {
				labels.push(this.buttons[i].text);
			}
			
			
			options = {
				androidTheme : window.plugins.actionsheet.ANDROID_THEMES.THEME_TRADITIONAL, // default is THEME_TRADITIONAL
				title: this.title,
				buttonLabels: labels,
				position: [20, 40] // for iPad pass in the [x, y] position of the popover
			};
			
			if (this.cancelButton) {
				options.addCancelButtonWithLabel = this.cancelButtonText;
				options.androidEnableCancelButton = true; // default false
				options.winphoneEnableCancelButton = true; // default false
			}
			if (this.deleteButton) {
				options.addDestructiveButtonWithLabel = this.deleteButtonText;
			}
			// Depending on the buttonIndex, you can now call shareViaFacebook or shareViaTwitter
			// of the SocialSharing plugin (https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin)
			window.plugins.actionsheet.show(options, dojoLang.hitch(this, this._primaryCallback));
		},
		
		_primaryCallback: function (buttonIndex) {
			var indexOfDelete = -1,
				indexOfCancel = -1,
				buttonIndexAdjusted = buttonIndex;
				
			if (buttonIndex) {
				//input is one-based button index
				buttonIndexAdjusted = buttonIndex - 1;
				//now its 0-based
				
				if (this.deleteButton) {
					indexOfDelete = 1;
					//take one more off the buttonIndex so it aligns with buttons[]
					buttonIndexAdjusted = buttonIndexAdjusted - 1;
				}
				if (this.cancelButton) {
					if (this.deleteButton) {
						indexOfCancel = this.buttons.length + 2;
					} else {
						indexOfCancel = this.buttons.length + 1;
					}
				}
					
				if (buttonIndex === indexOfCancel) {
				} else if (buttonIndex === indexOfDelete) {
					this._executeMicroflow(this.deleteButtonMF, this.deleteButtonProgress, this.deleteButtonModal, this.deleteButtonMessage, function () {});
				} else {
					this._executeMicroflow(this.buttons[buttonIndexAdjusted].microflow, this.buttons[buttonIndexAdjusted].progress, this.buttons[buttonIndexAdjusted].modal, this.buttons[buttonIndexAdjusted].message, function () {});
				}
				
			} else {
			}
		},
		
		_executeMicroflow: function (mf, progress, isModal, msg, success) {
			var modalString = "";
			if (progress) {
				if (isModal) {
					modalString = "modal";
				} else {
					modalString = "nonmodal";
				}
			}
			if (mf) {
				mx.ui.action(mf, {
					progress: modalString,
					progressMsg: msg,
					params: {
						applyto: "selection",
						//actionname: this.mfToExecute,
						guids: [this._contextObj.getGuid()]
					},
					store: {
						caller: this.mxform
					},
					callback: dojoLang.hitch(this, success),
					error: dojoLang.hitch(this, function (error) {
						logger.error(this.id + ": An error occurred while executing microflow: " + error.description);
					})
				}, this);
			}
		}
	});
});

require(["MobileNativeFeatures/widget/MobileActionMenu"], function () {
	"use strict";
});