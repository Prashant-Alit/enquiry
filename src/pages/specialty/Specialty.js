import React, { useEffect, useState } from "react";
import DataGrid, { Column, Paging } from "devextreme-react/data-grid";
import { Button } from "devextreme-react";
import notify from "devextreme/ui/notify";
import {
  addSpecialityData,
  deleteFromList,
  editSpecialityData,
  getSpecialityData,
} from "../../services/service.api";
import CustomPopup from "../../components/popup/CustomPopup";
import { exportDataGrid } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import "./specialty.style.scss";

export default function Speciality() {
  const [specialityList, setSpecialityList] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataGridRef, setDataGridRef] = useState(null);

  const SpecialityFields = [
    { dataField: "specialityName", label: "Speciality Name" },
    { dataField: "description", label: "Description" },
  ];

  useEffect(() => {
    fetchSpecialityList();
  }, []);

  const fetchSpecialityList = async () => {
    const response = await getSpecialityData();
    if (response.isOk) {
      setSpecialityList(response.data.data || []);
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
    setIsPopupVisible(true);
  };

  const handleAdd = () => {
    setFormData({});
    setIsAddPopupVisible(true);
  };

  const handleClose = () => {
    setIsPopupVisible(false);
    setIsAddPopupVisible(false);
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
    } catch (error) {
      notify("An error occurred while saving the data.", "error", 3000);
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteFromList(id.SpecialityID);
    if (response.isOk) {
      notify("Specialty deleted successfully!", "success", 3000);
      fetchSpecialityList();
    } else {
      notify(response.message || "Failed to delete specialty", "error", 3000);
    }
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
        <h2>Specialty List</h2>
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
      >
        <Paging enabled={true} />
        <Column dataField="SpecialityID" caption="ID" />
        <Column dataField="SpecialityName" caption="Name" />
        <Column dataField="Description" caption="Description" />
        <Column
          caption="Actions"
          cellRender={({ data }) => (
            <div className="action-buttons">
              <Button icon="edit" onClick={() => handleEdit(data)} />
              <Button
                icon="trash"
                onClick={() => handleDelete(data)}
                className="action-button"
              />
            </div>
          )}
        />
      </DataGrid>
      <CustomPopup
        visible={isPopupVisible || isAddPopupVisible }
        title={formData.specialityID ? "Edit Specialty" : "Add Specialty"}
        fields={
          formData.specialityID
            ? SpecialityFields 
            : SpecialityFields.filter(
                (field) => field.dataField !== "specialityID"
              ) 
        }
        formData={formData}
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  );
}
