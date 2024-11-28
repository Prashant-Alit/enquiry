
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////// this one is working /////////////////////////////////////////////////////
// import React, { useState, useEffect } from "react";
// import { TextBox } from "devextreme-react/text-box";
// import { TextArea } from "devextreme-react/text-area";
// import DataGrid, { Column, Editing } from "devextreme-react/data-grid";
// import "./receiptpopup.scss";
// import { DateBox } from "devextreme-react";

// export default function ReceiptPopup({
//   visible,
//   onClose,
//   title,
//   formData,
//   items: initialItems,
//   onSave,
// }) {
//   const [localFormData, setLocalFormData] = useState(formData || {});
//   const [items, setItems] = useState(formData?.ReceiptDetail || []);
//   const [totalQuantity,setTotalQuantity] = useState();

//   useEffect(() => {
//     setLocalFormData(formData || {});
//     setItems(initialItems || []);
//   }, [formData, initialItems]);

//   const handleSave = () => {
//     const netAmount = items.reduce(
//       (total, item) => total + (item.Amount || 0),
//       0
//     );
//     const updatedData = {
//       ...localFormData,
//       ReceiptDetail: items,
//       NetAmount: netAmount,
//     };
//     onSave(updatedData);
//   };

//   const updateRowData = (updatedRow, index) => {
//     setItems((prevItems) => {
//       const updatedItems = [...prevItems];
//       updatedItems[index] = updatedRow;

//       const grossAmount = (updatedRow.Rate || 0) * (updatedRow.Quantity || 0);
//       const discountAmount = (grossAmount * (updatedRow.Discount || 0)) / 100;
//       updatedItems[index].Amount = grossAmount - discountAmount;

//       return updatedItems;
//     });
//   };

//   if (!visible) return null;

//   return (
//     <div className="receipt-popup">
//       <div className="popup-header">
//         <div>
//           <h2>{title}</h2>
//         </div>
//         <div className="button-container">
//           <button onClick={handleSave} className="save-btn">
//             Save
//           </button>
//           <button onClick={onClose} className="close-btn">
//             Close
//           </button>
//         </div>
//       </div>
//       <div className="popup-body">
//         <div className="form-section">
//           <div className="receiptname-container">
//             <div className="form-row">
//               <TextBox
//                 className="tect-box"
//                 placeholder="Receipt NO"
//                 dataType="date"
//                 format="dd-MM-yyyy"
//                 value={localFormData.ReceiptNo || ""}
//                 readOnly={true}
//               />
//             </div>
//             <div className="name-container">
//               <DateBox
//                 placeholder="Date of Birth"
//                 value={localFormData.ReceiptDate || null} 
//                 onValueChanged={(e) =>
//                   setLocalFormData({ ...localFormData, ReceiptDate: e.value })
//                 }
//                 displayFormat="dd/MM/yyyy" 
//                 type="date"
//                 pickerType="calendar" 
//               />
//             </div>
//           </div>
//           <div className="form-row">
//             <TextBox
//               placeholder="Person name"
//               value={localFormData.PersonName || ""}
//               onValueChanged={(e) =>
//                 setLocalFormData({ ...localFormData, PersonName: e.value })
//               }
//             />
//           </div>
//         </div>
//         <div className="data-grid-container">
//           <DataGrid
//             dataSource={items}
//             keyExpr="ReceiptDetailID"
//             onRowUpdating={(e) => {
//               const index = items.findIndex(
//                 (item) => item.ReceiptDetailID === e.key
//               );
//               const updatedRow = { ...e.oldData, ...e.newData };
//               updateRowData(updatedRow, index);
//             }}
//           >
//              <Editing
//             mode="cell"
//             allowUpdating={true}
//             allowAdding={true}
//             allowDeleting={true}
//           /> 
//             <Column
//               caption="S.No"
//               width={80}
//               alignment="center"
//               cellRender={(rowData) => {
//                 const pageSize = rowData.component.pageSize();
//                 const pageIndex = rowData.component.pageIndex();
//                 const rowIndex = rowData.rowIndex;
//                 return <span>{pageIndex * pageSize + rowIndex + 1}</span>;
//               }}
//             />
//             <Column
//               dataField="Rate"
//               caption="Rate"
//               setCellValue={(newData, value, currentRowData) => {
//                 newData.Rate = value;
//                 const key = items.findIndex(
//                   (item) =>
//                     item.ReceiptDetailID === currentRowData.ReceiptDetailID
//                 );
//                 updateRowData(newData, key);
//               }}
//             />
//             <Column
//               dataField="Quantity"
//               caption="Qty"
//               setCellValue={(newData, value, currentRowData) => {
//                 newData.Quantity = value;
//                 const key = items.findIndex(
//                   (item) =>
//                     item.ReceiptDetailID === currentRowData.ReceiptDetailID
//                 );
//                 updateRowData(newData, key);
//               }}
//             />
//             <Column
//               dataField="Discount"
//               caption="Discount (%)"
//               setCellValue={(newData, value, currentRowData) => {
//                 newData.Discount = value;
//                 const key = items.findIndex(
//                   (item) =>
//                     item.ReceiptDetailID === currentRowData.ReceiptDetailID
//                 );
//                 updateRowData(newData, key);
//               }}
//             />
//             <Column dataField="Amount" caption="Amount" allowEditing={false} />
//           </DataGrid>
//         </div>

//         <div className="Lower-form-section">
//           <div className="form-row-remarks">
//            {console.log("rrrrrrrreeeeee",localFormData)}
//             <TextArea
//               labelMode="floating" 
//               label="Remarks"
//               value={localFormData.Remarks || ""}
//               onValueChanged={(e) =>
//                 setLocalFormData({ ...localFormData, Remarks: e.value })
//               }
//             />
//           </div>
//           <div className="quantity-container">
//               <TextBox  width={200} label="Totla Quantity" labelMode="floating"/>
//             </div>
//           <div className="summary">
            
//             <div>
//               <TextBox placeholder="Total Amount" value={localFormData.Amount} />
//             </div>
//             <div>
//               <TextBox placeholder="Discount Amount" />
//             </div>
//             <div>
//               <TextBox placeholder="Net Amount" value={localFormData.NetAmount || ""} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { TextBox } from "devextreme-react/text-box";
import { TextArea } from "devextreme-react/text-area";
import DataGrid, { Column, Editing } from "devextreme-react/data-grid";
import { DateBox } from "devextreme-react";
import "./receiptpopup.scss";

export default function ReceiptPopup({
  visible,
  onClose,
  title,
  formData,
  items: initialItems,
  onSave,
}) {
  const [localFormData, setLocalFormData] = useState(formData || {});
  const [items, setItems] = useState(formData?.ReceiptDetail || []);
  useEffect(() => {
    setLocalFormData(formData || {});
    setItems(initialItems || []);
  }, [formData, initialItems]);

  const handleSave = () => {
    // const netAmount = localFormData.ReceiptDetail.reduce(
    //   (total, item) => total + (item.Amount || 0),
    //   0
    // );
    const updatedData = {
      ...localFormData,
      ReceiptDetail: items,
    };
     onSave(updatedData);
  };

  // const updateRowData = (updatedRow, index) => {
  //   setItems((prevItems) => {
  //     const updatedItems = [...prevItems];
  //     updatedItems[index] = updatedRow;

  //     const grossAmount = (updatedRow.Rate || 0) * (updatedRow.Quantity || 0);
  //     const discountAmount = (grossAmount * (updatedRow.Discount || 0)) / 100;
  //     updatedItems[index].Amount = grossAmount - discountAmount;

  //     return updatedItems;
  //   });
  // };

  const updateRowData = (updatedRow, index) => {
    console.log("TTTTTTTT,updted",updatedRow,"III",index)
    const grossAmount = (updatedRow.Rate || 0) * (updatedRow.Quantity || 0);
    const discountAmount = updatedRow.Discount || 0;;
    const calculatedAmount = grossAmount - discountAmount;
  
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedRow, Amount: grossAmount,Discount:discountAmount }; 
      console.log("return value data",updatedItems)
      return updatedItems;
    });
  
    setLocalFormData((prev) => ({
      ...prev,
      NetAmount: items.reduce(
        (total, item, idx) =>
          idx === index ? total + calculatedAmount : total + (item.Amount || 0),
        0
      ),
    }));
  };
  

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="receipt-popup-overlay" onClick={onClose}></div>

      {/* Popup Content */}
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
            <TextBox
              placeholder="Person Name"
              value={localFormData.PersonName || ""}
              onValueChanged={(e) =>
                setLocalFormData({
                  ...localFormData,
                  PersonName: e.value,
                })
              }
            />
          </div>

          <div className="data-grid-container">
            <DataGrid
              dataSource={items}
              keyExpr="ItemID"
              onRowUpdating={(e) => {
                const index = items.findIndex(
                  (item) => item.ItemID === e.key
                );
                const updatedRow = { ...e.oldData, ...e.newData };
                updateRowData(updatedRow, index);
              }}
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
              <Column dataField="Rate" caption="Rate" />
              <Column dataField="Quantity" caption="Qty" />
              <Column dataField="Discount" caption="Discount amount" />
              <Column dataField="Amount" caption="Amount" allowEditing={false} />
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
                value={items.reduce((total, item) => total + (item.Quantity || 0), 0)}
                 readOnly
                labelMode="floating"
                width={120}
              />
            </div>
            <div className="summary">
              <TextBox
                label="Amount"
                labelMode="floating"
                value={items.reduce((total, item) => total + (item.Amount || 0), 0)}
                 readOnly
              />
              <TextBox
                label="Discount amount"
                labelMode="floating"
                value={items.reduce((total, item) => total + (item.Discount || 0), 0)}
                readOnly
              />
              <TextBox
                label="NetAmount"
                labelMode="floating"
                value={
                  items.reduce((total, item) => total + (item.Amount || 0), 0) - 
                  items.reduce((total, item) => total + (item.Discount || 0), 0)
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
