import { Button, DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import { exportDataGrid } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import { addDoctorListData, deleteFromDoctorList, doctorSpecialtyID, editDoctorListData, getDoctorListData } from "../../services/service.api";
import notify from "devextreme/ui/notify";

import "./doctorlist.style.scss"
import CustomPopup from "../../components/popup/CustomPopup";

export default function DoctorList() {
    const [doctorList, setDoctorList] = useState()
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [uniqueSpecialities,setUniqueSpecialities] = useState()
    const [dataGridRef, setDataGridRef] = useState(null);

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
          onValueChanged: (e) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              SpecialityID: e.value, 
            }));
          },
        },
      },
    ];
    
   
    useEffect(() => {
      fetchSpecialtyIdList();
    },[])

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
            { SpecialityID: item.SpecialityID, SpecialityName: item.SpecialityName }
          ])
        ).values(),
      ];
      setUniqueSpecialities(uniqueSpecialities2 )
      } else {
        notify(response.message, "error", 3000);
      }
    };

    const fetchDoctorList = async () => {
      const response = await getDoctorListData();
      
      if (response.isOk) {
        setDoctorList(response?.data?.data)
      } else {
        notify(response.message, "error", 3000);
      }
    };

    const handleEdit = (data) => {
       setFormData(data);
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
    const isEdit = formData.DoctorID;
    try {
      let response;
      if (isEdit) {
        response = await editDoctorListData(formData); 
        if (response.isOk) {
          notify("Speciality updated successfully!", "success", 3000);
        } else {
          notify(response.message, "error", 3000);
        }
      } else {
        response = await addDoctorListData(formData);
        if (response.isOk) {
          notify("Speciality added successfully!", "success", 3000);
        } else {
          notify(response.message, "error", 3000);
        }
      }
  
      fetchDoctorList()
      handleClose(); 
    } catch (error) {
      notify("An error occurred while saving the data.", "error", 3000);
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteFromDoctorList(id.DoctorID);
    if (response.isOk) {
      notify("Specialty deleted successfully!", "success", 3000);
      fetchDoctorList() 
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
      doc.save("DoctorList.pdf");
    });
  };
  return (
    <div>
     <div className="header-container">
     <div>
      <h2>Doctor List Page</h2>
      </div>
      <div className="btn-container">
        <Button className="btn1" onClick={handleExportToPDF}>Print</Button>
        <Button className="btn1" onClick={handleAdd}>Add</Button>
      </div>
     </div>
      <div>
        <DataGrid dataSource={doctorList}   showBorders={true}  ref={(ref) => setDataGridRef(ref)}
        onExporting={handleExportToPDF}>
            <Column dataField="DoctorID"></Column>
            <Column dataField="DoctorName"></Column>
            <Column dataField="Education"></Column>
            <Column dataField="SpecialityName"></Column>
            <Column
            caption="Actions"
            cellRender={({ data }) => (
              <div className="action-buttons">
                <Button
                  icon="edit"
                   onClick={() => handleEdit(data)}
                  className="action-button"
                />
                <Button
                  icon="trash"
                  onClick={() => handleDelete(data)}
                  className="action-button"
                />
              </div>
            )}
          />
        </DataGrid>
      </div>

      <CustomPopup
       visible={isPopupVisible ||isAddPopupVisible}
       title="Doctor List"
       fields={doctorFields}
       formData={formData}
       onSave={handleSave}
       onClose={handleClose}
      />
    </div>
  );
}
