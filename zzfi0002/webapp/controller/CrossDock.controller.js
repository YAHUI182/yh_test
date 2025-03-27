sap.ui.define([
	"./BaseController",
	"zzfi0002/model/formatter",
	"sap/ui/model/Filter",
	"sap/m/MessageBox"
], function (BaseController, formatter, Filter, MessageBox) {
	"use strict";

	var excuteSure = true,
		iSuccess = 0,
		iFailed = 0;
	return BaseController.extend("zzfi0002.controller.CrossDock", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf SD.salesdiffprocess.view.SalesOfficeBill
		 */
		onInit: function () {
			// this.oTable = this.byId("idReportTable");
			this.initBase();
		},

		onBeforeRebindTable: function (oEvent) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyyMM"
			});
			var sYearMonth = oDateFormat.format(this.getModel("localModel").getProperty("/Yearmonth"), false);


			this.getModel("localModel").setProperty("/key", {
				Yearmonth: sYearMonth
			});

			var yearMonthFilter = new Filter({
				path: "Yearmonth",
				operator: "EQ",
				value1: sYearMonth
			});
			var filters = oEvent.getParameters().bindingParams.filters;
			if (!filters) {
				filters = [];
			}
			filters.push(yearMonthFilter);
		},
		onSearch: function (oEvent) {
			this.getModel().resetChanges();
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},
		onSave: function (oEvent) {
			var that = this;
			var oKey = this.getModel("localModel").getProperty("/key");
	
			if (!oKey) {
				MessageBox.error(this.getResourceBundle().getText("NoneSelected"));
				return;
			}
			this.getView().setBusy(true);

			
			this.getModel().callFunction("/SaveCrossDock", {
				method: "POST",
				urlParameters: {
					Yearmonth: oKey.Yearmonth
				},
				success: function () {
					that.getView().setBusy(false);
				},
				error: function () {
					that.getView().setBusy(false);
				}
 

			});

		},


		/**
 * event of press button for show MessagePopover
 * @param {*} oEvent
 */
		onMessagePopoverPress: function (oEvent) {
			this._getMessagePopover().then(
				function (oFragment) {
					oFragment.openBy(this.byId("messageButton"));
				}.bind(this)
			);
		},
		/**
		 * get MessagePopover instance, renderering first if it does not exist.
		 */
		_getMessagePopover: function () {
			// create popover lazily (singleton)
			var that = this;
			return new Promise(function (resolve, reject) {
				if (!that._oMessagePopover) {
					// create popover lazily (singleton)
					sap.ui.core.Fragment.load({
						id: that.getView().getId(),
						name: "zzfi0002.view.MessagePopover",
						controller: this,
					})
						.then((oFragment) => {
							// Load完了後に表示
							that._oMessagePopover = oFragment;
							// add dependent to the view
							that.getView().addDependent(oFragment);
							// oFragment.openBy(oSource);
							resolve(oFragment);
						})
						.catch((oError) => { });
					// this._oMessagePopover = sap.ui.xmlfragment(
					//   this.getView().getId(),
					//   "SD.receiptprint.view.MessagePopover",
					//   this
					// );
					// this.getView().addDependent(this._oMessagePopover);
				} else {
					resolve(that._oMessagePopover);
				}
			});
		},

		
	});
});