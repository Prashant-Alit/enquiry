import { useEffect, useState } from "react"
import { getSpecialityData } from "../../services/service.api";
import { DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";


export default function Specialty () {
    const [specialityList , setSpecialityList] = useState()

    useEffect( () => {
        const fectData = async () => {
        const getlist = await getSpecialityData();
        console.log("get speciality data",getlist?.data?.data)
        if(getlist){
            setSpecialityList(getlist?.data?.data)
        }
    }
    fectData();
})
    return (
        <div><h1>Specialty Page</h1>
          <DataGrid dataSource={specialityList}>
          <Column dataField="SpecialityID"></Column>
          </DataGrid>
        </div>
    )
}