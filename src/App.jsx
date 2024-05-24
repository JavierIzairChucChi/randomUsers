// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserName, setEditingUserName] = useState('');

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then(data => {
        setUsers(data.results.map((user, index) => ({
          id: index,
          name: `${user.name.first} ${user.name.last}`,
          photo: user.picture.large
        })));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const generateRandomUser = () => {
    fetch('https://randomuser.me/api/')
      .then(response => response.json())
      .then(data => {
        const newUser = {
          id: users.length,
          name: `${data.results[0].name.first} ${data.results[0].name.last}`,
          photo: data.results[0].picture.large
        };
        setUsers([...users, newUser]);
      })
      .catch(error => console.error('Error fetching random user:', error));
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const editUser = (userId) => {
    const userToEdit = users.find(user => user.id === userId);
    setEditingUserId(userId);
    setEditingUserName(userToEdit.name);
  };

  const saveEditedUser = () => {
    if (editingUserName) {
      setUsers(users.map(user => {
        if (user.id === editingUserId) {
          return {
            ...user,
            name: editingUserName
          };
        }
        return user;
      }));
      setEditingUserId(null);
      setEditingUserName('');
    } else {
      alert('Please enter a name for the user.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Random User Generator</h1>
        <div className="user-list">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <img src={user.photo} alt="User" />
              {editingUserId === user.id ? (
                <input
                  type="text"
                  value={editingUserName}
                  onChange={(e) => setEditingUserName(e.target.value)}
                />
              ) : (
                <p>{user.name}</p>
              )}
              <div className="button-container">
                {editingUserId === user.id ? (
                  <button onClick={saveEditedUser}>Save</button>
                ) : (
                  <button onClick={() => editUser(user.id)}>Edit</button>
                )}
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div className="add-user-container">
          <h2>Add New User</h2>
          <button onClick={generateRandomUser}>Generate Random User</button>
        </div>
      </header>
    </div>
  );
}

export default App;
