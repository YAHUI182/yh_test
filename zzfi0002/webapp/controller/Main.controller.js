sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("zzfi0002.controller.Main", {

		onInit: function () {
			// this._LocalData = this.getOwnerComponent().getModel("localModel");
			// this._ODataModel = this.getOwnerComponent().getModel();
			// var that = this;
			// 販売組織
			// that._ODataModel.read("/SalesOrganizSHSet", {
			// 	success: function (oData) {
			// 		that._LocalData.setProperty("/F4Salesorganization", oData.results);
			// 	},
			// 	error: function (oError) {}
			// });
			// // 営業所
			// that._ODataModel.read("/SalesOfficeSHSet", {
			// 	success: function (oData) {
			// 		that._LocalData.setProperty("/F4Salesoffice", oData.results);
			// 	},
			// 	error: function (oError) {}
			// });
		}
	});
});