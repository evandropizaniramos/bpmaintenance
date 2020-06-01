sap.ui.define([
	"trainning/bp000/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, MessageBox, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("trainning.bp000.controller.BPDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf trainning.bp000.view.BPDetail
		 */
		onInit: function () {
			this.attachRoute("ToBPDisplay", this.onRouteMatched);
			this.attachRoute("ToBPEdit", this.onRouteMatched);
			this.attachRoute("ToBPCreate", this.onRouteMatched);
		},

		onRouteMatched: function (oEvent) {
			var sRoute = oEvent.getParameter("name");
			var oView = this.getView();

			if (sRoute === "ToBPEdit" || sRoute === "ToBPDisplay") {
				var sPartnerId = oEvent.getParameter("arguments").PartnerId;

				oView.bindElement("/BusinessPartnerSet('" + sPartnerId + "')");
			} else if (sRoute === "ToBPCreate") {
				oView.unbindContext();

				var oModel = oView.getModel();
				var oContext = oModel.createEntry("/BusinessPartnerSet", {
					properties: {
						PartnerId: "",
						PartnerType: "",
						PartnerName1: "",
						PartnerName2: "",
						SearchTerm1: "",
						SearchTerm2: "",
						Street: "",
						HouseNumber: "",
						District: "",
						City: "",
						Region: "",
						Country: "",
						ZipCode: ""
					}
				});

				oView.setBindingContext(oContext);
			}

			if (sRoute === "ToBPEdit" || sRoute === "ToBPCreate") {
				this.setEditableControls(true);
			} else {
				this.setEditableControls(false);
			}

			switch (sRoute) {
			case "ToBPEdit":
				this._sOperation = "Edit";
				break;
			case "ToBPDisplay":
				this._sOperation = 'Display';
				break;
			case "ToBPCreate":
				this._sOperation = 'Create';
				break;
			}
		},

		setEditableControls: function (bEdit) {
			var oEditModel = new sap.ui.model.json.JSONModel();

			if (bEdit) {
				oEditModel.loadData("model/controlsOpened.json");
			} else {
				oEditModel.loadData("model/controlsClosed.json");
			}

			var oView = this.getView();
			oView.setModel(oEditModel, "control");
		},

		onSavePress: function (oEvent) {
			var oView = this.getView();
			var oModel = oView.getModel();
			var that = this;

			switch (this._sOperation) {
			case "Edit":
				oModel.submitChanges({
					success: function (oData, response) {
						MessageBox.success(that.getText("msgBPUpdated"), {
							title: that.getText("txtBPUpdated"),
							onClose: function (oAction) {
								that.getRouter().navTo("ToBPList");
							}
						});
					},
					error: function (oError) {
						MessageBox.error(that.getText("msgBPUpdError"), {
							title: that.getText("txtBPUpdError")
						});
					}
				});

				break;
			case "Create":
				var oObject = oView.getBindingContext().getObject();

				oModel.create("/BusinessPartnerSet", oObject, {
					success: function (oData, response) {
						MessageBox.success(that.getText("msgBPCreated", [oObject.PartnerId]), {
							title: that.getText("txtBPCreated"),
							onClose: function (oAction) {
								that.getRouter().navTo("ToBPList");
							}
						});
					},
					error: function (oError) {
						MessageBox.error(that.getText("msgBPCrtError"), {
							title: that.getText("txtBPCrtError")
						});
					}
				});

				break;
			}
		},

		onCancelPress: function (oEvent) {
			var oView = this.getView();
			var that = this;

			MessageBox.show(that.getText("msgBPCancel"), {
				title: that.getText("txtBPCancel"),
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						oView.getModel().resetChanges([oView.getBindingContext().getPath()]);
						that.getRouter().navTo("ToBPList");
					}
				}
			});
		},

		onOpenCountryDialog: function (oEvent) {
			var oView = this.getView();

			if (!this._oCountryDialog) {
				this._oCountryDialog = new sap.ui.xmlfragment("trainning.bp000.fragments.CountryDialog", this);
				oView.addDependent(this._oCountryDialog);
			}

			this._oCountryDialog.open();
		},

		onSearchCountryDialog: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("LandName", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		onCloseCountryDialog: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var oInput = this.byId("inputCountry");

			if (oSelectedItem) {
				oInput.setValue(oSelectedItem.getTitle());
				oInput.setDescription(oSelectedItem.getDescription());
			} else {
				oInput.resetProperty("value");
				oInput.resetProperty("description");
			}
		},

		onBlockPress: function (oEvent) {
			debugger;
			var oView = this.getView();
			var oModel = oView.getModel();
			var oObject = oView.getBindingContext().getObject();
			var that = this;

			oModel.callFunction("/SetBusinessPartnerBlock", {
				method: "POST",
				urlParameters: {
					PartnerId: oObject.PartnerId,
					Block: !oObject.CentralBlock
				},
				success: function (oData, response) {
					debugger;
					if (oData.Type !== "E") {
						MessageBox.success(oData.Message, {
							title: that.getText("txtBPBlock"),
							onClose: function (oAction) {
								that.getRouter().navTo("ToBPList");
							}
						});
					} else {
						MessageBox.error(oData.Message, {
							title: that.getText("txtBPBlock")
						});
					}
				},
				error: function (oError) {
					debugger;
					MessageBox.error(that.getText("msgBPBlockError"), {
						title: that.getText("txtBPBlock")
					});
				}
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf trainning.bp000.view.BPDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf trainning.bp000.view.BPDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf trainning.bp000.view.BPDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});