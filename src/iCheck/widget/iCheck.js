/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console */
/*mendix */
/*
    iCheck
    ========================

    @file      : iCheck.js
    @version   : 0.1
    @author    : Chad Evans
    @date      : Wed, 08 Apr 2015 17:15:36 GMT
    @copyright : Mendix Technology BV
    @license   : Apache License, Version 2.0, January 2004

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require({
    packages: [{
        name: 'jquery',
        location: '../../widgets/iCheck/lib',
        main: 'jquery-1.11.2.min'
    }]
}, [
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text',
    'jquery', 'dojo/text!iCheck/widget/template/iCheck.html'
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text, $, widgetTemplate) {
    'use strict';

    // Declare widget's prototype.
    return declare('iCheck.widget.iCheck', [_WidgetBase, _TemplatedMixin], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // Parameters configured in the Modeler.
        mfToExecute: "",
        skin: "",
        colorscheme: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handle: null,
        _handleAttrArray: null,
        _contextObj: null,
        _objProperty: null,
        _collection: null,
        _associated: false,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            this._objProperty = {};
            this._handleAttrArray = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + '.postCreate');

            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');

            this._contextObj = obj;
            this._resetSubscriptions();

            if (!this._associated) {
                this._setup_iCheck();
                this._associated = true;
            }

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {

        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {

        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {

        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        _setupEvents: function () {
            this._collection = $(this.domNode).offsetParent();
        },

        _updateRendering: function () {
            this._collection.iCheck('update');
        },

        _resetSubscriptions: function () {
            // Release handle on previous object, if any.
            var index, widget = this;
            
            if (this._handle) {
                this.unsubscribe(this._handle);
                this._handle = null;
            }
            
            for (index = 0; index < this._handleAttrArray.length; index++)
            {
                this.unsubscribe(this._handleAttrArray[index]);
            }
            this._handleAttrArray = [];

            if (this._contextObj) {
                this._handle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: lang.hitch(this, this._updateRendering)
                });
                
                this._contextObj.getAttributes().map(function (item) {
                    if (widget._contextObj.isBoolean(item)) {
                        var handle = widget.subscribe({
                            guid: widget._contextObj.getGuid(),
                            attr: item,
                            callback: lang.hitch(widget, widget._updateRendering)
                        });
                        widget._handleAttrArray.push(handle);
                    }
                });
                //                this._handleAttr = this.subscribe({
                //                    guid: this._contextObj.getGuid(),
                //                    attr: 'Valid',
                //                    callback: lang.hitch(this, this._updateRendering)
                //                });
                //                this._handleAttr = this.subscribe({
                //                    guid: this._contextObj.getGuid(),
                //                    attr: 'Active',
                //                    callback: lang.hitch(this, this._updateRendering)
                //                });
            }
        },

        _setup_iCheck: function () {
            var widget = this;
            this._collection.iCheck({
                checkboxClass: 'icheckbox_' + this.skin + '-' + this.colorscheme,
                radioClass: 'iradio_' + this.skin + '-' + this.colorscheme
            }).on('ifClicked', function (event) {
                $(event.target).trigger('click');
            });
        }
    });
});