import { Button, DataGrid, Popup } from "devextreme-react";
import { Column, ColumnChooser, Grouping, GroupPanel, SearchPanel } from "devextreme-react/data-grid";
import { useCallback, useEffect, useState } from "react";
import {
  addAppointmentData,
  deletefromAppointmentList,
  editAppointmentData,
  getAppointmentData,
  getCityData,
  getDoctorData,
  getSpecialityData2,
  getStateData,
} from "../../services/service.api";
import { CustomPopup } from "../../components";
import { exportDataGrid } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import notify from "devextreme/ui/notify";

import "./appointment.scss"

export default function Appointment() {
  const [appointmentList, setAppointmentList] = useState();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [stateData, setStateData] = useState();
  const [cityData, setCityData] = useState([]);
  const [doctorList, setDoctorList] = useState();
  const [specialtyList, setSpecialtyList] = useState();
  const [dataGridRef, setDataGridRef] = useState(null);
  const [constValue, setConstantValue] = useState(true);
  const [recordCount, setRecordCount] = useState(0);
  const [autoExpandAll, setAutoExpandAll] = useState(true);
  const [doctorWithSpecialty,setDoctorWithSpeciality] = useState()
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [AppointmentID ,setAppointmentID] = useState(false)

  const handleContentReady = (e) => {
    setRecordCount(e.component.totalCount());
  };

  const GenderList = [
    { GenderName: "Male", GenderID: 0 },
    { GenderName: "Female", GenderID: 1 },
  ];

  // const MaritalStatusList = [
  //   { StatusName: "Single", StatusID: 0 },
  //   { StatusName: "Married", StatusID: 1 },
  // ];

  // const AppointmentFields = [
  //   {
  //     dataField: "AppointmentDateTime",
  //     label: "Appointment Date",
  //     editorType: "dxDateBox",
  //     editorOptions: {
  //       valueExpr:new Date().toISOString().slice(0, 10),
  //       value:new Date().toISOString().slice(0, 10)
  //     },
  //   },
  //   { dataField: "FirstName", label: "Patient First Name" },
  //   { dataField: "LastName", label: "Patient Last Name" },
  //   { dataField: "FullName", label: "Patient Full Name" },
  //   { dataField: "DOB", label: "DOB", editorType: "dxDateBox" },
  //   {
  //     dataField: "Gender",
  //     label: "Gender",
  //     editorType: "dxSelectBox",
  //     editorOptions: {
  //       dataSource: GenderList,
  //       displayExpr: "GenderName",
  //       valueExpr: "GenderID",
  //       placeholder: "Select Gender",
  //     },
  //   },
  //   { dataField: "MobileNo", label: "Mobile No" },
  //   {
  //     dataField: "MaritalStatus",
  //     label: "Marital Status",
  //     editorType: "dxSelectBox",
  //     editorOptions: {
  //       dataSource: MaritalStatusList,
  //       displayExpr: "StatusName",
  //       valueExpr: "StatusID",
  //       placeholder: "Select Marital Status",
  //     },
  //   },
  //   { dataField: "Address", label: "Address" },
  //   {
  //     dataField: "StateID",
  //     label: "State",
  //     editorType: "dxSelectBox",
  //     editorOptions: {
  //       dataSource: stateData,
  //       displayExpr: "StateName",
  //       valueExpr: "StateID",
  //       placeholder: "Select State",
       
  //     },
  //   },
  //   {
  //     dataField: "CityID",
  //     label: "City",
  //     editorType: "dxSelectBox",
  //     editorOptions: {
  //       dataSource: cityData,
  //       displayExpr: "CityName",
  //       valueExpr: "CityID",
  //       placeholder: "Select city", 
  //     }
  //   },
  //   { dataField: "ReasonForAppointment", label: "Reason For Appointment" },
  //   {
  //     dataField: "DoctorID",
  //     label: "Doctor Name",
  //     editorType: "dxSelectBox",
  //     editorOptions: {
  //       dataSource: doctorList,
  //       displayExpr: "DoctorName",
  //       valueExpr: "DoctorID",
  //       placeholder: "Select Doctor",
        
  //     },
  //   },
  //   {
  //     dataField: "SpecialityID",
  //     label: "Specialty",
  //     editorType: "dxSelectBox",
  //     editorOptions: {
  //       dataSource: specialtyList,
  //       displayExpr: "SpecialityName",
  //       valueExpr: "SpecialityID",
  //       placeholder: "Select Specialty",
       
  //     },
  //   },
  // ];
  useEffect(() => {
    const fetchData = async () => {
      const listdata = await getAppointmentData();
      setAppointmentList(listdata?.data?.data);
    };
    fetchData();
    StateData();
    CityDataList();
    doctorDataList();
    specialtyListData();
  }, []);

  const StateData = async () => {
    const response = await getStateData();
    setStateData(response);
  };

  const CityDataList = async () => {
    const cityresponse = await getCityData();
    setCityData(cityresponse);
  };

  const doctorDataList = async () => {
    const doctorListData = await getDoctorData();
    setDoctorWithSpeciality(doctorListData?.data?.data)
    const uniquedoctorList = [
      ...new Map(
        doctorListData?.data?.data.map((item) => [
          item.DoctorName,
          { DoctorID: item.DoctorID, DoctorName: item.DoctorName },
        ])
      ).values(),
    ];
    setDoctorList(uniquedoctorList);
  };

  const specialtyListData = async () => {
    const specialtydataList = await getSpecialityData2();
    setSpecialtyList(specialtydataList?.data?.data);
  };

  const handleSave = async (formData) => {
    console.log("Appoinnn",formData)
    try {
      let response;
      if (AppointmentID) {
        response = await editAppointmentData(formData);
        if (response.isOk) {
          notify("Appointment updated successfully!", "success", 3000);
        } else {
          notify(
            response.message || "Failed to update appointment.",
            "error",
            3000
          );
        }
      } else {
        response = await addAppointmentData(formData);
        if (response.isOk) {
          notify("Appointment added successfully!", "success", 3000);
        } else {
          notify(
            response.message || "Failed to add appointment.",
            "error",
            3000
          );
        }
      }

      const listdata = await getAppointmentData();
      setAppointmentList(listdata?.data?.data);
      handleClose();
    } catch (error) {
      notify("An unexpected error occurred.", "error", 3000);
    }
  };

  const handleDelete = async () => {
    
    const response = await deletefromAppointmentList(rowToDelete?.AppointmentID);
    if (response.isOk) {
      notify("Data deleted successfully!", "success", 3000);
      const listdata = await getAppointmentData();
      setAppointmentList(listdata?.data?.data);
    } else {
      notify(response.message || "Failed to delete ", "error", 3000);
    }
    setShowDeletePopup(false); 
  };

  const handleEdit = (data) => {
    console.log("DDDDAATTA",data)
    if(data?.AppointmentID){
      setAppointmentID(true)
    }
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
    setAppointmentID(false)
  };

  const handleExportToPDF = () => {
    if (!dataGridRef) return;

    const doc = new jsPDF();
    exportDataGrid({
      jsPDFDocument: doc,
      component: dataGridRef.instance,
    }).then(() => {
      doc.save("Appointment.pdf");
    });
  };
  return (
    <div>
      <div className="header-container">
        <div>
          <h2>Appointment List</h2>
        </div>
        <div className="btn-container">
          <Button className="btn1" onClick={handleExportToPDF}>
            Print
          </Button>
          <Button className="btn1" onClick={handleAdd}>
            ADD
          </Button>
        </div>
      </div>
      <div>
        <DataGrid
          dataSource={appointmentList}
          loadPanel={{
            enabled: true,         
            text: "Loading...",   
            shading: true,          
            showIndicator: true,         
          }}
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
          <GroupPanel visible={true} />
          <Grouping autoExpandAll={autoExpandAll} />
            {/* <SearchPanel
                visible={true}
                // highlightCaseSensitive={true}
                // text={searchText} 
               /> */}
          <ColumnChooser
            enabled={true}
            mode="select"
            allowSearch={true}
            title="Customize Columns"
            width={300}
            height={400}
            popupComponent={(props) => (
              <div className="custom-column-chooser">
                {props.children}
              </div>
            )}
          />
          <Column
            caption="S.No"
            width={80}
            alignment="center"
            allowHiding={false}
            cellRender={(rowData) => {
              const pageSize = rowData.component.pageSize();
              const pageIndex = rowData.component.pageIndex();
              const rowIndex = rowData.rowIndex;
              return <span>{pageIndex * pageSize + rowIndex + 1}</span>;
            }}
          />
          {/* <Column dataField="AppointmentID" minWidth={100} alignment="center"></Column> */}
          <Column
            dataField="AppointmentDateTime"
            minWidth={100}
            alignment="center"
            dataType="date"
            format="dd-MM-yyyy"
          ></Column>
          <Column
            dataField="FullName"
            minWidth={100}
            alignment="center"
          ></Column>
          <Column
            dataField="DOB"
            minWidth={100}
            alignment="center"
            dataType="date"
            format="dd-MM-yyyy"
          ></Column>
          <Column
            minWidth={100}
            alignment="center"
            dataField="Gender"
            calculateDisplayValue={(data) => {
              const gender = GenderList.find((g) => g.GenderID === data.Gender);
              return gender ? gender.GenderName : "";
            }}
          ></Column>
          <Column
            dataField="MobileNo"
            minWidth={100}
            alignment="center"
          ></Column>
          <Column dataField="ReasonForAppointment" alignment="center"></Column>
          <Column
            caption="Actions"
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
        visible={isAddPopupVisible || isPopupVisible}
        title={isAddPopupVisible ? "Add Appointment" : "Edit Appointment"}
        //  fields={AppointmentFields}
        formData={formData}
        cityData={cityData}
        stateData={stateData}
        specialtyList={specialtyList}
        doctorList={doctorWithSpecialty}
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  );
}
