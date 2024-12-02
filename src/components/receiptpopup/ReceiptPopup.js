

import React, { useState, useEffect } from "react";
import { TextBox } from "devextreme-react/text-box";
import { TextArea } from "devextreme-react/text-area";
import DataGrid, { Column, Editing, Lookup, SearchPanel } from "devextreme-react/data-grid";
import { DateBox } from "devextreme-react";
import "./receiptpopup.scss";

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
  useEffect(() => {
    setLocalFormData(formData || {});
    setItems(initialItems || []);
  }, [formData, initialItems]);
// console.log("FFFFForm data when we clik",localFormData)
  const handleSave = () => {
    const updatedData = {
      ...localFormData,
      // ReceiptDetail: items,
    };
    onSave(updatedData);
  };

  const updateRowData = (updatedRow, index) => {
    console.log("checking data grid data updatedRow",updatedRow,"index value",index)
    const grossAmount = (updatedRow.Rate || 0) * (updatedRow.Quantity || 0);
    const discountAmount = updatedRow.Discount || 0;
    const calculatedAmount = grossAmount - discountAmount;

    // setItems( (prevItems) => {
    //   const updatedItems = [...prevItems];
    //   updatedItems[index + 1] = {
    //     ...updatedRow,
    //     Amount: grossAmount,
    //     Discount: discountAmount,
    //     ItemID: 1,
    //   };
    //   return updatedItems;
    // });

    // setLocalFormData((prevData) => {
    //   console.log("PRevDatatat",prevData.ReceiptDetail)
    // })

    // setLocalFormData((prevItems) => {
    //   const updatedItems = [...prevItems.ReceiptDetail];
    //   updatedItems[index + 1] = {
    //     ...updatedRow,
    //     Amount: grossAmount,
    //     Discount: discountAmount,
    //     ItemID: 1,
    //   };
    //   return updatedItems;
    // });
    // console.log("itemssssss",items)

    setLocalFormData((prev) => ({
      ...prev,
       ReceiptDetail:[{...updatedRow,Amount:grossAmount,Discount:discountAmount,ItemID: 2}],
       NetAmount: calculatedAmount,
      // NetAmount: localFormData.ReceiptDetail.reduce(
      //   (total, item, idx) =>
      //     idx === index ? total + calculatedAmount : total + (item.Amount || 0),
      //   0
      // ),
    }));
  };

  // const handleRowInserted = (e) => {
  //   console.log("EEEEEEEEEE", e, "::::", items);
  //   const newItem = {
  //     ItemID: 1,
  //     ReceiptDetailID: items[0].ReceiptDetailID || null,
  //     ReceiptID: localFormData.ReceiptID || null,
  //     Quantity: 0,
  //     Rate: 0,
  //     Discount: 0,
  //     Amount: 0,
  //   };
  //   console.log("new itemmmm", newItem, "ITM Old", items);
  //   // setItems((prevItems) => [...prevItems,newItem]);
  // };

  const lookupDataSourceConfig = {
    store: {
      type: 'array',
      data:ItemList,
      key: 'ItemID'
  },
  pageSize: 10,
  paginate: true  
  }

  const handleItemDropDown = (rowData, value) => {
    console.log("handle drowdown",rowData,"VVVVVVV",value)
    // rowData.CityID = null;
    // this.defaultSetCellValue(rowData, value);
    console.log("ittteemmsss inside handle item",items)
    //  setItems((prevItems) => ({
    //   ...prevItems,
    //   ItemID: value,
    //  }))
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.ItemID !== value  ? { ...item, ItemID: value } : item
      )
    );
    
  }

  if (!visible) return null;

  return (
    <>
      <div className="receipt-popup-overlay" onClick={onClose}></div>

      <div className="receipt-popup">
        <div className="popup-header">
          <h2>{title}</h2>
          <div className="button-container">
            <button onClick={handleSave} className="save-btn">
              Save
            </button>
            <button onClick={onClose} className="close-btn">
              Close
            </button>
          </div>
        </div>
        <div className="popup-body">
          <div className="form-section">
            <div className="receiptname-container">
              <TextBox
                className="text-box"
                placeholder="Receipt NO"
                value={localFormData.ReceiptNo || ""}
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
            {/* {console.log(">>>>>>dta grid receipt form items value",items,"?????????",localFormData.ReceiptDetail)} */}
            <DataGrid
              dataSource={localFormData.ReceiptDetail}
              keyExpr="ItemID"
              onRowUpdating={(e) => {
                const index = items.findIndex((item) => item.ItemID === e.key);
                const updatedRow = { ...e.oldData, ...e.newData };
                updateRowData(updatedRow, index);
              }}
              //  onRowInserted={handleRowInserted}
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
                  localFormData.ReceiptDetail.reduce((total, item) => total + (item.Amount || 0), 0) -
                  localFormData.ReceiptDetail.reduce((total, item) => total + (item.Discount || 0), 0)
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
