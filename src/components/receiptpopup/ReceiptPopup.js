import React, { useState, useEffect, useCallback } from "react";
import { TextBox } from "devextreme-react/text-box";
import { TextArea } from "devextreme-react/text-area";
import DataGrid, {
  Column,
  Editing,
  Lookup,
  SearchPanel,
} from "devextreme-react/data-grid";
import Toolbar, { Item } from "devextreme-react/toolbar";
import { DateBox } from "devextreme-react";
import "./receiptpopup.scss";
import { color } from "three/webgpu";

export default function ReceiptPopup({
  visible,
  onClose,
  title,
  formData,
  items: initialItems,
  ItemList,
  onSave,
}) {
  const [localFormData, setLocalFormData] = useState(formData || {});
  const [items, setItems] = useState(formData?.ReceiptDetail || []);
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);

  useEffect(() => {
    setLocalFormData(formData || {});
    setItems(initialItems || []);
  }, [formData, initialItems]);
  // console.log("FFFFForm data when we clik",localFormData)
  // const handleSave = () => {
  //   const updatedData = {
  //     ...localFormData,
      // ReceiptDetail: items,
  //   };
  //   onSave(updatedData);
  // };

  // const updateRowData = (updatedRow, index) => {
  //   console.log(
  //     "checking data grid data updatedRow",
  //     updatedRow,
  //     "index value",
  //     index
  //   );
  //   const grossAmount = (updatedRow.Rate || 0) * (updatedRow.Quantity || 0);
  //   const discountAmount = updatedRow.Discount || 0;
  //   const calculatedAmount = grossAmount - discountAmount;

  //   setLocalFormData((prev) => ({
  //     ...prev,
  //     ReceiptDetail: [
  //       {
  //         ...updatedRow,
  //         Amount: grossAmount,
  //         Discount: discountAmount,
  //         ItemID: 2,
  //       },
  //     ],
  //     NetAmount: calculatedAmount,
  //     ReceiptNo: localFormData.ReceiptNo,
  //   }));
  // };

  // const lookupDataSourceConfig = {
  //   store: {
  //     type: "array",
  //     data: ItemList,
  //     key: "ItemID",
  //   },
  //   pageSize: 10,
  //   paginate: true,
  // };

  // const handleItemDropDown = (rowData, value) => {
  //   console.log("handle drowdown", rowData, "VVVVVVV", value);
  //   console.log("ittteemmsss inside handle item", items);
  //   setItems((prevItems) =>
  //     prevItems.map((item) =>
  //       item.ItemID !== value ? { ...item, ItemID: value } : item
  //     )
  //   );
  // };

  const getSaveButtonOptions = {
    text: "Save",
    onClick: () => onSave(localFormData),
  };

  const getCloseButtonOptions = {
    text: "Close",
    color: "#ff5722",
    onClick: () => onClose(),
  };

  // const handleRowInserted = (e) => {
  //   console.log("row inster data", e?.data);
  //   const newRowData = {...e?.data};
  //   let updatedRow = e.data;
  //   const grossAmount = (updatedRow.Rate || 0) * (updatedRow.Quantity || 0);
  //   const discountAmount = updatedRow.Discount || 0;
  //   const calculatedAmount = grossAmount - discountAmount;
  //   console.log("LLLLLLLOOOO",localFormData.ReceiptNo,"????????/////",newRowData)
  //   setLocalFormData((prev) => ({
  //     ...prev,
  //     ReceiptDetail: [
  //       {
  //         ...updatedRow,
  //         Rate:updatedRow.Rate,
  //         Quantity:updatedRow.Quantity,
  //         Discount:updatedRow.Discount,
  //         Amount: grossAmount,
  //         Discount: discountAmount,
  //         ItemID: 2,
  //       },
  //     ],
  //     NetAmount: calculatedAmount,
  //     ReceiptNo:localFormData.ReceiptNo,
  //     ReceiptID:localFormData.ReceiptID,
  //   }, console.log("prevvv valluueeee",localFormData,"::::::::",prev)));
  // };

  const handleRowInserted = (e) => {
    const newRowData = e?.data;
    console.log("handle insert row data",e?.data,"@@@@@@@",localFormData)
    setLocalFormData((prev) => ({
      ...prev,
      ReceiptDetail: [...(prev.ReceiptDetail || []), newRowData],
    }));
  };

  const onSelectionChanged = useCallback((data) => {
    console.log("*****",data)
    setSelectedItemKeys(data.selectedRowKeys);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div className="receipt-popup-overlay" onClick={onClose}></div>

      <div className="receipt-popup">
        <div className="popup-header">
          <h2>{title}</h2>
          <div className="button-container">
            {/* <button onClick={handleSave} className="save-btn">
              Save
            </button> */}
            <Toolbar>
              <Item
                location="after"
                widget="dxButton"
                toolbar="top"
                options={getSaveButtonOptions}
              ></Item>
              {/* </Toolbar> */}
              {/* <button onClick={onClose} className="close-btn">
              Close
            </button> */}
              {/* <div> */}
              {/* <Toolbar> */}
              <Item
                location="after"
                widget="dxButton"
                toolbar="top"
                cssClass="close-btn"
                options={getCloseButtonOptions}
              ></Item>
            </Toolbar>
            {/* </div> */}
          </div>
        </div>
        <div className="popup-body">
          <div className="form-section">
            <div className="receiptname-container">
              {/* {console.log("aboveeeeeee textbox",localFormData)} */}
              <TextBox
                className="text-box"
                placeholder="Receipt NO"
                value={localFormData.ReceiptNo || 0}
                readOnly
              />
              <DateBox
                placeholder="Date of Birth"
                value={localFormData.ReceiptDate || null}
                onValueChanged={(e) =>
                  setLocalFormData({
                    ...localFormData,
                    ReceiptDate: e.value,
                  })
                }
                displayFormat="dd/MM/yyyy"
                pickerType="calendar"
              />
            </div>
            {/* <TextBox
              placeholder="Person Name"
              value={localFormData.PersonName || ""}
              onValueChanged={(e) =>
                setLocalFormData({
                  ...localFormData,
                  PersonName: e.value,
                })
              }
            /> */}
          </div>

          <div className="data-grid-container">
            <DataGrid
              dataSource={localFormData.ReceiptDetail}
              keyExpr="ItemID"
              // onRowUpdating={(e) => {
              //   const index = localFormData.ReceiptDetail.findIndex((item) => item.ItemID === e.key);
              //   const updatedRow = { ...e.oldData, ...e.newData };
              //   updateRowData(updatedRow, index);
              // }}
                 onRowInserted={ handleRowInserted}
                selectedRowKeys={selectedItemKeys}
                onSelectionChanged={onSelectionChanged}
            >
              <Editing mode="cell" allowUpdating allowAdding allowDeleting />
              <Column
                caption="S.No"
                width={80}
                alignment="center"
                allowEditing={false}
                cellRender={(rowData) => {
                  const pageSize = rowData.component.pageSize();
                  const pageIndex = rowData.component.pageIndex();
                  const rowIndex = rowData.rowIndex;
                  return <span>{pageIndex * pageSize + rowIndex + 1}</span>;
                }}
              />
              {/* <Column
                dataField="ItemID"
                caption="Item ID"
                editorOptions={{
                  dataSource: ItemList,
                  displayExpr: "ItemName",
                  valueExpr: "ItemID",
                  placeholder: "Select Item",
                  onValueChanged: (e) => {
                    setLocalFormData((prevFormData) => ({
                      ...prevFormData,
                      ItemID: e.value,
                    }));
                  },
                }}
              /> */}
              {/* <Column
                    dataField="ItemID"
                    setCellValue={handleItemDropDown}
                    >
                    <Lookup
                        dataSource={lookupDataSourceConfig}
                        valueExpr="ItemID" 
                        value={items.ItemID || 0}
                        displayExpr="ItemName" 
                    />
                </Column> */}
              <Column dataField="Rate" caption="Rate" />
              <Column dataField="Quantity" caption="Qty" />
              <Column dataField="Discount" caption="Discount amount" />
              <Column
                dataField="Amount"
                caption="Amount"
                allowEditing={false}
              />
            </DataGrid>
          </div>

          <div className="Lower-form-section">
            <div className="form-row-remarks">
              <TextArea
                labelMode="floating"
                label="Remarks"
                value={localFormData.Remarks || ""}
                onValueChanged={(e) =>
                  setLocalFormData({ ...localFormData, Remarks: e.value })
                }
              />
            </div>
            <div className="quantity-container">
              <TextBox
                label="Total Quantity"
                value={localFormData.ReceiptDetail.reduce(
                  (total, item) => total + (item.Quantity || 0),
                  0
                )}
                readOnly
                labelMode="floating"
                width={120}
              />
            </div>
            <div className="summary">
              <TextBox
                label="Amount"
                labelMode="floating"
                value={localFormData.ReceiptDetail.reduce(
                  (total, item) => total + (item.Amount || 0),
                  0
                )}
                readOnly
              />
              <TextBox
                label="Discount amount"
                labelMode="floating"
                value={localFormData.ReceiptDetail.reduce(
                  (total, item) => total + (item.Discount || 0),
                  0
                )}
                readOnly
              />
              <TextBox
                label="NetAmount"
                labelMode="floating"
                value={
                  localFormData.ReceiptDetail.reduce(
                    (total, item) => total + (item.Amount || 0),
                    0
                  ) -
                  localFormData.ReceiptDetail.reduce(
                    (total, item) => total + (item.Discount || 0),
                    0
                  )
                }
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
