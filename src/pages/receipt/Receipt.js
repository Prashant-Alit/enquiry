import { Button, DataGrid, Popup } from "devextreme-react";
import { Column, ColumnChooser, MasterDetail, Pager, SearchPanel } from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import {
  addReceiptData,
  deleteFromReceiptList,
  editReceiptData,
  getDoctorData,
  getReceiptListData,
  getReceiptListDataByID,
  getItemListData,
  saveReceiptData,
  getReceiptNumber,
} from "../../services/service.api";
import notify from "devextreme/ui/notify";
import { exportDataGrid } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import ReceiptPopup from "../../components/receiptpopup/ReceiptPopup";

export default function Receipt() {
  const [receiptList, setReceiptList] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState(null);
  const [items, setItems] = useState([]);
  const [dataGridRef, setDataGridRef] = useState(null);
  const [recordCount, setRecordCount] = useState(0);
  const [doctorList, setDoctorList] = useState();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [itemList, setItemList] = useState();
  const [receiptNumber,setReceiptNumber] = useState()

  const handleContentReady = (e) => {
    setRecordCount(e.component.totalCount());
  };

  useEffect(() => {
    const fetchData = async () => {
      const listData = await getReceiptListData();
      setReceiptList(listData?.data?.data || []);
    };
    fetchData();
    doctorDataList();
    getItemList();
    
  }, []);

  const getReceiptNo = async () => {
    const Receipt = await getReceiptNumber();
    console.log("get receipt numbe ri calld",Receipt)
    setReceiptNumber(Receipt?.data?.data)
    return Receipt
  }

  const handleAdd = async() => {
    const newReceiptNumber = await getReceiptNo()
    console.log("Receipt inside handle add",newReceiptNumber)
    const newReceiptNo = Math.floor(10000 + Math.random() * 90000);
    setFormData({
      ReceiptNo: newReceiptNo,
      ReceiptDate: new Date().toISOString().slice(0, 10),
      DoctorID: "",
      Remarks: "",
      ReceiptDetail: [
        {
          ReceiptDetailID: 0,
          ReceiptID: 0,
          ItemID: "",
          Quantity: 0,
          Rate: 0,
          Discount: 0,
          Discountpercent: 0,
          Amount: 0,
        },
      ],
    });

    setItems([
      {
        ReceiptDetailID: 0,
        ReceiptID: 0,
        ItemID: null,
        Quantity: 0,
        Rate: 0,
        Discount: 0,
        Discountpercent: 0,
        Amount: 0,
      },
    ]);
    setIsPopupVisible(true);
  };

  const doctorDataList = async () => {
    const doctorListData = await getDoctorData();
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

  const getItemList = async () => {
    const ItemListData = await getItemListData();
    console.log("ITem List data", ItemListData?.data?.data);
    setItemList(ItemListData?.data?.data);
  };

  const handleEdit = async (data) => {
    try {
      const receiptData = await getReceiptListDataByID(data.ReceiptID);
      console.log(
        "receipt edit function",
        receiptData?.data?.data?.ReceiptDetail
      );
      setFormData(receiptData?.data?.data || {});
      setItems(receiptData?.data.data.ReceiptDetail || []);
      setIsPopupVisible(true);
    } catch (error) {
      notify("Failed to fetch receipt details", "error", 3000);
    }
  };

  const handleSave = async (data) => {
    console.log("Form Data for Save:", data);
    const upatedDoctorID = data;
    console.log("data with doctor id ", upatedDoctorID);
    // const ItemIDUpdated = {...upatedDoctorID.ReceiptDetail, ItemID:1001}
    // console.log("uuuuuIIII",ItemIDUpdated)
    try {
      let response;
      if (data.ReceiptID) {
        response = await editReceiptData(upatedDoctorID);
        if (response.isOk) {
          notify("Receipt updated successfully!", "success", 3000);
        } else {
          notify(
            response.message || "Failed to update receipt.",
            "error",
            3000
          );
          return;
        }
      } else {
        response = await addReceiptData(upatedDoctorID);
        if (response.isOk) {
          notify("Receipt added successfully!", "success", 3000);
        } else {
          notify(response.message || "Failed to add receipt.", "error", 3000);
          return;
        }
      }

      const updatedList = await getReceiptListData();
      setReceiptList(updatedList?.data?.data || []);
      setIsPopupVisible(false);
    } catch (error) {
      notify(error.message || "An unexpected error occurred.", "error", 3000);
    }
  };

  const handleDelete = async () => {
    console.log("row delete dta", rowToDelete);
    const response = await deleteFromReceiptList(rowToDelete?.ReceiptID);
    if (response.isOk) {
      notify("Receipt deleted successfully!", "success", 3000);
      const listData = await getReceiptListData();
      setReceiptList(listData?.data?.data || []);
    } else {
      notify(response.message || "Failed to delete Receipt", "error", 3000);
    }
    setShowDeletePopup(false);
  };

  const handleClose = () => {
    setIsPopupVisible(false);
    setFormData(null);
  };

  const handleExportToPDF = () => {
    if (!dataGridRef) return;

    const doc = new jsPDF();
    exportDataGrid({
      jsPDFDocument: doc,
      component: dataGridRef.instance,
    }).then(() => {
      doc.save("Receipt.pdf");
    });
  };

  const handleRowInserted = (e) =>{ 
    console.log("handle ro",e)
    e.component.navigateToRow(e.key)
  };

  return (
    <div>
      <div className="header-container">
        <h2>Receipt Records</h2>
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
        dataSource={receiptList}
        ref={(ref) => setDataGridRef(ref)}
        keyExpr="ReceiptNo"
        onExporting={handleExportToPDF}
        onContentReady={handleContentReady}
        onRowRemoving={(e) => {
          setRowToDelete(e.data);
          setShowDeletePopup(true);
          e.cancel = true;
        }}
        onRowInserted={(e) => handleRowInserted(e)}
      >
        <SearchPanel visible={true}  width={300}/>
        <ColumnChooser
              enabled={true}
              mode="select"
              allowSearch={true}
              title="Customize Columns"
              width={300}
              height={400}
              popupComponent={(props) => (
                <div className="custom-column-chooser">{props.children}</div>
              )}
            />
        <Pager
          visible={true}
          // allowedPageSizes={[5, 10, "all"]}
          // showPageSizeSelector={true}
          // showInfo={true}
          showNavigationButtons={true}
        />
        <Column
          caption="S.No"
          width={100}
          alignment="left"
          cellRender={(rowData) => {
            const pageSize = rowData.component.pageSize();
            const pageIndex = rowData.component.pageIndex();
            const rowIndex = rowData.rowIndex;
            return <span>{pageIndex * pageSize + rowIndex + 1}</span>;
          }}
        />
        <Column
          dataField="ReceiptNo"
          caption="Receipt No"
          minWidth={100}
          alignment="left"
        />
        <Column
          dataField="ReceiptDate"
          caption="Receipt Date"
          dataType="date"
          format="dd-MM-yyyy"
          minWidth={100}
          alignment="left"
        />
        <Column
         dataField="DoctorID"
         caption="Doctor name"
         alignment="left"
         cellRender={({ value }) => {
          const doctor = doctorList.find((doc) => doc.DoctorID === value);
          return <span>{doctor ? doctor.DoctorName : "Unknown"}</span>;
        }}
        />
        <Column
          dataField="NetAmount"
          caption="Net Amount"
          Width={1}
          alignment="left"
        />
        <Column dataField="Remarks" caption="Remarks" alignment="left" />
        <Column
          caption="Actions"
          width={100}
          alignment="center"
          cellRender={({ data }) => (
            <div className="action-buttons">
              <Button icon="edit" onClick={() => handleEdit(data)} />
              <Button
                icon="trash"
                onClick={() => {
                  setRowToDelete(data);
                  setShowDeletePopup(true);
                }}
              />
            </div>
          )}
        />
        {/* <MasterDetail enabled={true} component={receiptList} /> */
          
        }
        {/* <MasterDetail
          enabled={true}
          component={({ data }) => (
            <DataGrid
              dataSource={data.data.ReceiptDetail}
              showBorders={true}
              columnAutoWidth={true}
              keyExpr="ReceiptDetailID"
            >{
              console.log("dta beofre master detail",data?.data)
            }
              <Column dataField="ItemID" caption="Item ID" />
              <Column dataField="Quantity" caption="Quantity" />
              <Column dataField="Rate" caption="Rate" />
              <Column dataField="Amount" caption="Amount" />
            </DataGrid>
          )}
        /> */}
      </DataGrid>
      <div style={{ marginTop: "5px", textAlign: "left" }}>
        <strong>Total Records: {recordCount}</strong>
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

      {isPopupVisible && (
        <ReceiptPopup
          title={formData?.ReceiptID ? "Edit Receipt" : "New Receipt"}
          visible={isPopupVisible}
          formData={formData}
          items={items}
          ItemList={itemList}
          onClose={handleClose}
          onSave={handleSave}
          doctorList={doctorList}
        />
      )}
    </div>
  );
}
