// import React, { useEffect, useState } from "react";
// import DataGrid, {
//   Column,
//   Editing,
//   Popup,
//   Paging,
//   Form,
//   ToolbarItem,
// } from "devextreme-react/data-grid";
// import { Item } from "devextreme-react/form";
// import { Button } from "devextreme-react";
// import { getSpecialityData } from "../../services/service.api";
// import "./specialty.style.scss";

// export default function Speciality() {
//   const [specialityList, setSpecialityList] = useState([]);
//   const [isPopupVisible,setIsPopupVisible] = useState(true)

//   useEffect(() => {
//     const fectData = async () => {
//       const getlist = await getSpecialityData();
//       console.log("get speciality data", getlist?.data?.data);
//       if (getlist) {
//         setSpecialityList(getlist?.data?.data);
//       }
//     };
//     fectData();
//   }, []);

//   const handlePrint = () => {
//     console.log("Print button clicked");
//     // Implement print functionality here
//   };

//   const handleClose = () => {
//     console.log("Close button clicked");
//     setIsPopupVisible(false)
//     // Implement close functionality here
//   };

//   const handlepopup = () => {
//     console.log("jkfjkhsdjkhdkjhddskjhsdkjkdsjkjdhuuu");
//   };

//   const buttonOptions2 = { text: "Close", onClick:handleClose };
//   const buttonOptions1 = { text: "Save", onClick: handlepopup };
//    console.log("opopoop",isPopupVisible)
//   return (
//     <div>
//       <div className="heade-container">
//         <div>
//           <h2>Specialty List</h2>
//         </div>
//         <div className="btn-container">
//           <Button className="btn1" onClick={handlePrint}>
//             Print
//           </Button>
//           <Button className="btn1" onClick={handleClose}>
//             ADD
//           </Button>
//         </div>
//       </div>
//       <div id="data-grid-demo">
//         <DataGrid dataSource={specialityList} showBorders={true}>
//           <Paging enabled={true} />
//           <Editing
//             mode="popup"
//             allowUpdating={true}
//             allowAdding={true}
//             allowDeleting={true}
//           >
//             <Popup width={700} height={525} visible={isPopupVisible} onHiding={handleClose}>
//               <ToolbarItem
//                 text="Specialty Master"
//                 location="before"
//               ></ToolbarItem>
//               <ToolbarItem
//                 widget="dxButton"
//                 location="after"
//                 options={buttonOptions1}
//               ></ToolbarItem>
//               <ToolbarItem
//                 widget="dxButton"
//                 location="after"
//                 options={buttonOptions2}
//               ></ToolbarItem>
//             </Popup>
//             <Form>
//               <Item itemType="group" colCount={2} colSpan={2}>
//                 <Item dataField="SpecialityName" />
//                 <Item dataField="Description" />
//               </Item>
//             </Form>
//           </Editing>

//           <Column dataField="SpecialityID" />
//           <Column dataField="SpecialityName" />
//           <Column dataField="Description" />
//           <Column>
//             <Editing />
//           </Column>
//         </DataGrid>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Form,
  ToolbarItem,
} from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import { Button } from "devextreme-react";
import { getSpecialityData,  } from "../../services/service.api"; // Assume saveSpecialityData API
import "./specialty.style.scss";

export default function Speciality() {
  const [specialityList, setSpecialityList] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState({}); // To store form data for saving

  useEffect(() => {
    const fetchData = async () => {
      const getlist = await getSpecialityData();
      console.log("get speciality data", getlist?.data?.data);
      if (getlist) {
        setSpecialityList(getlist?.data?.data);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    console.log("Print button clicked");
    // Implement print functionality here
  };

  const handleAdd = () => {
    setFormData({}); // Reset form data for new entry
    setIsPopupVisible(true);
  };

  const handleClose = () => {
    console.log("Close button clicked");
    setIsPopupVisible(false);
  };

  const handleSave = async () => {
    console.log("Saving form data", formData);

    // try {
    //   const response = await saveSpecialityData(formData); // Save API call
    //   console.log("Save response", response);
    //   // Refresh the speciality list after saving
    //   const updatedList = await getSpecialityData();
    //   setSpecialityList(updatedList?.data?.data || []);
    //   setIsPopupVisible(false); // Close the popup
    // } catch (error) {
    //   console.error("Error saving speciality", error);
    // }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buttonOptions2 = { text: "Close", onClick: handleClose };
  const buttonOptions1 = { text: "Save", onClick: handleSave };

  return (
    <div>
      <div className="heade-container">
        <div>
          <h2>Specialty List</h2>
        </div>
        <div className="btn-container">
          <Button className="btn1" onClick={handlePrint}>
            Print
          </Button>
          <Button className="btn1" onClick={handleAdd}>
            ADD
          </Button>
        </div>
      </div>
      <div id="data-grid-demo">
        <DataGrid dataSource={specialityList} showBorders={true}>
          <Paging enabled={true} />
          <Editing
            mode="popup"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup
              width={700}
              height={525}
              visible={isPopupVisible}
              onHiding={handleClose}
            >
              <ToolbarItem
                text="Specialty Master"
                location="before"
              ></ToolbarItem>
              <ToolbarItem
                widget="dxButton"
                location="after"
                options={buttonOptions1}
              ></ToolbarItem>
              <ToolbarItem
                widget="dxButton"
                location="after"
                options={buttonOptions2}
              ></ToolbarItem>
            </Popup>
            <Form>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item
                  dataField="SpecialityName"
                  editorType="dxTextBox"
                  editorOptions={{
                    value: formData.SpecialityName || "",
                    onValueChanged: (e) =>
                      setFormData((prev) => ({
                        ...prev,
                        SpecialityName: e.value,
                      })),
                  }}
                />
                <Item
                  dataField="Description"
                  editorType="dxTextBox"
                  editorOptions={{
                    value: formData.Description || "",
                    onValueChanged: (e) =>
                      setFormData((prev) => ({
                        ...prev,
                        Description: e.value,
                      })),
                  }}
                />
              </Item>
            </Form>
          </Editing>

          <Column dataField="SpecialityID" />
          <Column dataField="SpecialityName" />
          <Column dataField="Description" />
        </DataGrid>
      </div>
    </div>
  );
}
