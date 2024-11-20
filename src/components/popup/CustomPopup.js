
import React, { useState } from "react";
import Popup from "devextreme-react/popup";
import { Button, TextBox } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";

export default function CustomPopup({ visible, title, formData, onSave, onClose, onInputChange,onValuechanged }) {
 
  const getCloseButtonOptions ={text:'Close' ,onClick:onClose}
  const getsaveButtonOptions = {text:'save',onClick:onSave}
  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={title}
      width={500}
      height={300}
      hideOnOutsideClick={true}
    >
       <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={getsaveButtonOptions}
        />
       <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={getCloseButtonOptions}
        />
      <div className="popup-content">
        <TextBox placeholder="specialty name"onValueChanged={onValuechanged} ></TextBox>
        <TextBox placeholder="Description" onValueChanged={onInputChange} ></TextBox>
      </div>
    </Popup>
  );
}

