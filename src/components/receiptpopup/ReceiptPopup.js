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
}) {
  const [localFormData, setLocalFormData] = useState(formData || {});
  const [items, setItems] = useState(formData.items || []);

  useEffect(() => {
    setLocalFormData(formData || {});
    setItems(initialItems || []);
  }, [formData, initialItems]);

  const handleSave = () => {
    const netAmount = items.reduce((total, item) => total + (item.Amount || 0), 0); 
    const updatedData = { ...localFormData.data, ReceiptDetail: items, NetAmount:netAmount}; 
      onSave(updatedData);
  };

  const updateRowData = (newItem, key) => {
    console.log("cell is clicked ", newItem, "keyyy", key);
    setItems((prevItems) => {
      return prevItems.map((item, index) => {
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
          formData={localFormData?.data}
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
          </GroupItem>
        </Form>
        <DataGrid
          dataSource={items}
          keyExpr="ReceiptDetailID"
          onRowUpdating={(e) => {
            const updatedRow = { ...e.oldData, ...e.newData };
            const key = items.findIndex(
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
          <Column
            dataField="ItemID"
            caption="Item Name"
            setCellValue={(newData, value) => {
              newData.ItemID = value;
            }}
          />
          <Column
            dataField="Rate"
            caption="Rate"
            setCellValue={(newData, value, currentRowData) => {
              newData.Rate = value;
              const key = items.findIndex(
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
              const key = items.findIndex(
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
              const key = items.findIndex(
                (item) =>
                  item.ReceiptDetailID === currentRowData.ReceiptDetailID
              );
              updateRowData(newData, key);
            }}
          />
          <Column
            dataField="Amount"
            caption="Net Amount"
            // allowEditing={false}
          />
        </DataGrid>

        <Form
          formData={localFormData?.data}
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
