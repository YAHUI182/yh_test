/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "zzfi0002/model/models"
],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("zzfi0002.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                //设置上个月
                const date = new Date();
                this.getModel("localModel").setProperty("/Yearmonth", new Date(date.getFullYear(), date.getMonth() - 1, 1));

            }
        });
    }
);