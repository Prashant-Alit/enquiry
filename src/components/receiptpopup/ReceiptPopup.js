import React, { useState, useEffect, useCallback, useRef } from "react";
import { TextBox } from "devextreme-react/text-box";
import { TextArea } from "devextreme-react/text-area";
import DataGrid, {
  Column,
  Editing,
  Lookup,
  ToolbarItem,
} from "devextreme-react/data-grid";
import Toolbar, { Item } from "devextreme-react/toolbar";
import {
  Button,
  DateBox,
  Popup,
  ScrollView,
  SelectBox,
} from "devextreme-react";
import "./receiptpopup.scss";
import notify from "devextreme/ui/notify";

export default function ReceiptPopup({
  visible,
  onClose,
  title,
  formData,
  items: initialItems,
  ItemList,
  onSave,
  doctorList,
}) {
  const [localFormData, setLocalFormData] = useState(formData || {});
  const [items, setItems] = useState(formData?.ReceiptDetail || []);
  const [totalQuantity, setTotalQuantity] = useState();
  const [totlaDiscount, setTotalDiscount] = useState();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const datagridref = useRef();

  useEffect(() => {
    setLocalFormData(formData || {});
    setItems(initialItems || []);
  }, [formData, initialItems]);

  const getSaveButtonOptions = {
    text: "Save",
    onClick: () => handleSave(localFormData),
  };

  const handleSave = (localFormDataValue) => {
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

  const handleDelete = async () => {
    setLocalFormData((prev) => ({
      ...prev,
      ReceiptDetail: prev.ReceiptDetail.filter(
        (item) => item.ItemID !== rowToDelete.ItemID
      ),
    }));
    setShowDeletePopup(false);
  };

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

  const handleGenericCellValue = (
    newData,
    value,
    currentRowData,
    dataField
  ) => {
    newData[dataField] = value;

    const updatedRowData = { ...currentRowData, [dataField]: value };

    if (dataField === "Rate") {
      newData.Amount = (value || 0) * (updatedRowData.Quantity || 0);
    } else if (dataField === "Quantity") {
      newData.Amount = (updatedRowData.Rate || 0) * (value || 0);
    }

    setLocalFormData((prev) => {
      const updatedReceiptDetail = prev.ReceiptDetail.map((item) =>
        item === currentRowData ? updatedRowData : item
      );

      return { ...prev, ReceiptDetail: updatedReceiptDetail };
    });
  };

  const handleInitRow = (e) => {
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

      <Popup
        visible={visible}
        onHiding={onClose}
        dragEnabled={true}
        hideOnOutsideClick={true}
        title={title}
        width={950}
        maxHeight="800px"
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={getSaveButtonOptions}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={getCloseButtonOptions}
        />
        <ScrollView width="100%" height="100%">
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
              <SelectBox
                dataSource={doctorList}
                placeholder="Select Doctor"
                value={localFormData.DoctorID}
                valueExpr="DoctorID"
                displayExpr="DoctorName"
                onValueChanged={(e) =>
                  setLocalFormData({
                    ...localFormData,
                    DoctorID: e.value,
                  })
                }
              />
            </div>

            <div className="data-grid-container">
              <DataGrid
                ref={datagridref}
                dataSource={localFormData.ReceiptDetail || []}
                // keyExpr="ReceiptID"
                // keyExpr="ReceiptDetailID"
                //  keyExpr="ItemID"
                onRowRemoving={(e) => {
                  setRowToDelete(e.data);
                  setShowDeletePopup(true);
                  e.cancel = true;
                }}
                onInitNewRow={(e) => {
                  handleInitRow(e);
                }}
              >
                <Editing mode="cell" allowUpdating={true} allowAdding={true} />
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
                <Column
                  caption="Actions"
                  width={100}
                  alignment="center"
                  cellRender={({ data }) => (
                    <div className="action-buttons">
                      <Button
                        icon="trash"
                        onClick={() => {
                          setRowToDelete(data);
                          setShowDeletePopup(true);
                        }}
                      />
                    </div>
                  )}
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
          <Popup
            visible={showDeletePopup}
            onHiding={() => setShowDeletePopup(false)}
            title="Confirm Deletion"
            width={400}
            height={250}
          >
            <div className="">
              <p>Are you sure you want to delete this row?</p>
              <div className="delete-button-container">
                <Button text="Delete" onClick={handleDelete} />
                <Button
                  text="Cancel"
                  onClick={() => setShowDeletePopup(false)}
                />
              </div>
            </div>
          </Popup>
        </ScrollView>
      </Popup>
    </>
  );
}
