import React, { useEffect, useState } from "react";
import DataGrid, { Column, ColumnChooser, Paging, SearchPanel } from "devextreme-react/data-grid";
import { Button, Popup } from "devextreme-react";
import notify from "devextreme/ui/notify";
import {
  addSpecialityData,
  deleteFromList,
  editSpecialityData,
  getSpecialityData,
  specialityIDLookupList,
} from "../../services/service.api";
import CustomPopup from "../../components/popup/CustomPopup";
import { exportDataGrid } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import "./specialty.style.scss";

export default function Speciality() {
  const [specialityList, setSpecialityList] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [constValue, setConstValue] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataGridRef, setDataGridRef] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [uniqueSpecialities, setUniqueSpecialities] = useState();

  const [recordCount, setRecordCount] = useState(0);

  const handleContentReady = (e) => {
    setRecordCount(e.component.totalCount());
  };

  const SpecialityFields = [
    { dataField: "specialityName", label: "Speciality Name" },
    { dataField: "description", label: "Description" },
  ];

  useEffect(() => {
    fetchSpecialityList();
    fetchSpecialtyIdLookUpList()
  }, []);

  const fetchSpecialityList = async () => {
    const response = await getSpecialityData();
    if (response.isOk) {
      setSpecialityList(response.data.data || []);
    } else {
      notify(response.message, "error", 3000);
    }
  };

  const fetchSpecialtyIdLookUpList = async () => {
    const response = await specialityIDLookupList();
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

  const handleEdit = (data) => {
    setFormData({
      specialityID: data.SpecialityID,
      specialityName: data.SpecialityName,
      description: data.Description,
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
    const isEdit = formData.specialityID;
    try {
      let response;
      if (isEdit) {
        response = await editSpecialityData(formData);
        if (response.isOk) {
          notify("Speciality updated successfully!", "success", 3000);
        } else {
          notify(response.message, "error", 3000);
        }
      } else {
        response = await addSpecialityData(formData);
        if (response.isOk) {
          notify("Speciality added successfully!", "success", 3000);
        } else {
          notify(response.message, "error", 3000);
        }
      }

      fetchSpecialityList();
      handleClose();
      setFormData({})
    } catch (error) {
      notify("An error occurred while saving the data.", "error", 3000);
    }
  };

  const handleDelete = async () => {
    const response = await deleteFromList(rowToDelete?.SpecialityID);
    if (response.isOk) {
      notify("Specialty deleted successfully!", "success", 3000);
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
      doc.save("SpecialityList.pdf");
    });
  };

  return (
    <div>
      <div className="header-container">
        <h2>Specialty Records</h2>
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
        dataSource={specialityList}
        showBorders={true}
        ref={(ref) => setDataGridRef(ref)}
        onExporting={handleExportToPDF}
        onContentReady={handleContentReady}
        onRowRemoving={(e) => {
          setRowToDelete(e.data);
          setShowDeletePopup(true);
          e.cancel = true;
        }}
      >
        <Paging enabled={true} />
        <SearchPanel visible="true" width={300} />
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
          width={250} 
          alignment="left"
          cellRender={(rowData) => {
            const pageSize = rowData.component.pageSize(); 
            const pageIndex = rowData.component.pageIndex(); 
            const rowIndex = rowData.rowIndex; 
            return <span>{pageIndex * pageSize + rowIndex + 1}</span>;
          }}
        />
        <Column
          dataField="SpecialityName"
          caption="Name"
          minWidth={100}
          alignment="left"
        />
        <Column
          dataField="Description"
          caption="Description"
          alignment="left"
        />
        <Column
          caption="Actions"
          alignment="center"
          width={100}
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
        title={formData.specialityID ? "Edit Specialty" : "Add Specialty"}
        fields={
          formData.specialityID
            ? SpecialityFields
            : SpecialityFields.filter(
                (field) => field.dataField !== "specialityID"
              )
        }
        formData={formData}
        constValue={constValue}
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  );
}
