import React, { useEffect, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import { Form, Item, SimpleItem } from "devextreme-react/form";
import { ScrollView } from "devextreme-react";
import DataGrid, {
  Column,
  Editing,
  GroupItem,
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
  items,
}) {
  const [localFormData, setLocalFormData] = useState({});
  const [localItems, setLocalItems] = useState([]);

  const formDataRef = useRef({
    // appointmentID:"",
    StateID: null,
    CityID: null,
    FirstName:"",
    LastName:"",
    FullName:"",
    DOB:"",
    Gender:"",
    MobileNo:"",
    MaritalStatus:"",
    Address:"",
    StateID:"",
    CityID:2,
    ReasonForAppointment:"",
    SpecialityID:"",
    DoctorID:"",
    // otherField: "", // other fields
  });

  useEffect(() => {
    setLocalFormData({ ...formData });
    setLocalItems(items || []);
  }, [items]);

  const handleFieldChange = (e) => {
    const value = e.value;
    formDataRef.current[e.dataField] = value;
    console.log("state ki id", formDataRef.current);
  };

  const getCloseButtonOptions = { text: "Close", onClick: onClose };
  const getSaveButtonOptions = {
    text: "Save",
    onClick: () => onSave(localFormData),
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
        ) : reciptValue ? (
          <>
            <Form
              formData={localFormData}
              onFieldDataChanged={handleFieldChange}
              labelLocation="top"
              colCount={2}
            >
              <GroupItem>
                {/* <SimpleItem dataField="receiptNo" label={{ text: "Receipt No" }} editorOptions={{ readOnly: true }} /> */}
                {/* <SimpleItem dataField="receiptDate" label={{ text: "Receipt Date" }} editorType="dxDateBox" /> */}
              </GroupItem>
              <GroupItem>
                <SimpleItem
                  dataField="personName"
                  label={{ text: "Person Name" }}
                />
              </GroupItem>
            </Form>
            <h3>Items</h3>
            <DataGrid
              dataSource={localItems}
              onEditingStart={(e) =>
                updateRowData(e.component.option("dataSource"))
              }
              onRowUpdated={(e) =>
                updateRowData(e.component.option("dataSource"))
              }
              onRowInserted={(e) =>
                updateRowData(e.component.option("dataSource"))
              }
              onRowRemoved={(e) =>
                updateRowData(e.component.option("dataSource"))
              }
            >
              <Editing
                mode="cell"
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}
              />
              <Column dataField="ItemID" caption="Item Name" />
              <Column dataField="unit" caption="Unit" />
              <Column dataField="Rate" caption="Rate" />
              <Column dataField="Quantity" caption="Qty" />
              <Column dataField="Discount" caption="Discount %" />
              <Column
                dataField="Amount"
                caption="Gross Amount"
                allowEditing={false}
              />
              <Column
                dataField="discountAmount"
                caption="Discount Amount"
                allowEditing={false}
              />
              <Column
                dataField="netAmount"
                caption="Net Amount"
                allowEditing={false}
              />
            </DataGrid>

            {/* Remarks */}
            <Form formData={formData}>
              <SimpleItem
                dataField="remarks"
                label={{ text: "Remarks" }}
                editorType="dxTextArea"
              />
            </Form>
          </>
        ) : (
          <Form
            formData={localFormData}
            labelLocation="top"
            onFieldDataChanged={handleFieldChange}
            colCount={3}
          >
            <GroupItem>
              <SimpleItem
                dataField="appointmentNo"
                editorType="dxTextBox"
                label={{ text: "Appointment No" }}
              />
              <SimpleItem
                dataField="AppointmentDateTime"
                editorType="dxDateBox"
                label={{ text: "Appointment Date" }}
              />
              <SimpleItem
                dataField="AppointmentTime"
                editorType="dxTextBox"
                label={{ text: "Appointment Time" }}
              />
            </GroupItem>
            <GroupItem>
              <SimpleItem
                dataField="FirstName"
                editorType="dxTextBox"
                label={{ text: "First Name" }}
              />
              <SimpleItem
                dataField="LastName"
                editorType="dxTextBox"
                label={{ text: "Last Name" }}
              />
              <SimpleItem
                dataField="fullName"
                editorType="dxTextBox"
                label={{ text: "Full Name" }}
                editorOptions={{ readOnly: true }}
              />
            </GroupItem>
            <GroupItem>
              <SimpleItem
                dataField="dob"
                editorType="dxDateBox"
                label={{ text: "DOB" }}
              />
              <SimpleItem
                dataField="gender"
                editorType="dxSelectBox"
                label={{ text: "Gender" }}
                // editorOptions={{ items: genderOptions }}
              />
              <SimpleItem
                dataField="mobileNo"
                editorType="dxTextBox"
                label={{ text: "Mobile No" }}
                editorOptions={{ mask: "+1 (000) 000-0000" }}
              />
            </GroupItem>
            <GroupItem>
              <SimpleItem
                dataField="maritalStatus"
                editorType="dxSelectBox"
                label={{ text: "Marital Status" }}
                // editorOptions={{ items: maritalStatusOptions }}
              />
              <SimpleItem
                dataField="address"
                editorType="dxTextBox"
                label={{ text: "Address" }}
              />
              <SimpleItem
                dataField="state"
                editorType="dxTextBox"
                label={{ text: "State" }}
              />
            </GroupItem>
            <GroupItem>
              <SimpleItem
                dataField="city"
                 editorType="dxSelectBox"
                label={{ text: "City" }}
              />
              <SimpleItem
                dataField="reason"
                editorType="dxTextBox"
                label={{ text: "Reason for Appointment" }}
              />
            </GroupItem>
            <GroupItem>
              <SimpleItem
                dataField="doctorName"
                editorType="dxSelectBox"
                label={{ text: "Doctor Name" }}
                // editorOptions={{ items: doctorNameOptions }}
              />
              <SimpleItem
                dataField="specialty"
                editorType="dxSelectBox"
                label={{ text: "Specialty" }}
                // editorOptions={{ items: specialtyOptions }}
              />
              <SimpleItem
                dataField="education"
                editorType="dxTextBox"
                label={{ text: "Education" }}
              />
            </GroupItem>
          </Form>
        )}
      </ScrollView>
    </Popup>
  );
}
