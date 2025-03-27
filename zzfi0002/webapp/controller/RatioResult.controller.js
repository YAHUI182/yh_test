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
	return BaseController.extend("zzfi0002.controller.RatioResult", {
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
			var sCycleID = '';
			if (this.byId("smartFilterRatioResult")) {
				sCycleID = this.byId("smartFilterRatioResult").getFilterData().Zzcycle;
			}
			this.getModel("localModel").setProperty("/key", {
				Yearmonth: sYearMonth,
				CycleID: sCycleID
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
		onReverse: function (oEvent) {
			var that = this;
			var oKey = this.getModel("localModel").getProperty("/key");
			if (!oKey) {
				MessageBox.error(this.getResourceBundle().getText("NoneSelected"));
				return;
			}
			this.getView().setBusy(true);
			this.getModel().callFunction("/ReverseRatio", {
				method: "POST",
				urlParameters: {
					Yearmonth: oKey.Yearmonth,
					Cycle: oKey.CycleID
				},
				success: function () {
					that.getView().setBusy(false);
				},
				error: function () {
					that.getView().setBusy(false);
				}
			});




			// var aSelectedItems = this.oTable.getSelectedIndices();
			// var iLen = aSelectedItems.length;
			// var aDetach = [];
			// if (!iLen) {
			// 	MessageBox.error(this.getResourceBundle().getText("NoneSelected"));
			// 	return;
			// }
			// while (iLen--) {
			// 	var sPath = this.oTable.getContextByIndex(aSelectedItems[iLen]).getPath();
			// 	var oRow = this.getModel().getObject(sPath);
			// 	if (oRow.Keka === "S") {
			// 		MessageBox.error(this.getResourceBundle().getText("ExcuteCheckError"));
			// 		return;
			// 	}
			// 	oRow.Zdate = this.formatter.odataDate(this.getModel("localModel").getProperty("/localZdate"));
			// 	aDetach.push(oRow);
			// }
			// this.showConfirm(this.getResourceBundle().getText("buttonRegister"), this.getResourceBundle().getText("SureRegister"), function () {
			// 	that.finallyCreateItems(aDetach);
			// });
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

		// DEL BEGIN BY SHIN073 2021/09/15
		// finallyCreateItems: function (aDetach) {
		// 	var that = this;
		// 	var iSuccess = 0;
		// 	iFailed = 0;
		// 	excuteSure = true;
		// 	this.getView().setBusy(true);
		// 	this.getModel().setDeferredGroups(["create"]);
		// 	var mParameter = {
		// 		groupId: "create",
		// 		success: function (oData, response) {
		// 			that.getView().setBusy(false);
		// 			if (oData.Keka === "S") {
		// 				iSuccess += 1;
		// 			} else if (oData.Keka === "E") {
		// 				iFailed += 1;
		// 			}
		// 			if (excuteSure === true && aDetach.length === iSuccess + iFailed) {
		// 				var sMsg = "";
		// 				if (iFailed === 0) {
		// 					sMsg = that.getResourceBundle().getText("CreateSuccess", [iSuccess]);
		// 					MessageBox.success(sMsg);
		// 				} else if (iSuccess > 0) {
		// 					sMsg = that.getResourceBundle().getText("CreateSuccess", [iSuccess]) + "\n" +
		// 						that.getResourceBundle().getText("CreateError", [iFailed]);
		// 					that.showError(that.getResourceBundle().getText("MsgTitile"), sMsg);
		// 				} else {
		// 					sMsg = that.getResourceBundle().getText("CreateError", [iFailed]);
		// 					that.showError(that.getResourceBundle().getText("MsgTitile"), sMsg);
		// 				}
		// 				that.oTable.clearSelection();
		// 				that.getModel().refresh();
		// 				excuteSure = false;
		// 			}
		// 		},
		// 		error: function (err) {
		// 			that.getView().setBusy(false);
		// 			// iFailed += 1;
		// 			// if (excuteSure === true && aDetach.length === iSuccess + iFailed) {
		// 			// 	var sMsg = "";
		// 			// 	if (iSuccess === 0) {
		// 			// 		sMsg = that.getResourceBundle().getText("CreateError", [iFailed]);
		// 			// 		that.showError(that.getResourceBundle().getText("MsgTitile"), sMsg, "");
		// 			// 	} else if (iSuccess > 0 && iFailed > 0) {
		// 			// 		sMsg = that.getResourceBundle().getText("CreateSuccess", [iSuccess]) + "\n" +
		// 			// 			that.getResourceBundle().getText("CreateError", [iFailed]);
		// 			// 		that.showError(that.getResourceBundle().getText("MsgTitile"), sMsg);
		// 			// 	}
		// 			// 	that.oTable.clearSelection();
		// 			// 	that.getModel().refresh();
		// 			// 	excuteSure = false;
		// 			// }
		// 			if (excuteSure === true) {
		// 				var sMsg;
		// 				if (err.statusCode === 500) {
		// 					sMsg = err.responseText;
		// 				} else {
		// 					var oError = JSON.parse(err.responseText);
		// 					if (oError.error.innererror.errordetails.length > 0) {
		// 						sMsg = oError.error.innererror.errordetails[0].message;
		// 					} else {
		// 						sMsg = oError.error.message.value;
		// 					}
		// 				}
		// 				that.showError(that.getResourceBundle().getText("MsgTitile"), sMsg, "");
		// 				that.oTable.clearSelection();
		// 				that.getModel().refresh();
		// 				excuteSure = false;
		// 			}
		// 		}
		// 	};
		// 	aDetach.forEach(function (item) {
		// 		that.getModel().create("/SalesOfficeBillSet", item, mParameter);
		// 	});
		// 	that.getModel().submitChanges(mParameter);
		// },
		// DEL END BY SHIN073 2021/09/15

		// ADD BEGIN BY SHIN073 2021/09/15
		// ADD END BY SHIN073 2021/09/15
	});
});