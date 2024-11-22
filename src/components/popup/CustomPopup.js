import React, { useEffect, useState } from "react";
import { Popup } from "devextreme-react/popup";
import { Form, Item } from "devextreme-react/form";
import { ScrollView } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";

export default function CustomPopup({
  title,
  fields,
  visible,
  onSave,
  onClose,
  formData,
}) {
  const [localFormData, setLocalFormData] = useState({});

  useEffect(() => {
    setLocalFormData({ ...formData });
  }, [formData]);

  const handleFieldChange = (e) => {
    const value = e.value;
    setLocalFormData({
      ...localFormData,
      [e.dataField]: value,
    });
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
      width={600}
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
        <Form formData={formData} onFieldDataChanged={handleFieldChange}>
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
      </ScrollView>
    </Popup>
  );
}

