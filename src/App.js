import logo from './logo.svg';
import './App.css';
import UserRow from './UserRow';
import { useEffect, useState } from 'react';
import React from 'react';

function App() {
  const [userData, setUserData] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('')
  const [startpage, setStartPage] = useState(0)
  const [endPage, setEndPage] = useState(9)
  const [allChecked, setAllChecked] = useState(false)
  const pagesize = 10
  // const pages = Math.ceil(allUserData.length / pagesize)
  const pages = Math.ceil(userData.length / pagesize)

  const pageNumbers = []
  let num = 0;
  for (let i = 0; i < pages; i++) {
    let start = num
    let end = start + 9
    pageNumbers.push([start, end])
    num = end + 1
  }
  const endPageNumber = (pageNumbers.length > 0) ? pageNumbers[pageNumbers.length - 1][1] : 9;


  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      const data = await response.json();
      sortUserData(data)
      setUserData(data);
      setIsLoading(false)
      setAllUserData(data)
    }
    catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const sortUserData = (userArray) => {
    userArray.sort((a, b) => a - b)
    return userArray;
  }

  const handleDelete = (id) => {
    const temp = [...userData];
    const resData = temp.filter((row) => row.id !== id)
    sortUserData(resData)
    setUserData(resData)
    console.log("Deleted Data", resData)

  }


  const handleEdit = (id) => {
    const temp = [...userData];
    const resData = temp.find((row) => row.id === id)
    resData.isEdit = !resData.isEdit
    console.log(resData)
    sortUserData(temp)
    setUserData(temp)
  };

  const handleSave = (id, name, email, role) => {
    const temp = [...userData];
    const resData = temp.find((row) => row.id === id)
    resData.name = name;
    resData.email = email;
    resData.role = role;
    resData.isEdit = false;
    sortUserData(temp)
    setUserData(temp)
  };

  const handleCheckbox = (id) => {
    const temp = [...userData];
    temp.map((row) => {
      if (row.id === id)
        return row.isChecked = !row.isChecked
    })
    sortUserData(temp)
    setUserData(temp)
    console.log("checked users", temp)
  }

  const handleMultipleDelete = () => {
    const temp = [...userData];
    const newList = temp.filter(user => user.isChecked !== true)

    console.log("List after deleting selected users :", newList)
    sortUserData(newList)
    setUserData(newList)
    setAllChecked(false)
  }

  const handleDeleteAll = () => {
    setAllChecked(!allChecked)
    const temp = [...userData];
    console.log("start", startpage)
    console.log("end", endPage)
    const resData = temp.map((row, index) => {
      if (index >= startpage && index <= endPage) { return { ...row, isChecked: !row.isChecked } }
      else {
        { return { ...row, isChecked: row.isChecked } }
      }
    })
      ;
    console.log(resData)
    sortUserData(resData)
    setUserData(resData)
  }

  const handleSearchText = (e) => {
    setSearchText(e?.target?.value)
    const temp = [...allUserData];
    let searchString = e.target.value.toLowerCase();
    const searchedList = temp.filter((user) => {
      let userName = user.name.toLowerCase();
      return userName.match(searchString) || user.email.match(searchString) || user.role.match(searchString)
    })
    console.log(searchedList)
    sortUserData(searchedList)
    setUserData(searchedList)
  }


  const handlePagination = (start, end) => {
    setStartPage(start)
    setEndPage(end)
  }

  const handleFirst = () => {
    setStartPage(0)
    setEndPage(9)
  }

  const handleLast = () => {
    setStartPage(pageNumbers[pageNumbers.length - 1][0])
    setEndPage(pageNumbers[pageNumbers.length - 1][1])
  }

  const handlePrevious = () => {
    setStartPage(startpage - 10)
    setEndPage(endPage - 10)
  }

  const handleNext = () => {
    setStartPage(startpage + 10)
    setEndPage(endPage + 10)
  }

  return (
    <div className="App" style={{ overflowX: "auto" }}>
      <input type="search" id="gsearch" name="gsearch" placeholder="Search by name,email or role" value={searchText} onChange={(e) => handleSearchText(e)}></input>
      <table>

        <thead>
          <tr>
            <th id="checkbox"><input type="checkbox" checked={allChecked} onChange={handleDeleteAll} /></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? <tr><td>Loading User data......</td></tr> : userData.length === 0 ? <tr><td>No matching user Found :(</td></tr>
            : userData.slice(startpage, endPage + 1).map(user => {
              return <tr key={user.id}>
                <UserRow user={user} handleDelete={handleDelete} handleEdit={handleEdit} handleSave={handleSave} handleCheckbox={handleCheckbox} />
              </tr>
            })

          }
        </tbody>

      </table>
      <button type="button" style={{ backgroundColor: "rgb(220, 43, 90)", color: "white", cursor: "pointer" }} onClick={handleMultipleDelete}>Delete Selected</button>
      <div className="pagination">
        <button className={(startpage === 0) ? "Disabled" : "Active"} disabled={(startpage === 0) ? true : false} onClick={handleFirst}>{'<<'}</button>
        <button className={(startpage === 0) ? "Disabled" : "Active"}
          disabled={(startpage === 0) ? true : false}
          onClick={() => handlePrevious()}>{'<'}</button>
        {
          pageNumbers.map((page, index) => {
            return <button key={index}
              type="button"
              style={{
                backgroundColor: (startpage === page[0]) ? "transparent" : "rgb(67, 141, 226)",
                color: (startpage === page[0]) ? "rgb(67, 141, 226)" : "white",
                cursor: "pointer"
              }}
              onClick={() => handlePagination(pageNumbers[index][0], pageNumbers[index][1])}>
              {index + 1}</button>
          })
        }

        <button className={(endPage === endPageNumber) ? "Disabled" : "Active"} disabled={(endPage === endPageNumber) ? true : false} onClick={() => handleNext()}>{'>'}</button>
        <button className={(endPage === endPageNumber) ? "Disabled" : "Active"} disabled={(endPage === endPageNumber) ? true : false} onClick={() => handleLast()}>{'>>'}</button>

      </div>

    </div>
  );
}

export default App;

