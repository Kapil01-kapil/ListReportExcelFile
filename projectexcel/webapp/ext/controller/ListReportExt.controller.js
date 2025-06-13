sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "projectexcel/libs/xlsx" 

    
], function(MessageToast, Fragment, JSONModel ,XLSX) {
    'use strict';

    return {
        _uploadDialog: null,
        _previewDialog: null,
        onAfterRendering: function () {
            const oView = this.getView();
          
            // Hide Create button
            const oCreateBtn = oView.byId("addEntry");
            if (oCreateBtn) {
              oCreateBtn.setVisible(false);
            }
          
            // Hide Delete button
            const oDeleteBtn = oView.byId("deleteEntry");
            if (oDeleteBtn) {
              oDeleteBtn.setVisible(false);
            }
          },
          
        updateBtn:async function(oEvent) {
            const view = this.getView();
            if (!this._uploadDialog) {
                this._uploadDialog = await Fragment.load({
                  name: "projectexcel.ext.fragment.ExcelUploadDialog",
                  controller: this
                });
                view.addDependent(this._uploadDialog);
              }
        
              this._uploadDialog.open();
            MessageToast.show("Custom handler invoked.", view);
        },
        onExcelChange: async function (oEvent) {
            const file = oEvent.getParameter("files")[0];
            if (file && window.FileReader) {
              const reader = new FileReader();
              reader.onload = async (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const jsonData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      
                const model = new JSONModel(jsonData);
                this.getView().setModel(model, "previewModel");
      
                if (!this._previewDialog) {
                  this._previewDialog = await Fragment.load({
                    name: "projectexcel.ext.fragment.ExcelPreviewDialog",
                    controller: this
                  });
                  this.getView().addDependent(this._previewDialog);
                }
      
                this._previewDialog.open();
                MessageToast.show(`Loaded ${jsonData.length} records.`);
              };
              reader.readAsBinaryString(file);
            }
          },
      
          onCloseDialog: function () {
            if (this._uploadDialog) this._uploadDialog.close();
            if (this._previewDialog) this._previewDialog.close();
          },
      
          onClosePreview: function () {
            if (this._uploadDialog) this._uploadDialog.close();
            if (this._previewDialog) this._previewDialog.close();
          },
        Upload: function(oEvent) {
            const oSmartFilterBar = this.getView().byId("listReportFilter"); // Confirm this ID in your app
            if (oSmartFilterBar) {
              oSmartFilterBar.search(); // ⏩ This is same as clicking “Go”
              sap.m.MessageToast.show("List refreshed via custom button");
            } else {
              console.warn("SmartFilterBar not found");
            }

        // MessageToast.show("Custom handler invoked.");
       

        },
       
    };
});