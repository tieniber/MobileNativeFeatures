/*global logger*/
/*
    MobileSpinner
    ========================

    @file      : MobileSpinner.js
    @version   : 1.0
    @author    : Eric Tieniber
    @date      : Fri, 10 Jun 2016 20:32:51 GMT
    @copyright : 
    @license   : MIT

    Documentation
    ========================
    A widget that overrides the default Mendix loading windows with mobile native ones, when available. Requires the cordova-plugin-spinner plugin to be included in your hybrid mobile app:
		<gap:plugin name="cordova-plugin-spinnerdialog" source="npm" />
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event"
], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent) {
    "use strict";

    // Declare widget's prototype.
    return declare("MobileNativeFeatures.widget.MobileSpinner", [ _WidgetBase ], {

        // Parameters configured in the Modeler.
        delay: 500,

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
		_showTimer: null,
		_showing: false,
		_showPending: false,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            logger.debug(this.id + ".constructor");
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            
			//if the spinner plugin exists, override the mx.ui.showProgress() and mx.ui.hideProgress() functions, but only if another copy of this widget hasn't already done so.
			if (window.plugins && window.plugins.spinnerDialog && !mx.ui.hideProgressOrig) {
				mx.ui.showProgress = this._showProgressReplacement.bind(this);
							
				if (!mx.ui.hideProgressOrig) {
					mx.ui.hideProgressOrig = mx.ui.hideProgress;
				}
				
				mx.ui.hideProgress = this._hideProgressReplacement.bind(this);
				mx.ui.hideProgressOrig(0);
			}
        },
		
		_showProgressReplacement: function (msg, modal) {
			if (!this._showTimer) {
				var self = this;
				this._showPending = true;
				this._showTimer = setTimeout(function() {
					self._showing = true;
					self._showPending = false;
					self._showTimer = null;
					window.plugins.spinnerDialog.show(msg, null, modal);	
				}, this.delay);
			}
		},

		_hideProgressReplacement: function (pid) {
			if (this._showPending) {
				clearTimeout(this._showTimer);
				this._showTimer = null;
				this._showPending = false;
				this._showing = false;
				window.plugins.spinnerDialog.hide();
			} else {
				this._showPending = false;
				this._showing = false;
				window.plugins.spinnerDialog.hide();
				if(pid !== null && pid !== undefined) {
					mx.ui.hideProgressOrig(pid);
				}
			}
		},
		
        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
          logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        }
    });
});

require(["MobileNativeFeatures/widget/MobileSpinner"]);
