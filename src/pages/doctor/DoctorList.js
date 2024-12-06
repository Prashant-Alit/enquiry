import { Button, DataGrid, Popup } from "devextreme-react";
import { Column, ColumnChooser, SearchPanel } from "devextreme-react/data-grid";
import { useCallback, useEffect, useState } from "react";
import { exportDataGrid } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import {
  addDoctorListData,
  deleteFromDoctorList,
  doctorSpecialtyID,
  editDoctorListData,
  getDoctorListData,
} from "../../services/service.api";
import notify from "devextreme/ui/notify";

import "./doctorlist.style.scss";
import CustomPopup from "../../components/popup/CustomPopup";

export default function DoctorList() {
  const [doctorList, setDoctorList] = useState();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [uniqueSpecialities, setUniqueSpecialities] = useState();
  const [dataGridRef, setDataGridRef] = useState(null);
  const [constValue, setConstValue] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [focusedRowKey, setFocusedRowKey] = useState(null);
  const [autoNavigateToFocusedRow, setAutoNavigateToFocusedRow] = useState(true);

  const handleContentReady = (e) => {
    setRecordCount(e.component.totalCount()); 
  };

  const doctorFields = [
    { dataField: "DoctorName", label: "Doctor Name" },
    { dataField: "Education", label: "Education" },
    {
      dataField: "SpecialityID",
      label: "Speciality",
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: uniqueSpecialities,
        displayExpr: "SpecialityName",
        valueExpr: "SpecialityID",
        placeholder: "Select a specialty",
      },
    },
  ];

  useEffect(() => {
    fetchSpecialtyIdList();
  }, []);

  useEffect(() => {
    fetchDoctorList();
  }, []);

  const fetchSpecialtyIdList = async () => {
    const response = await doctorSpecialtyID();
    if (response.isOk) {
      const uniqueSpecialities2 = [
        ...new Map(
          response?.data?.data.map((item) => [
            item.SpecialityName,
            {
              SpecialityID: item.SpecialityID,
              SpecialityName: item.SpecialityName,
            },
          ])
        ).values(),
      ];
      setUniqueSpecialities(uniqueSpecialities2);
    } else {
      notify(response.message, "error", 3000);
    }
  };

  const fetchDoctorList = async () => {
    const response = await getDoctorListData();

    if (response.isOk) {
      setDoctorList(response?.data?.data);
    } else {
      notify(response.message, "error", 3000);
    }
  };

  const handleEdit = (data) => {
    setConstValue(true);
    setFormData(data);
    setIsPopupVisible(true);
  };

  const handleAdd = () => {
    setConstValue(true);
    setFormData({});
    setIsAddPopupVisible(true);
  };

  const handleClose = () => {
    setIsPopupVisible(false);
    setIsAddPopupVisible(false);
    setConstValue(false);
    setFormData({});
  };

  const handleSave = async (formData) => {
    const isEdit = formData.DoctorID;
    try {
      let response;
      if (isEdit) {
        response = await editDoctorListData(formData);
        if (response.isOk) {
          notify("Doctor Record updated successfully!", "success", 3000);
        } else {
          notify(response.message, "error", 3000);
        }
      } else {
        response = await addDoctorListData(formData);
        const newDoctorID = response?.data?.data?.DoctorID;  
        setFocusedRowKey(newDoctorID);
        if (response.isOk) {
          notify("Doctor Record added successfully!", "success", 3000);
        } else {
          notify(response.message, "error", 3000);
        }
      }

      fetchDoctorList();
      handleClose();
    } catch (error) {
      notify("An error occurred while saving the data.", "error", 3000);
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteFromDoctorList(rowToDelete?.DoctorID);
    if (response.isOk) {
      notify("Doctor record deleted successfully!", "success", 3000);
      fetchDoctorList();
    } else {
      notify(response.message || "Failed to delete Doctor record", "error", 3000);
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
      doc.save("DoctorList.pdf");
    });
  };


  const onFocusedRowChanging = useCallback(async(e) => {
    const rowsCount = e.component.getVisibleRows().length;
    const pageCount = e.component.pageCount();
    const pageIndex = e.component.pageIndex();
    const event = e?.event;
    const key = event.key;
    if (key && e.prevRowIndex === e.newRowIndex) {
      if (e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
        await e.component.pageIndex(pageIndex + 1);
        e.component.option('focusedRowIndex', 0);
      } else if (e.newRowIndex === 0 && pageIndex > 0) {
        await e.component.pageIndex(pageIndex - 1);
        e.component.option('focusedRowIndex', rowsCount - 1);
      }
    }
  }, []);
  const handleFocusedRowChanged = useCallback((e) => {
    const data = e.row.data;
    console.log("handle row change",data)
   
    setFocusedRowKey(e.component.option('focusedRowKey'));
  }, []);
  const onAutoNavigateToFocusedRowChanged = useCallback((e) => {
    console.log("handle navigation auto ",e)
    setAutoNavigateToFocusedRow(e.value);
  }, []);

  return (
    <div>
      <div className="header-container">
        <div>
          <h2>Doctor's Records</h2>
        </div>
        <div className="btn-container">
          <Button className="btn1" onClick={handleExportToPDF}>
            Print
          </Button>
          <Button className="btn1" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>
      <div>
        <DataGrid
          dataSource={doctorList}
          showBorders={true}
          ref={(ref) => setDataGridRef(ref)}
          keyExpr="DoctorID"
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
        >
          <SearchPanel visible={true} width={300}/>
          <ColumnChooser
              enabled={true}
              mode="select"
              allowSearch={true}
              title="Customize Columns"
              width={300}
              height={400}
              popupComponent={(props) => (
                <div className="custom-column-chooser">{props.children}</div>
              )}
            />
          <Column
          caption="S.No"
          width={200} 
          alignment="left"
          cellRender={(rowData) => {
            const pageSize = rowData.component.pageSize(); 
            const pageIndex = rowData.component.pageIndex(); 
            const rowIndex = rowData.rowIndex; 
            return <span>{pageIndex * pageSize + rowIndex + 1}</span>;
          }}
        />
          <Column
            dataField="DoctorName"
            minWidth={100}
            alignment="left"
          ></Column>
          <Column
            dataField="Education"
            minWidth={100}
            alignment="left"
          ></Column>
          <Column dataField="SpecialityName" alignment="left"></Column>
          <Column
            caption="Actions"
            width={100}
            alignment="center"
            cellRender={({ data }) => (
              <div className="action-buttons">
                <Button
                  icon="edit"
                  onClick={() => handleEdit(data)}
                  className="action-button"
                />
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
        title={ isAddPopupVisible ? "Add Doctor's Data" : "Edit Doctor's data"}
        fields={doctorFields}
        formData={formData}
        onSave={handleSave}
        onClose={handleClose}
        constValue={isPopupVisible}
      />
    </div>
  );
}
