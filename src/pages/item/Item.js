// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// import "./item.style.scss";

// export default function ItemPage (){
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     // Scene setup
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );

//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef.current,
//       alpha: true, // Transparent background
//     });

//     renderer.setSize(window.innerWidth * 0.5, window.innerHeight); // Half-width for 3D model
//     camera.position.z = 5;

//     // Geometry (Example: Rotating Torus)
//     const geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
//     const material = new THREE.MeshStandardMaterial({
//       color: 0xff6347,
//       metalness: 0.7,
//       roughness: 0.2,
//     });
//     const torus = new THREE.Mesh(geometry, material);
//     scene.add(torus);

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     const pointLight = new THREE.PointLight(0xffffff, 1);
//     pointLight.position.set(5, 5, 5);
//     scene.add(pointLight);

//     // Animation
//     const animate = () => {
//       requestAnimationFrame(animate);
//       torus.rotation.x += 0.01;
//       torus.rotation.y += 0.01;
//       renderer.render(scene, camera);
//     };

//     animate();

//     // Resize Handling
//     const handleResize = () => {
//       camera.aspect = window.innerWidth * 0.5 / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth * 0.5, window.innerHeight);
//     };
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       renderer.dispose();
//     };
//   }, []);

//   return (
//     <div className="new-item-page">
//       {/* Left Side: 3D Model */}
//       <div className="model-container">
//         <canvas ref={canvasRef}></canvas>
//       </div>

//       {/* Right Side: Product Description */}
//       <div className="description-container">
//         <h1>New Futuristic Item</h1>
//         <p>
//           This innovative item is crafted with the latest technology to meet
//           your needs. Its futuristic design and robust build make it a must-have
//           for enthusiasts.
//         </p>
//         <ul>
//           <li>Feature 1: Advanced design</li>
//           <li>Feature 2: High durability</li>
//           <li>Feature 3: Lightweight and portable</li>
//         </ul>
//         <button className="buy-now-btn">Buy Now</button>
//       </div>
//     </div>
//   );
// };

// // export default NewItemPage;

import React, { useEffect, useState } from "react";
import DataGrid, { Column, Paging, SearchPanel } from "devextreme-react/data-grid";
import { Button } from "devextreme-react";
import notify from "devextreme/ui/notify";
import {
  addItemData,
  addSpecialityData,
  deleteFromList,
  deleteItem,
  editItemData,
  editSpecialityData,
  getItemData,
  getSpecialityData,
} from "../../services/service.api";
import CustomPopup from "../../components/popup/CustomPopup";
import { exportDataGrid } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import "./item.style.scss";

export default function NewItemPage() {
  const [specialityList, setSpecialityList] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const [constValue, setConstValue] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataGridRef, setDataGridRef] = useState(null);

  const [recordCount, setRecordCount] = useState(0);

  const handleContentReady = (e) => {
    setRecordCount(e.component.totalCount());
  };

  const SpecialityFields = [
    { dataField: "ItemName", label: "ItemName " },
    // { dataField: "description", label: "Description" },
  ];

  useEffect(() => {
    fetchSpecialityList();
  }, []);

  const fetchSpecialityList = async () => {
    const response = await getItemData();
    console.log("response in item page",response?.data?.data)
    if (response.isOk) {
      setSpecialityList(response.data.data || []);
    } else {
      notify(response.message, "error", 3000);
    }
  };

  const handleEdit = (data) => {
    console.log("handle edit is called",data)
    setFormData({
      ItemID: data.ItemID,
      ItemName: data.ItemName,
      // description: data.Description,
    });
    setConstValue(true);
    setIsPopupVisible(true);
  };

  const handleAdd = () => {
    setFormData({});
    setConstValue(true);
    setIsAddPopupVisible(true);
  };

  const handleClose = () => {
    setIsPopupVisible(false);
    setIsAddPopupVisible(false);
    setConstValue(false);
    setFormData({});
  };

  const handleSave = async (formData) => {
    const isEdit = formData.ItemID;
    try {
      let response;
      if (isEdit) {
        response = await editItemData(formData);
        if (response.isOk) {
          notify("Item updated successfully!", "success", 3000);
        } else {
          notify(response.message, "error", 3000);
        }
      } else {
        response = await addItemData(formData);
        if (response.isOk) {
          notify("Item added successfully!", "success", 3000);
        } else {
          notify(response.message, "error", 3000);
        }
      }

      fetchSpecialityList();
      handleClose();
    } catch (error) {
      notify("An error occurred while saving the data.", "error", 3000);
    }
  };

  const handleDelete = async (id) => {
    const response = await deleteItem(id.ItemID);
    if (response.isOk) {
      notify("Item deleted successfully!", "success", 3000);
      fetchSpecialityList();
    } else {
      notify(response.message || "Failed to delete specialty", "error", 3000);
    }
  };

  const handleExportToPDF = () => {
    if (!dataGridRef) return;

    const doc = new jsPDF();
    exportDataGrid({
      jsPDFDocument: doc,
      component: dataGridRef.instance,
    }).then(() => {
      doc.save("SpecialityList.pdf");
    });
  };

  return (
    <div>
      <div className="header-container">
        <h2>Items Records</h2>
        <div className="btn-container">
          <Button className="btn1" onClick={handleExportToPDF}>
            Print
          </Button>
          <Button className="btn1" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>

      <DataGrid
        dataSource={specialityList}
        showBorders={true}
        ref={(ref) => setDataGridRef(ref)}
        onExporting={handleExportToPDF}
        onContentReady={handleContentReady}
      >
        <Paging enabled={true} />
        <SearchPanel visible="true"/>
        <Column
          caption="S.No"
          width={80} 
          alignment="center"
          cellRender={(rowData) => {
            const pageSize = rowData.component.pageSize(); 
            const pageIndex = rowData.component.pageIndex(); 
            const rowIndex = rowData.rowIndex; 
            return <span>{pageIndex * pageSize + rowIndex + 1}</span>;
          }}
        />
        {/* <Column
          dataField="SpecialityID"
          caption="ID"
          minWidth={100}
          alignment="center"
        /> */}
        <Column
          dataField="ItemName"
          caption="Name"
          minWidth={100}
          alignment="center"
        />
        {/* <Column
          dataField="Description"
          caption="Description"
          alignment="center"
        /> */}
        <Column
          caption="Actions"
          alignment="center"
          cellRender={({ data }) => (
            <div className="action-buttons">
              <Button icon="edit" onClick={() => handleEdit(data)} />
              <Button
                icon="trash"
                onClick={() => handleDelete(data)}
                className="action-button"
              />
            </div>
          )}
        />
      </DataGrid>
      <div style={{ marginTop: "5px", textAlign: "left" }}>
        <strong>Total Records: {recordCount}</strong>
      </div>
      <CustomPopup
        visible={isPopupVisible || isAddPopupVisible}
        title={formData.ItemName ? "Edit Item" : "Add Item"}
        fields={SpecialityFields}
        formData={formData}
        constValue={constValue}
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  );
}

