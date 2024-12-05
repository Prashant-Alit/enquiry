import React, { useState, useEffect, useCallback, useRef } from "react";
import { TextBox } from "devextreme-react/text-box";
import { TextArea } from "devextreme-react/text-area";
import DataGrid, { Column, Editing, Lookup } from "devextreme-react/data-grid";
import Toolbar, { Item } from "devextreme-react/toolbar";
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
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);
  const [totalQuantity,setTotalQuantity] = useState()
  const [totlaDiscount,setTotalDiscount] = useState();
  const datagridref = useRef();
  // console.log("DDDDDD", datagridref?.current?.instance?.getDataSource());

  useEffect(() => {
    setLocalFormData(formData || {});
    setItems(initialItems || []);
  }, [formData, initialItems]);

  // const updateRowData = (updatedRow, index) => {
  // console.log(
  //   "checking data grid data updatedRow",
  //   updatedRow,
  //   "index value",
  //   index
  // );
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
  //       },
  //     ],
  //     NetAmount: calculatedAmount,
  //     ReceiptNo: localFormData.ReceiptNo,
  //   }));
  // };

  const getSaveButtonOptions = {
    text: "Save",
    onClick: () => handleSave(localFormData),
  };

  const handleSave = (localFormDataValue) => {
    console.log("localform data valueee", localFormDataValue);
    const amount = localFormData.ReceiptDetail.reduce(
      (total, item) => total + (item.Amount || 0),
      0
    );
    const dist = localFormData.ReceiptDetail.reduce(
      (total, item) => total + (item.Discount || 0),
      0
    );
    let netAmount = amount - dist;
    onSave({ ...localFormDataValue, NetAmount: netAmount });
  };

  const getCloseButtonOptions = {
    text: "Close",
    color: "#ff5722",
    onClick: () => onClose(),
  };

  // const handleROwInit = (e) => {
  //   console.log("EEEEE handle row init", e);
  // };

  const handleRowInserted = (e) => {
    const newRowData = e.data;
    console.log("handle row inserted", e, "LLLLL", localFormData);
    // setLocalFormData((prev) => ({
    //   ...prev,
    //   ReceiptDetail: [...(prev.ReceiptDetail || []), newRowData],
    // }));
  };

  // const handleRowUpdated = (e) => {
  //   const updatedRowData = { ...e.oldData, ...e.newData };
  //   const grossAmount = (updatedRow.Rate || 0) * (updatedRow.Quantity || 0);
  //   const discountAmount = updatedRow.Discount || 0;
  //   const calculatedAmount = grossAmount - discountAmount;
  //   console.log("handle row updated", localFormData, ">>>>>>e", e?.data);
  //   setLocalFormData((prev) => ({
  //     ...prev,
  //     ReceiptDetail: prev.ReceiptDetail.map((item) =>
  //       item.ItemID === updatedRowData.ItemID ? updatedRowData : item
  //     ),
  //   }));
  // };

  const handleRowUpdated = (e) => {
    const updatedRowData = { ...e.oldData, ...e.newData };
    console.log("EEEEEE inside row update", e);
    // Calculate Amount and Discount based on new data
    const grossAmount = (e?.data?.Rate || 0) * (e?.data?.Quantity || 0);
    const discountAmount = e?.data?.Discount || 0;
    const calculatedAmount = grossAmount - discountAmount;
    // updatedRowData.Amount = grossAmount;
    // console.log("updatedRowData",grossAmount);
    // console.log("Discunt Amount",discountAmount)
    // console.log("items",items)

    const abc = {
      Amount: grossAmount,
      Discount: discountAmount,
      Rate: e?.data?.Rate,
      Quantity: e?.data?.Quantity,
      ItemID: e?.data?.ItemID,
    };
    console.log("~~~~~~~~", abc);

    // setLocalFormData((prev) => ({
    //   ...prev,
    //   ReceiptDetail:[...prev.ReceiptDetail,abc],
    //   NetAmount: calculatedAmount,
    // }))

    // setLocalFormData((prev) => {
    //   const updatedReceiptDetail = prev.ReceiptDetail.map((item) =>
    //     item.ItemID === updatedRowData.ItemID
    //       ? {
    //           ...item,
    //           ...updatedRowData,
    //           Amount: grossAmount,
    //           Discount: discountAmount,
    //         }
    //       : item
    //   );

    //   // const totalAmount = updatedReceiptDetail.reduce(
    //   //   (total, item) => total + (item.Amount || 0),
    //   //   0
    //   // );

    //   // const totalDiscount = updatedReceiptDetail.reduce(
    //   //   (total, item) => total + (item.Discount || 0),
    //   //   0
    //   // );

    //   // const calculatedNetAmount = totalAmount - totalDiscount;
    //   console.log("??????????", updatedReceiptDetail);
    //   return {
    //     ...prev,
    //     ReceiptDetail: updatedReceiptDetail,
    //     // NetAmount: calculatedNetAmount,
    //   };
    // });
  };

  const handleRowRemoved = (e) => {
    const removedRowData = e.data;
    // console.log("handle remove row", removedRowData, "FFF", localFormData);
    setLocalFormData((prev) => ({
      ...prev,
      ReceiptDetail: prev.ReceiptDetail.filter(
        (item) => item.ItemID !== removedRowData.ItemID
      ),
    }));
  };

  // const onSelectionChanged = useCallback((data) => {
  //    console.log("selection chnage", data);
  //   setSelectedItemKeys(data.selectedRowKeys);
  // }, []);

  // const handleCellValue = (newData, value, currentRowData) => {
  //   newData.ItemID = value
  //   console.log("newData",newData, "Valueee",value, "currentRowData",currentRowData)
  // }

  // const handleGenericCellValue = (
  //   newData,
  //   value,
  //   currentRowData,
  //   dataField
  // ) => {
  //   newData[dataField] = value;

  //   // Use the new value directly for calculations
  //   const updatedRowData = { ...currentRowData, [dataField]: value };

  //   if (dataField === "Rate") {
  //     newData.Amount = (value || 0) * (updatedRowData.Quantity || 0);
  //   } else if (dataField === "Quantity") {
  //     newData.Amount = (updatedRowData.Rate || 0) * (value || 0);
  //   }

  //   console.log("UpdatedRowData:", updatedRowData);
  //   // setLocalFormData((prev) =>({
  //   //   ...prev,
  //   //   ReceiptDetail: [...localFormData.ReceiptDetail,updatedRowData]
  //   // }))
  //   console.log("LocalForm data", localFormData);
  //   let totalQuan = localFormData.ReceiptDetail.reduce((total, item) => total + (item.Quantity || 0),   0 )
  //   setTotalQuantity(totalQuan)
  //   let totaldiscount =  localFormData.ReceiptDetail.reduce((total, item) => total + (item.Discount || 0),   0 )
  //   console.log("Total discount",totaldiscount)
  //   setTotalDiscount(totaldiscount)
  //   console.log("Updated newData:", newData);
  //   console.log("current ROwData", currentRowData);
  // };

  useEffect(() => {
    const totalQuan = localFormData.ReceiptDetail.reduce(
      (total, item) => total + (item.Quantity || 0),
      0
    );
    const totalDiscount = localFormData.ReceiptDetail.reduce(
      (total, item) => total + (item.Discount || 0),
      0
    );
  
    setTotalQuantity(totalQuan);
    setTotalDiscount(totalDiscount);
  }, [localFormData.ReceiptDetail]);
  


  const handleGenericCellValue = (newData, value, currentRowData, dataField) => {
    newData[dataField] = value;
  
    const updatedRowData = { ...currentRowData, [dataField]: value };
  
    if (dataField === "Rate") {
      newData.Amount = (value || 0) * (updatedRowData.Quantity || 0);
    } else if (dataField === "Quantity") {
      newData.Amount = (updatedRowData.Rate || 0) * (value || 0);
    }
  
    // Update ReceiptDetail with the new row data
    setLocalFormData((prev) => {
      const updatedReceiptDetail = prev.ReceiptDetail.map((item) =>
        item === currentRowData ? updatedRowData : item
      );
    console.log("updatedReceiptDetail",updatedReceiptDetail)
      // // Recalculate totals
      // const totalQuan = updatedReceiptDetail.reduce(
      //   (total, item) => total + (item.Quantity || 0),
      //   0
      // );
      // const totalDiscount = updatedReceiptDetail.reduce( (total, item) => total + (item.Discount || 0),0, );
      // console.log("totla discount",totalDiscount)
  
      // setTotalQuantity(totalQuan);
      // setTotalDiscount(totalDiscount);
  
      return { ...prev, ReceiptDetail: updatedReceiptDetail };
    });
  };
  



  const handleInitRow = (e) => {
    console.log("handle Init row", e);
    e.data = {
      ReceiptDetailID: 0,
      Quantity: 0,
      Rate: 0,
      Discount: 0,
      Amount: 0,
      ReceiptID: 0,
      ItemID: 0,
    };
  };

  if (!visible) return null;

  return (
    <>
      <div className="receipt-popup-overlay" onClick={onClose}></div>

      <div className="receipt-popup">
        <div className="popup-header">
          <h2>{title}</h2>
          <div className="button-container">
            <Toolbar>
              <Item
                location="after"
                widget="dxButton"
                toolbar="top"
                options={getSaveButtonOptions}
              ></Item>
              <Item
                location="after"
                widget="dxButton"
                toolbar="top"
                cssClass="close-btn"
                options={getCloseButtonOptions}
              ></Item>
            </Toolbar>
          </div>
        </div>
        <div className="popup-body">
          <div className="form-section">
            <div className="receiptname-container">
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
            {/* {console.log(
              "RRRReeeccceeiiippptttIDD",
              localFormData.ReceiptDetail
            )} */}
            <DataGrid
              ref={datagridref}
              dataSource={localFormData.ReceiptDetail || []}
              // keyExpr="ReceiptID"
              // keyExpr="ReceiptDetailID"
              // keyExpr="ItemID"
              // onRowUpdating={(e) => {
              // const index = localFormData.ReceiptDetail.findIndex((item) => item.ItemID === e.key);
              // const updatedRow = { ...e.oldData, ...e.newData };
              // updateRowData(updatedRow, index);
              // }}
              //     onRowInserted={ handleRowInserted}
              //     onInitNewRow={(e) => handleROwInit(e)}
              // selectedRowKeys={selectedItemKeys}
              // onSelectionChanged={onSelectionChanged}
              // onRowInserted={handleRowInserted}
              // onRowUpdated={handleRowUpdated}
              onRowRemoved={handleRowRemoved}
              onInitNewRow={(e) => {
                handleInitRow(e);
              }}
            >
              <Editing
                mode="cell"
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}
              />
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
              <Column
                dataField="ItemID"
                caption=" Select Item"
                width={125}
                setCellValue={(newData, value, currentRowData) => {
                  handleGenericCellValue(
                    newData,
                    value,
                    currentRowData,
                    "ItemID"
                  );
                }}
              >
                <Lookup
                  dataSource={ItemList}
                  placeholder="Select.."
                  valueExpr="ItemID"
                  displayExpr="ItemName"
                />
              </Column>
              <Column
                dataField="Rate"
                caption="Rate"
                setCellValue={(newData, value, currentRowData) => {
                  handleGenericCellValue(
                    newData,
                    value,
                    currentRowData,
                    "Rate"
                  );
                  // newData.Rate = value;
                  // newData.Amount =
                  //   (value || 0) * (currentRowData.Quantity || 0);
                }}
              />
              <Column
                dataField="Quantity"
                caption="Qty"
                setCellValue={(newData, value, currentRowData) => {
                  handleGenericCellValue(
                    newData,
                    value,
                    currentRowData,
                    "Quantity"
                  );
                  // newData.Quantity = value;
                  // newData.Amount = (currentRowData.Rate || 0) * (value || 0);
                }}
              />
              <Column
                dataField="Discount"
                caption="Discount amount"
                setCellValue={(newData, value, currentRowData) => {
                  handleGenericCellValue(
                    newData,
                    value,
                    currentRowData,
                    "Discount"
                  );
                }}
              />
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
                placeholder="Remarks"
                value={localFormData.Remarks || ""}
                onValueChanged={(e) =>
                  setLocalFormData({ ...localFormData, Remarks: e.value })
                }
              />
            </div>
            {console.log("local form data beofre reduce", localFormData)}
            <div className="quantity-container">
              <TextBox
                label="Total Quantity"
                value={localFormData.ReceiptDetail.reduce(
                  (total, item) => total + (item.Quantity || 0),
                  0
                )}
                // value={totalQuantity}
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
                 value={localFormData.ReceiptDetail.reduce((total,item) => total + (item.Discount || 0), 0)}
                // value={totlaDiscount}
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
