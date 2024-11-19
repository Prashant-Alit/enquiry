import { useEffect } from "react"
import { getSpecialityData } from "../../services/service.api";


export default function Specialty () {

    useEffect( () => {
        const fectData = async () => {
        const getlist = await getSpecialityData();
        console.log("get speciality data",getlist)
    }
    fectData();
})
    return (
        <div><h1>Specialty Page</h1></div>
    )
}