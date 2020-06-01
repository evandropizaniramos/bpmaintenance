sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("trainning.bp000.controller.BaseController", {
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function (oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (!sPreviousHash) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo(sPreviousHash);
			}
		},

		attachRoute: function (sRoute, fRouteMatched) {
			this.getRouter().getRoute(sRoute).attachPatternMatched(fRouteMatched, this);
		},
		
		getText: function(sTextId, aArgs) {
			var oView = this.getView();
			var oModel = oView.getModel("i18n");
			
			if (!oModel) {
				oModel = new sap.ui.model.resource.ResourceModel({
					bundleName: "trainning.bp000.i18n.i18n"
				});
				
				oView.setModel(oModel, "i18n");
			}
			
			return oModel.getResourceBundle().getText(sTextId, aArgs);
		}
	});
});