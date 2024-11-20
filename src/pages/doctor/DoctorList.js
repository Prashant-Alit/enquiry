import { Button, DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import { getDoctorListData } from "../../services/service.api";

import "./doctorlist.style.scss"

export default function DoctorList() {
    const [doctorList, setDoctorList] = useState()

    useEffect(() => {
        const fectData = async () =>  {
           const response = await getDoctorListData()
           console.log("rrrrrrrrrr",response?.data?.data)
           setDoctorList(response?.data?.data)
        }
        fectData();
    },[])
  return (
    <div>
     <div className="header-container">
     <div>
      <h2>Doctor List Page</h2>
      </div>
      <div className="btn-container">
        <Button className="btn1">Print</Button>
        <Button className="btn1">Add</Button>
      </div>
     </div>
      <div>
        <DataGrid dataSource={doctorList}>
            <Column dataField="DoctorID"></Column>
            <Column dataField="DoctorName"></Column>
            <Column dataField="Education"></Column>
            <Column dataField="SpecialityName"></Column>
        </DataGrid>
      </div>
    </div>
  );
}
