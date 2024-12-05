import React, { useCallback, useEffect, useState } from "react";
import DataGrid, {
  Column,
  ColumnChooser,
  Editing,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";
import { Button, Popup } from "devextreme-react";
import notify from "devextreme/ui/notify";
import {
  addItemData,
  deleteItem,
  editItemData,
  getItemData,
} from "../../services/service.api";
import CustomPopup from "../../components/popup/CustomPopup";
import { exportDataGrid } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import "./item.style.scss";

export default function NewItemPage() {
  const [itemList, setItemList] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [constValue, setConstValue] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataGridRef, setDataGridRef] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [recordCount, setRecordCount] = useState(0);
  // const [focusedState, setFocusedState] = useState();
  const [focusedRowKey, setFocusedRowKey] = useState(89);
  const [autoNavigateToFocusedRow, setAutoNavigateToFocusedRow] = useState(true);
  const [addFocusToRow, setAddFocusToRow] = useState();

  const handleContentReady = (e) => {
    setRecordCount(e.component.totalCount());
  };

  const SpecialityFields = [{ dataField: "ItemName", label: "ItemName " }];

  useEffect(() => {
    fetchSpecialityList();
  }, []);

  // useEffect(() => {
  //   console.log("Valueee")
  //   handleFocusedRowChanged()
  // },[addFocusToRow])

  const fetchSpecialityList = async () => {
    const response = await getItemData();
    console.log("HHHHGGG", response?.data?.data);
    // const addRowValue = response?.data?.data;
    // console.log("****____", addRowValue);
    // const abc = addRowValue.filter((item) => item.ItemName == addFocusToRow);
    // if (abc.length) {
    //   setFocusedRowKey(abc.ItemID);
    //   console.log("chal gaya")
    // }
    // console.log("!!!!!!", abc, "@#@###", addFocusToRow);
    if (response.isOk) {
      setItemList(response.data.data || []);
    } else {
      notify(response.message, "error", 3000);
    }
  };

  const handleEdit = (data) => {
    setFormData({
      ItemID: data.ItemID,
      ItemName: data.ItemName,
    });
    setConstValue(true);
    setIsPopupVisible(true);
  };

  const handleAdd = () => {
    setFormData({});
    setConstValue(true);
    setIsAddPopupVisible(true);
  };

  const handleClose = () => {
    setIsPopupVisible(false);
    setIsAddPopupVisible(false);
    setConstValue(false);
    setFormData({});
  };

  const handleSave = async (formData) => {
    console.log("why is this getting called", formData);
    const isEdit = formData.ItemID;
    try {
      let response;
      if (isEdit) {
        response = await editItemData(formData);
        setFocusedRowKey(isEdit);
        handleFocusedRowChanged(formData)
        // setAddFocusToRow(formData.ItemID)
        if (response.isOk) {
          notify("Item updated successfully!", "success", 3000);
        } else {
          notify(response.message, "error", 3000);
        }
      } else {
        response = await addItemData(formData);
        console.log("responsess", response);
        //  handleFocusedRowChanged(formData)
        // setFocusedRowKey(isEdit)
        // if (response.isOk) {
          //  setAddFocusToRow(formData.ItemName);
        
        // }
        if (response.isOk) {
          notify("Item added successfully!", "success", 3000);
        } else {
          notify(response.message, "error", 3000);
        }
      }

      fetchSpecialityList();
      handleClose();
    } catch (error) {
      notify("An error occurred while saving the data.", "error", 3000);
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteItem(rowToDelete?.ItemID);
    if (response.isOk) {
      notify("Item deleted successfully!", "success", 3000);
      fetchSpecialityList();
    } else {
      notify(response.message || "Failed to delete specialty", "error", 3000);
    }
    setShowDeletePopup(false);
  };

  const handleExportToPDF = () => {
    if (!dataGridRef) return;

    const doc = new jsPDF();
    exportDataGrid({
      jsPDFDocument: doc,
      component: dataGridRef.instance,
    }).then(() => {
      doc.save("ItemList.pdf");
    });
  };

  const handleRowInserted = (e) => {
    console.log("handle ro", e);
    e.component.navigateToRow(e.key);
  };

  const onFocusedRowChanging = useCallback(async (e) => {
    console.log("focus row changing", e);
    const rowsCount = e.component.getVisibleRows().length;
    const pageCount = e.component.pageCount();
    const pageIndex = e.component.pageIndex();
    const event = e?.event;
    const key = event.key;
    if (key && e.prevRowIndex === e.newRowIndex) {
      if (e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
        await e.component.pageIndex(pageIndex + 1);
        e.component.option("focusedRowIndex", 0);
      } else if (e.newRowIndex === 0 && pageIndex > 0) {
        await e.component.pageIndex(pageIndex - 1);
        e.component.option("focusedRowIndex", rowsCount - 1);
      }
    }
  }, []);
  const handleFocusedRowChanged = useCallback((data) => {
    // const data = e.row.data;
    console.log("handle row change", data);
    //  setFocusedRowKey(e.component.option("focusedRowKey"));
     setFocusedRowKey(data.ItemID)
    onAutoNavigateToFocusedRowChanged(data);
  }, []);
  const onAutoNavigateToFocusedRowChanged = useCallback((data) => {
     console.log("handle navigation auto ",data);
    setAutoNavigateToFocusedRow(data.ItemID);
  }, []);

  return (
    <div>
      <div className="header-container">
        <h2>Items Records</h2>
        <div className="btn-container">
          <Button className="btn1" onClick={handleExportToPDF}>
            Print
          </Button>
          <Button className="btn1" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>

      <DataGrid
        dataSource={itemList}
        showBorders={true}
        keyExpr="ItemID"
        ref={(ref) => setDataGridRef(ref)}
        // focusedRowEnabled={true}
        // focusedRowKey={focusedRowKey}
        // autoNavigateToFocusedRow={autoNavigateToFocusedRow}
        // onFocusedRowChanging={onFocusedRowChanging}
        // onFocusedRowChanged={handleFocusedRowChanged}
        onExporting={handleExportToPDF}
        onContentReady={handleContentReady}
        onRowRemoving={(e) => {
          setRowToDelete(e.data);
          setShowDeletePopup(true);
          e.cancel = true;
        }}
        onRowInserted={(e) => handleRowInserted(e)}
      >
        <Paging enabled={true} />
        {/* <Editing/> */}
        <SearchPanel visible="true" width={300} />
        {/* <ColumnChooser
              enabled={true}
              mode="select"
              allowSearch={true}
              title="Customize Columns"
              width={300}
              height={400}
              popupComponent={(props) => (
                <div className="custom-column-chooser">{props.children}</div>
              )}
            /> */}
        <Column
          caption="S.No"
          width={300}
          alignment="left"
          cellRender={(rowData) => {
            const pageSize = rowData.component.pageSize();
            const pageIndex = rowData.component.pageIndex();
            const rowIndex = rowData.rowIndex;
            return <span>{pageIndex * pageSize + rowIndex + 1}</span>;
          }}
        />
        <Column
          dataField="ItemName"
          caption="Name"
          minWidth={100}
          alignment="left"
        />
        <Column
          caption="Actions"
          width={100}
          alignment="center"
          cellRender={({ data }) => (
            <div className="action-buttons">
              <Button icon="edit" onClick={() => handleEdit(data)} />
              <Button
                icon="trash"
                onClick={() => {
                  setRowToDelete(data);
                  setShowDeletePopup(true);
                }}
                className="action-button"
              />
            </div>
          )}
        />
      </DataGrid>
      <div style={{ marginTop: "5px", textAlign: "left" }}>
        <strong>Total Records: {recordCount}</strong>
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
            <Button text="Cancel" onClick={() => setShowDeletePopup(false)} />
          </div>
        </div>
      </Popup>
      <CustomPopup
        visible={isPopupVisible || isAddPopupVisible}
        title={formData.ItemName ? "Edit Item" : "Add Item"}
        fields={SpecialityFields}
        formData={formData}
        constValue={constValue}
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  );
}
