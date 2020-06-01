sap.ui.define([
	"trainning/bp000/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("trainning.bp000.controller.BPList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf trainning.bp000.view.BPList
		 */
		onInit: function () {
			this.attachRoute("ToBPList", this.onRouteMatched);
		},

		onRouteMatched: function () {
			this.getView().getModel().refresh(true, false);
		},

		onDisplayPress: function (oEvent) {
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPartnerId = oBindingContext.getObject().PartnerId;

			this.getRouter().navTo("ToBPDisplay", {
				PartnerId: sPartnerId
			});
		},

		onEditPress: function (oEvent) {
			var oSource = oEvent.getSource();
			var oBindingContext = oSource.getBindingContext();
			var sPartnerId = oBindingContext.getObject().PartnerId;

			this.getRouter().navTo("ToBPEdit", {
				PartnerId: sPartnerId
			});
		},

		onCreatePress: function (oEvent) {
			this.getRouter().navTo("ToBPCreate");
		},

		formatPartnerType: function (sPartnerType) {
			switch (sPartnerType) {
			case "1":
				return this.getText("txtOrganization");
			case "2":
				return this.getText("txtPerson");
			default:
				return "";
			}
		},
		
		formatName: function(sName1, sName2) {
			return sName1 + " " + sName2;
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf trainning.bp000.view.BPList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf trainning.bp000.view.BPList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf trainning.bp000.view.BPList
		 */
		//	onExit: function() {
		//
		//	}

	});

});