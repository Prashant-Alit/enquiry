import React, { useEffect, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import { Form, Item, SimpleItem,GroupItem } from "devextreme-react/form";
import { DateBox, ScrollView, SelectBox, TextBox } from "devextreme-react";
import DataGrid, {
  Column,
  Editing,
  ToolbarItem,
} from "devextreme-react/data-grid";

import "./cutomepopup.style.scss";

export default function CustomPopup({
  title,
  fields,
  visible,
  onSave,
  onClose,
  formData,
  constValue,
  updateRowData,
  reciptValue,
  stateData,
  cityData,
  doctorList,
  specialtyList,
  items,
}) {
  const [localFormData, setLocalFormData] = useState({});
  const [localItems, setLocalItems] = useState([]);
  const [filteredCityData, setFilteredCityData] = useState(cityData);
  const [filteredDoctor,setFilteredDoctors] = useState(doctorList)
  

console.log("formdata from diff",formData)
  // const [appointmentDataForm,setAppointmentDataForm] = useState({
  //   // appointmentID:"",
  //   StateID: null,
  //   CityID: null,
  //   FirstName:"",
  //   LastName:"",
  //   FullName:"",
  //   DOB:"",
  //   Gender:"",
  //   MobileNo:"",
  //   MaritalStatus:"",
  //   Address:"",
  //   StateID:"",
  //   CityID:2,
  //   ReasonForAppointment:"",
  //   SpecialityID:"",
  //   DoctorID:"",
  //   // otherField: "", // other fields
  // });
  // console.log("FFFFooomm,form",formData,"LLLLLL>>>",localFormData)

  // const formDataRef = useRef({
  //   // appointmentID:"",
  //   StateID: null,
  //   CityID: null,
  //   FirstName:"",
  //   LastName:"",
  //   FullName:"",
  //   DOB:"",
  //   Gender:"",
  //   MobileNo:"",
  //   MaritalStatus:"",
  //   Address:"",
  //   StateID:"",
  //   CityID:2,
  //   ReasonForAppointment:"",
  //   SpecialityID:"",
  //   DoctorID:"",
  //   // otherField: "", // other fields
  // });

  useEffect(() => {
    setLocalFormData(formData);
    setLocalItems(items || []);
    setFilteredCityData(cityData)
  }, []);

 
  const handleFieldChange = (e) => {
    const value = e.value;
    setLocalFormData({
      ...localFormData,
      [e.dataField] : value
    });

    // const updatedFormData = { ...localFormData, [e.dataField]: value };
    // setAppointmentDataForm(updatedFormData)
    // setLocalFormData(updatedFormData);

    //  if (e.dataField === "StateID") {
    //    let filteredCities = cityData.filter((city) => city.StateID === localFormData.StateID);
    //   console.log("Citytytytyt",filteredCities)
    //   setFilteredCityData(filteredCities);
    // //   updatedFormData["CityID"] = null; // Reset CityID when state changes
    //  }
    // formDataRef.current[e.dataField] = value;
    //  console.log("state ki id",appointmentDataForm ,"forwadref ki value>>>>>>>>>>>>>>>",formDataRef.current,"?????????????????",formDataRef.current.StateID);
  };

  const GenderList = [
    { GenderName: "Male", GenderID: 0 },
    { GenderName: "Female", GenderID: 1 },
  ];

  const MaritalStatusList = [
    { StatusName: "Single", StatusID: 0 },
    { StatusName: "Married", StatusID: 1 },
  ];

  const getCloseButtonOptions = { text: "Close", onClick: onClose };
  const getSaveButtonOptions = {
    text: "Save",
    onClick: () => onSave(localFormData),
  };

  const handleFieldChange2 = (e) => {
    const { name, value } = e.component.option();
    console.log("++++++++",localFormData)
    setLocalFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      
      if (name === 'FirstName' || name === 'LastName') {
        updatedData.fullName = `${updatedData.FirstName} ${updatedData.LastName}`;
      }
      
      return updatedData;
    });
  };

  const handleStateChange = (e) => {
    const selectedState = e.value;
    console.log("----------",localFormData)
    setLocalFormData((prevData) => ({
      ...prevData,
      StateID: selectedState,
      CityID: '', 
    }));

    const newFilteredCities = cityData.filter(city => city.StateID === selectedState);
    setFilteredCityData(newFilteredCities);
  };

  const handleSpecialtyChange = async (e) => {
    const selectedSpecialty = e.value;
    console.log("PPPP",e.value)
    console.log("&&&&^^^^",localFormData)
    setLocalFormData((prevData) => ({
      ...prevData,
      SpecialityID: selectedSpecialty,
      DoctorID: '', 
    }));

    const newFilteredDoctors = doctorList.filter(doctor => doctor.SpecialityID === selectedSpecialty);
    setFilteredDoctors(newFilteredDoctors);
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      dragEnabled={true}
      hideOnOutsideClick={true}
      title={title}
      width={800}
      height={500}
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
        {constValue || fields ? (
          <Form
          className="form-container"
          formData={localFormData}
          onFieldDataChanged={handleFieldChange}
          colCount={2}
          >
            {fields.map((field) => (
              <Item
                key={field.dataField}
                dataField={field.dataField}
                editorType={field.editorType || "dxTextBox"}
                label={{ text: field.label }}
                editorOptions={field.editorOptions || {}}
              />
            ))}
          </Form>
        ) : (
          <div className="appointment-form">
      <div className="form-group">
        <label>Appointment Date</label>
        <DateBox
          name="AppointmentDateTime"
          value={formData.AppointmentDateTime}
          onValueChanged={handleFieldChange2}
          displayFormat="yyyy-MM-dd"
          type="date"
        />
      </div>
     <div className="name-container">
      <div className="form-group">
        <label>First Name</label>
        <TextBox
          name="FirstName"
          value={formData.FirstName}
          onValueChanged={handleFieldChange2}
        />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <TextBox
          name="LastName"
          value={formData.LastName}
          onValueChanged={handleFieldChange2}
        />
      </div>

      <div className="form-group">
        <label>Full Name</label>
        <TextBox
          name="fullName"
          value={localFormData.fullName}
          onValueChanged={handleFieldChange2}
          readOnly={true}
        />
      </div>
   </div>
      <div className="form-group">
        <label>DOB</label>
        <DateBox
          name="DOB"
          value={formData.DOB}
          onValueChanged={handleFieldChange2}
        />
      </div>

      <div className="form-group">
        <label>Gender</label>
        <SelectBox
          name="Gender"
          value={formData.Gender}
          onValueChanged={handleFieldChange2}
          dataSource={GenderList}
          displayExpr="GenderName"
          valueExpr="GenderID"
          placeholder="Select Gender"
        />
      </div>

      <div className="form-group">
        <label>Mobile No</label>
        <TextBox
          name="MobileNo"
          value={formData.MobileNo}
          onValueChanged={handleFieldChange2}
        />
      </div>

      <div className="form-group">
        <label>Marital Status</label>
        <SelectBox
          name="MaritalStatus"
          value={formData.MaritalStatus}
          onValueChanged={handleFieldChange2}
          dataSource={MaritalStatusList}
          displayExpr="StatusName"
          valueExpr="StatusID"
          placeholder="Select Marital Status"
        />
      </div>

      <div className="form-group">
        <label>Address</label>
        <TextBox
          name="Address"
          value={formData.Address}
          onValueChanged={handleFieldChange2}
        />
      </div>

      <div className="form-group">
        <label>State</label>
        <SelectBox
          name="StateID"
          value={formData.StateID}
           onValueChanged={handleStateChange}
          dataSource={stateData}
          displayExpr="StateName"
          valueExpr="StateID"
          placeholder="Select State"
        />
      </div>

      <div className="form-group">
        <label>City</label>
        <SelectBox
          name="CityID"
          value={formData.CityID}
          onValueChanged={handleFieldChange2}
           dataSource={filteredCityData}
          displayExpr="CityName"
          valueExpr="CityID"
          placeholder="Select City"
        />
      </div>

      <div className="form-group">
        <label>Reason for Appointment</label>
        <TextBox
          name="ReasonForAppointment"
          value={formData.ReasonForAppointment}
          onValueChanged={handleFieldChange2}
        />
      </div>

      <div className="form-group">
        <label>Specialty</label>
        <SelectBox
          name="SpecialityID"
          value={formData.SpecialityID}
          onValueChanged={handleSpecialtyChange}
          dataSource={specialtyList}
          displayExpr="SpecialityName"
          valueExpr="SpecialityID"
          placeholder="Select Specialty"
        />
      </div>

      <div className="form-group">
        <label>Doctor Name</label>
        <SelectBox
          name="DoctorID"
          value={formData.DoctorID}
          onValueChanged={handleFieldChange2}
          dataSource={filteredDoctor}
          displayExpr="DoctorName"
          valueExpr="DoctorID"
          placeholder="Select Doctor"
        />
      </div>
    </div>
          // <Form
          //   formData={localFormData}
          //   labelLocation="top"
          //   onFieldDataChanged={handleFieldChange}
          //   colCount={2}
          // >
          //   {console.log("Appointment form third",localFormData,">>>>>>>>>>>>>",formDataRef.current)}
          
          //     <Item
          //        dataField="AppointmentDateTime"
          //        editorType="dxDateBox"
          //        label={{ text: "Appointment Date" }}
          //        labelMode="floating"
          //        editorOptions={{
          //          type: "date", 
          //          displayFormat: "yyyy-MM-dd", 
          //        }}
          //     />
          //     <SimpleItem
          //       dataField="FirstName"
          //       editorType="dxTextBox"
          //       label={{ text: "First Name" }}
          //     />
          //     <SimpleItem
          //       dataField="LastName"
          //       editorType="dxTextBox"
          //       label={{ text: "Last Name" }}
          //     />
          //     <SimpleItem
          //       dataField="fullName"
          //       editorType="dxTextBox"
          //       label={{ text: "Full Name" }}
          //       editorOptions={{ readOnly: true }}
          //     />
          //   <GroupItem>
          //     <Item
          //       dataField="DOB"
          //       editorType="dxDateBox"
          //       label={{ text: "DOB" }}
          //     />
          //     <SimpleItem
          //       dataField="Gender"
          //       editorType="dxSelectBox"
          //       label={{ text: "Gender" }}
          //       editorOptions={{
          //         dataSource: GenderList,
          //         displayExpr: "GenderName",
          //         valueExpr: "GenderID",
          //         placeholder: "Select Gender",
          //       }}
               
          //     />
          //     <SimpleItem
          //       dataField="MobileNo"
          //       editorType="dxTextBox"
          //       label={{ text: "Mobile No" }}
                
          //     />
          //   </GroupItem>
          //   <GroupItem>
          //     <SimpleItem
          //       dataField="MaritalStatus"
          //       editorType="dxSelectBox"
          //       label={{ text: "Marital Status" }}
          //       editorOptions={ {
          //         dataSource: MaritalStatusList,
          //         displayExpr: "StatusName",
          //         valueExpr: "StatusID",
          //         placeholder: "Select Marital Status",
          //       }}
               
          //     />
          //     <SimpleItem
          //       dataField="Address"
          //       editorType="dxTextBox"
          //       label={{ text: "Address" }}
          //     />
          //     <SimpleItem
          //       dataField="StateID"
          //       editorType="dxSelectBox"
          //       label={{ text: "State" }}
          //       editorOptions= {{
          //         dataSource: stateData,
          //         displayExpr: "StateName",
          //         valueExpr: "StateID",
          //         placeholder: "Select State",
          //       }}
          //     />
          //   </GroupItem>
          //   <GroupItem>
          //     <SimpleItem
          //       dataField="CityID"
          //        editorType="dxSelectBox"
          //       label={{ text: "City" }}
          //       editorOptions={{
          //         dataSource: filteredCityData ,
          //         displayExpr: "CityName",
          //         valueExpr: "CityID",
          //         placeholder: "Select city", 
          //       }}
          //     />
          //     <SimpleItem
          //       dataField="ReasonForAppointment"
          //       editorType="dxTextBox"
          //       label={{ text: "Reason for Appointment" }}
          //     />
          //   </GroupItem>
          //   <GroupItem>

          //   <SimpleItem
          //       dataField="SpecialityID"
          //       editorType="dxSelectBox"
          //       label={{ text: "Specialty" }}
          //       editorOptions= {{
          //         dataSource: specialtyList,
          //         displayExpr: "SpecialityName",
          //         valueExpr: "SpecialityID",
          //         placeholder: "Select Specialty",
                 
          //       }}
          //     />
          //     <SimpleItem
          //       dataField="DoctorID"
          //       editorType="dxSelectBox"
          //       label={{ text: "Doctor Name" }}
          //       editorOptions = {{
          //         dataSource: doctorList,
          //         displayExpr: "DoctorName",
          //         valueExpr: "DoctorID",
          //         placeholder: "Select Doctor",
                  
          //       }}
          //     />
          //   </GroupItem>
          // </Form>
        )}
      </ScrollView>
    </Popup>
  );
}
