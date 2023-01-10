import { hover } from "@testing-library/user-event/dist/hover";
import React, { useState } from "react";
import EditUserDetails from "./EditUserDetails";

function UserRow(props) {
  const { id = "", name = "", email = "", role = "", isEdit, isChecked = false } = props.user
  const { handleDelete = () => { }, handleEdit = () => { }, handleSave = () => { }, handleCheckbox = () => { } } = props



  return <>
    {isEdit ? <EditUserDetails user={props.user} handleSave={handleSave} />
      : <><td id="checkbox"><input type="checkbox" checked={isChecked} onChange={() => handleCheckbox(id)} style={{ cursor: "pointer" }} /></td>
        <td>{name}</td>
        <td>{email}</td>
        <td>{role}</td>
        <td><span className="material-symbols-sharp" id="edit" onClick={() => handleEdit(id)} style={{ cursor: "pointer" }}>
          edit_square
        </span><span className="material-symbols-outlined" id="delete" onClick={() => handleDelete(id)} style={{ cursor: "pointer" }}>
            delete
          </span></td></>}
  </>

}

export default UserRow;