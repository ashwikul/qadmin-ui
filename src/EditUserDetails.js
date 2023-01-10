import React, { useState } from "react";

const EditUserDetails = (props) => {
  const { id = "", name = "", email = "", role = "", isEdit } = props.user;
  const { handleSave = () => { } } = props
  const [editName, SetEditName] = useState(name);
  const [editEmail, SetEditEmail] = useState(email);
  const [editRole, SetEditRole] = useState(role);

  const handleNameChange = (e) => {
    SetEditName(e?.target?.value);
  };
  const handleEmailChange = (e) => {
    SetEditEmail(e?.target?.value);
  };
  const handleRoleChange = (e) => {
    SetEditRole(e?.target?.value);
  };
  return (
    <>
      <td id="checkbox"><input type="checkbox" /></td>
      <td><input type="text" value={editName} onChange={(e) => handleNameChange(e)} /></td>
      <td><input type="text" value={editEmail} onChange={(e) => handleEmailChange(e)} /></td>
      <td><input type="text" value={editRole} onChange={(e) => handleRoleChange(e)} /></td>

      <td><span className="material-symbols-outlined" onClick={() => handleSave(id, editName, editEmail, editRole)} style={{ cursor: "pointer" }}>
        save
      </span></td>
    </>
  );
};

export default EditUserDetails;
