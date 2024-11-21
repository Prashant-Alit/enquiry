import { Button, DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import { addDoctorListData, deleteFromDoctorList, doctorSpecialtyID, editDoctorListData, getDoctorListData } from "../../services/service.api";

import "./doctorlist.style.scss"
import CustomPopup from "../../components/popup/CustomPopup";
import notify from "devextreme/ui/notify";

export default function DoctorList() {
    const [doctorList, setDoctorList] = useState()
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
    const [speciltyId , setSpecialtyId] = useState();
    const [formData, setFormData] = useState({});
    const [uniqueSpecialities,setUniqueSpecialities] = useState()
    // let uniqueSpecialities = []

    const doctorFields = [
      { dataField: "DoctorName", label: "DoctorName" },
      { dataField: "Education", label: "Education" },
      // { dataField: "SpecialityID", label: "SpecialityID" },
      {
        dataField: "specialityName", 
        label: "Speciality",
        editorType: "dxSelectBox",
        editorOptions: {
          dataSource: uniqueSpecialities, 
          placeholder: "Select a speciality",
        },
      },
    ]
   
    useEffect(() => {
      fetchSpecialtyIdList();
    },[])

    useEffect(() => {
      fetchDoctorList();
    }, []);

    const fetchSpecialtyIdList = async () => {
      const listdata = await  doctorSpecialtyID();
      console.log("liiiiiiiissssttttt",listdata?.data?.data)

      // uniqueSpecialities = [
      //   ...new Map(listdata?.data?.data.map((item) => [item.SpecialityName, item])).values(),
      // ].map((item) => item.SpecialityName);

      const uniqueSpecialitiesList = [...new Set(listdata?.data?.data.map((item) => item.SpecialityName))];

      console.log("uiuiuiuiuiu",uniqueSpecialities)
      setUniqueSpecialities(uniqueSpecialitiesList )
      if(listdata.isOk){
        setSpecialtyId(listdata?.data?.data)
      } else  {
        notify(listdata.message, "error", 3000);
      }
    }
    console.log("sppppppp",speciltyId)
    const fetchDoctorList = async () => {
      const response = await getDoctorListData();
      
      if (response.isOk) {
        setDoctorList(response?.data?.data)
      } else {
        notify(response.message, "error", 3000);
      }
    };

    const handleEdit = (data) => {
      console.log("ddddddd",data)
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
    console.log("iiiiiiii", id.DoctorID);
    const response = await deleteFromDoctorList(id.DoctorID);
    if (response.isOk) {
      notify("Specialty deleted successfully!", "success", 3000);
      fetchDoctorList() 
    } else {
      notify(response.message || "Failed to delete specialty", "error", 3000);
    }
  };
  return (
    <div>
     <div className="header-container">
     <div>
      <h2>Doctor List Page</h2>
      </div>
      <div className="btn-container">
        <Button className="btn1">Print</Button>
        <Button className="btn1" onClick={handleAdd}>Add</Button>
      </div>
     </div>
      <div>
        <DataGrid dataSource={doctorList}>
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
        visible={isAddPopupVisible}
        title="Add Doctor Data"
        fields={doctorFields}
        formData={formData}
        onSave={handleSave}
        onClose={handleClose}
      />

      <CustomPopup
       visible={isPopupVisible}
       title="Doctor List"
       fields={doctorFields}
       formData={formData}
       onSave={handleSave}
       onClose={handleClose}
      />
    </div>
  );
}
