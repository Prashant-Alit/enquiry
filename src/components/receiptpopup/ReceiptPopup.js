import React, { useState, useEffect } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { Form, SimpleItem, GroupItem } from "devextreme-react/form";
import DataGrid, { Column, Editing } from "devextreme-react/data-grid";
import { ScrollView } from "devextreme-react/scroll-view";

export default function ReceiptPopup({
  visible,
  onClose,
  title,
  formData,
  items: initialItems,
  onSave,
  doctorList
}) {
  const [localFormData, setLocalFormData] = useState(formData || {});
  const [items, setItems] = useState(formData.ReceiptDetail || []);

  useEffect(() => {
     setLocalFormData(formData || {});
    setItems(initialItems || []);
  }, [formData, initialItems]);

  const handleSave = () => {
    const netAmount = localFormData.ReceiptDetail.reduce((total, item) => total + (item.Amount || 0), 0); 
    console.log(".>>>>>>net amout",netAmount)
    const updatedData = { ...localFormData, NetAmount:netAmount}; 
    console.log("uuuuuuuuuuuuu",updatedData,"fffffffff",localFormData)
        onSave(updatedData);
  };

  const updateRowData = (newItem, key) => {
    setLocalFormData((prevData) => {
      const updatedReceiptDetail = prevData.ReceiptDetail.map((item, index) => {
        if (index === key) {
          const grossAmount = newItem.Rate * newItem.Quantity || 0;
          const discountAmount = (grossAmount * (newItem.Discount || 0)) / 100;
          return {
            ...item,
            ...newItem,
            Amount: grossAmount - discountAmount,
          };
        }
        return item;
      });
      
      console.log("Updated state: ", { ...prevData, ReceiptDetail: updatedReceiptDetail });
      
      return { ...prevData, ReceiptDetail: updatedReceiptDetail };
    });
  };
  
  

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={title}
      width={700}
      height={500}
    >
      <ToolbarItem
        widget="dxButton"
        toolbar="top"
        location="after"
        options={{ text: "Save", type: "success", onClick: handleSave }}
      />
      <ToolbarItem
        widget="dxButton"
        toolbar="top"
        location="after"
        options={{ text: "Close", type: "danger", onClick: onClose }}
      />

      <ScrollView width="100%" height="100%">
        {console.log("form data in receipt popup", formData)}
        <Form
          formData={localFormData}
          onFieldDataChanged={(e) =>
            setLocalFormData((prev) => ({ ...prev, [e.dataField]: e.value }))
          }
          labelLocation="top"
        >
          <GroupItem>
            <SimpleItem
              dataField="ReceiptNo"
              label={{ text: "Receipt No" }}
               editorOptions={{ readOnly: true }}
            />
            <SimpleItem
              dataField="ReceiptDate"
              label={{ text: "Receipt Date" }}
              editorType="dxDateBox"
            />
            {/* {console.log("loal form data for doctor list",doctorList,"llll",localFormData)}
           <SimpleItem
              dataField="doctorName"
              editorType="dxSelectBox"
              label={{ text: "Doctor Name" }}
              editorOptions={{
                dataSource: doctorList,
                displayExpr: "DoctorName", 
                valueExpr: "doctorID", 
                value: localFormData.doctorID,
                onValueChanged: (e) => {
                  setLocalFormData((prev) => ({
                    ...prev,
                    doctorID: e.value, 
                    doctorName: doctorList.find((doc) => doc.DoctorID === e.value)
                      ?.DoctorName,
                  }));
                },
              }}
            /> */}

          </GroupItem>
        </Form>
        {console.log("receipt data before data grid",localFormData.ReceiptDetail,"ffffff",localFormData)}
        <DataGrid
          dataSource={localFormData.ReceiptDetail}
          keyExpr="ReceiptDetailID"
          onRowUpdating={(e) => {
            const updatedRow = { ...e.oldData, ...e.newData };
            const key = localFormData.ReceiptDetail.findIndex(
              (item) => item.ReceiptDetailID === e.key
            );
            updateRowData(updatedRow, key);
          }}
        >
          <Editing
            mode="cell"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          />
          {/* <Column
            dataField="ItemID"
            caption="Item Name"
            setCellValue={(newData, value) => {
              newData.ItemID = value;
            }}
          /> */}
          <Column
            dataField="Rate"
            caption="Rate"
            setCellValue={(newData, value, currentRowData) => {
              newData.Rate = value;
              const key = localFormData.ReceiptDetail.findIndex(
                (item) =>
                  item.ReceiptDetailID === currentRowData.ReceiptDetailID
              );
              updateRowData(newData, key);
            }}
          />
          <Column
            dataField="Quantity"
            caption="Qty"
            setCellValue={(newData, value, currentRowData) => {
              newData.Quantity = value;
              const key = localFormData.ReceiptDetail.findIndex(
                (item) =>
                  item.ReceiptDetailID === currentRowData.ReceiptDetailID
              );
              updateRowData(newData, key);
            }}
          />
      
          <Column
            dataField="Discount"
            caption="Discount (%)"
            setCellValue={(newData, value, currentRowData) => {
              newData.Discount = value;
              const key = localFormData.ReceiptDetail.findIndex(
                (item) =>
                  item.ReceiptDetailID === currentRowData.ReceiptDetailID
              );
              updateRowData(newData, key);
            }}
          />
              <Column
            dataField="Amount"
            caption=" Amount"
             allowEditing={false}
          />
          {/* <Column
            dataField="Discount"
            caption="Discount Amount"
             allowEditing={false}
          /> */}
          {/* <Column
            dataField="NetAmount"
            caption="Net Amount"
             allowEditing={false}
          /> */}
        </DataGrid>

        <Form
          formData={localFormData}
          onFieldDataChanged={(e) =>
            setLocalFormData((prev) => ({ ...prev, [e.dataField]: e.value }))
          }
        >
          <SimpleItem
            dataField="Remarks"
            label={{ text: "Remarks" }}
            editorType="dxTextArea"
          />
        </Form>
      </ScrollView>
    </Popup>
  );
}
