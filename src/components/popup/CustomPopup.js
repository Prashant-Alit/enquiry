import React, { useEffect, useState } from "react";
import { Popup } from "devextreme-react/popup";
import { Form, Item} from "devextreme-react/form";
import { DateBox, ScrollView, SelectBox, TextBox, Validator } from "devextreme-react";
import  { ToolbarItem} from "devextreme-react/data-grid";

import "./cutomepopup.style.scss";
import { NumericRule } from "devextreme-react/validator";

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
  const [localFormData, setLocalFormData] = useState(formData);
  const [localItems, setLocalItems] = useState([]);
  const [filteredCityData, setFilteredCityData] = useState(cityData);
  const [filteredDoctor, setFilteredDoctors] = useState(doctorList);

  useEffect(() => {
    setLocalFormData(formData);
    // setLocalItems(items || []);
    setFilteredCityData(cityData);
  }, [formData]);

  const handleFieldChange = (e) => {
    const value = e.value;
    setLocalFormData({
      ...localFormData,
      [e.dataField]: value,
    });

  };

  const GenderList = [
    { GenderName: "Male", GenderID: 0 },
    { GenderName: "Female", GenderID: 1 },
  ];

  const MaritalStatusList = [
    { StatusName: "Single", StatusID: 0 },
    { StatusName: "Married", StatusID: 1 },
  ];

  const getCloseButtonOptions = { text: "Close", onClick: () => handleClose() };
  const getSaveButtonOptions = {
    text: "Save",
    onClick: () => handleSave(localFormData),
  };

  const handleClose = () => {
    setLocalFormData({});
    onClose();
  }

  const handleSave = (localFormDataValue) => {
    onSave(localFormDataValue)
  }

  const handleFieldChange2 = (e) => {
    const { name, value } = e.component.option();
    setLocalFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "FirstName" || name === "LastName") {
        updatedData.FullName = `${updatedData.FirstName} ${updatedData.LastName}`;
      }

      return updatedData;
    });
  };

  const handleStateChange = (e) => {
    const selectedState = e.value;
    setLocalFormData((prevData) => ({
      ...prevData,
      StateID: selectedState,
      CityID: "",
    }));

    const newFilteredCities = cityData.filter(
      (city) => city.StateID === selectedState
    );
    setFilteredCityData(newFilteredCities);
  };

  const handleSpecialtyChange = async (e) => {
    const selectedSpecialty = e.value;
    setLocalFormData((prevData) => ({
      ...prevData,
      SpecialityID: selectedSpecialty,
      DoctorID: "",
    }));

    const newFilteredDoctors = doctorList.filter(
      (doctor) => doctor.SpecialityID === selectedSpecialty
    );
    setFilteredDoctors(newFilteredDoctors);
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      dragEnabled={true}
      hideOnOutsideClick={true}
      title={title}
      width={950}
      // resizeEnabled={true}
       height="auto"
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
      {/* <Toolbar>
              <Item
                location="after"
                widget="dxButton"
                toolbar="top"
                options={getSaveButtonOptions}
              ></Item>
              {/* </Toolbar> 
              {/* <button onClick={onClose} className="close-btn">
              Close
            </button> 
              {/* <div> 
              {/* <Toolbar> 
              <Item
                location="after"
                widget="dxButton"
                toolbar="top"
                cssClass="close-btn"
                options={getCloseButtonOptions}
              ></Item>
            </Toolbar> */}
      <ScrollView width="100%" height="100%">
        {constValue || fields ? (
          <Form
            // className="form-container"
            formData={localFormData}
            onFieldDataChanged={handleFieldChange}
            // colCount={2}
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
                // label="Appointment Date"
                // labelMode="floating"
                placeholder="Appointment Date"
                value={formData.AppointmentDateTime}
                onValueChanged={handleFieldChange2}
                displayFormat="dd-MM-yyyy"
                type="date"
                openOnFieldClick={true}
                // min={new Date()}
                // type="datetime"
              />
            </div>
            <div className="name-container">
              <div className="form-group">
                <label>First Name</label>
                <TextBox
                  name="FirstName"
                  // label="First Name"
                  placeholder="First name"
                  value={formData.FirstName}
                  onValueChanged={handleFieldChange2}
                  width={250}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <TextBox
                  name="LastName"
                  width={250}
                  // label="Last Name"
                  placeholder="Last name"
                  value={formData.LastName}
                  onValueChanged={handleFieldChange2}
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <TextBox
                  name="FullName"
                  width={350}
                  // label="Full Name"
                  placeholder="Full name"
                  value={localFormData.FullName}
                  onValueChanged={handleFieldChange2}
                  readOnly={true}
                />
              </div>
            </div>
            <div className="name-container">
            <div className="form-group">
              <label>DOB</label>
              <DateBox
                name="DOB"
                 width={250}
                // className="dx-selectbox dx-texteditor-input"
                // label="select DOB"
                placeholder="select DOB"
                value={formData.DOB}
                openOnFieldClick={true}
                onValueChanged={handleFieldChange2}
               min={ new Date(1900, 0, 1)}
               max={new Date()}
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
                // label="Gender"
              />
            </div>

            <div className="form-group">
              <label>Marital Status</label>
              <SelectBox
                name="MaritalStatus"
                width={362}
                value={formData.MaritalStatus}
                onValueChanged={handleFieldChange2}
                dataSource={MaritalStatusList}
                displayExpr="StatusName"
                valueExpr="StatusID"
                placeholder="Select Marital Status"
              />
            </div>

            

            </div>

             <div className="name-container">
             <div className="form-group">
              <label>Mobile No</label>
              <TextBox
                name="MobileNo"
                width={430}
                // label="Mobile NO"
                placeholder="Mobile NO"
                value={formData.MobileNo}
                onValueChanged={handleFieldChange2}
              >
                <Validator>
                    <NumericRule message="should be number" />
                </Validator>
              </TextBox>
            </div> 

            <div className="form-group">
              <label>Address</label>
              <TextBox
                name="Address"
                 width={500}
                //  label="Address"
                label="Address"
                value={formData.Address}
                onValueChanged={handleFieldChange2}
              />
            </div>
            </div>

           
            <div className="list-container">


            <div className="form-group">
              <label>State</label>
              <SelectBox
                name="StateID"
                width={440}
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
                width={440}
                value={formData.CityID}
                onValueChanged={handleFieldChange2}
                dataSource={filteredCityData}
                displayExpr="CityName"
                valueExpr="CityID"
                placeholder="Select City"
              />
            </div>
            </div>

            <div className="form-group">
              <label>Reason for Appointment</label>
              <TextBox
                name="ReasonForAppointment"
                // label="Reason for appointment"
                placeholder="Reason for Appointment"
                value={formData.ReasonForAppointment}
                onValueChanged={handleFieldChange2}
              />
            </div>
            <div className="list-container">

           
            <div className="form-group">
              <label>Specialty</label>
              <SelectBox
                name="SpecialityID"
                width={440}
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
                width={440}
                value={formData.DoctorID}
                onValueChanged={handleFieldChange2}
                dataSource={filteredDoctor}
                displayExpr="DoctorName"
                valueExpr="DoctorID"
                placeholder="Select Doctor"
              />
            </div>
            </div>
          </div>
        )}
      </ScrollView>
    </Popup>
  );
}
