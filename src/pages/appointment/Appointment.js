import { Button, DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import { getAppointmentData } from "../../services/service.api";

export default function Appointment() {
    const [appointmentList,setAppointmentList] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const listdata = await getAppointmentData();
            setAppointmentList(listdata?.data?.data)
        }
        fetchData()
    },[])
  return (
    <div>
            <div className="header-container">
        <div>
          <h2>Appointment List</h2>
        </div>
        <div className="btn-container">
          <Button className="btn1" onClick={() => console.log("Print clicked")}>
            Print
          </Button>
          <Button className="btn1" onClick={() => console.log("Print clicked")}>
            ADD
          </Button>
        </div>
      </div>
      <div>
        <DataGrid dataSource={appointmentList}>
            <Column dataField="AppointmentID"></Column>
            <Column dataField="AppointmentDateTime"></Column>
            <Column dataField="FullName"></Column>
            <Column dataField="DOB"></Column>
            <Column dataField="Gender"></Column>
            <Column dataField="MobileNo"></Column>
            <Column dataField="ReasonForAppointment"></Column>
            <Column
            caption="Actions"
            cellRender={({ data }) => (
              <div className="action-buttons">
                <Button
                  icon="edit"
                  // onClick={() => handleEdit(data)}
                  className="action-button"
                />
                <Button
                  icon="trash"
                  onClick={() => console.log("Delete clicked for", data)}
                  className="action-button"
                />
              </div>
            )}
          />
        </DataGrid>
      </div>
    </div>
  );
}
