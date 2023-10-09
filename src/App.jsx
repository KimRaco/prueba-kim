import { useState, useEffect } from 'react'
import './App.css'

function App() {


  const API_URL = `https://randomuser.me/api/?results=100`
  const [users, setUsers] = useState()
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [buttonText, setButtonText] = useState("Ordenar por país");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [rowColors, setRowColors] = useState([]);
  


  useEffect(() => {
    fetch(`${API_URL}`)
      .then((response) => response.json())
      .then(data => {
        setUsers(data.results)

      })
  }, []);

  useEffect(() => {
    console.log(users)
  }, [users])


  const handleSort = (field) => {
    if (field === sortBy) {
      if (sortOrder === 'asc') {
        setSortBy(null);
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(field);
      setSortOrder('asc');

    }
  };

  const handleSecondSort = (field) => {
    if (field === 'pais') {
      if (sortBy === 'pais') {
        if (sortOrder === 'asc') {
          setSortBy(null);
          setButtonText("Ordenar por pais");
        } else {
          setSortOrder('asc');
          setButtonText("Restaurar Orden");
        }
      } else {
        setSortBy(field);
        setSortOrder('asc');
        setButtonText("Restaurar Orden");
      }
    }

  };


  const filteredAndSortedUsers = users
    ? users
      .filter((user) =>
        user.location.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice()
    : [];


  switch (sortBy) {
    case 'nombre':
      filteredAndSortedUsers.sort((a, b) => {
        const aValue = a.name.first;
        const bValue = b.name.first;
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      });
      break;
    case 'apellido':
      filteredAndSortedUsers.sort((a, b) => {
        const aValue = a.name.last;
        const bValue = b.name.last;
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      });
      break;
    case 'pais':
      filteredAndSortedUsers.sort((a, b) => {
        const aValue = a.location.country;
        const bValue = b.location.country;
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      });
      break;

  }

  const deleteUser = (cell) => {
    const deletedUser = users.find((user) => user.cell === cell);
    if (deletedUser) {
      setDeletedUsers([...deletedUsers, deletedUser]);
      const updatedUsers = users.filter((user) => user.cell !== cell);
      setUsers(updatedUsers);
    }
  };

  const resetDeletedUsers = () => {
    setUsers([...users, ...deletedUsers]);
    setDeletedUsers([]);
  };

  const availableColors = ["#6B6B6A", "#3B3B3B"];

  const toggleColors = () => {
    if (rowColors.length > 0) {
      setRowColors([]);
    } else {
      setRowColors(availableColors);
    }
    
  };



  return (
    <>
      <h1>Prueba Técnica</h1>
      <div className='buttons-holder'>
        <button onClick={toggleColors}>
          {rowColors.length ? "Quitar Colores" : "Colorear Filas"}
        </button>
        <button onClick={() => handleSecondSort("pais")}>{buttonText}</button>
        <button onClick={resetDeletedUsers}>Resetear Usuarios Borrados</button>
        <input
          type="text"
          placeholder="Buscar por país"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />


      </div>
      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th onClick={() => handleSort("nombre")}>Nombre</th>
            <th onClick={() => handleSort("apellido")}>Apellido</th>
            <th onClick={() => handleSort("pais")}>País</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>

          {filteredAndSortedUsers?.map((user, index) =>

            <tr key={user.cell} style={{ backgroundColor: rowColors[index % 2] }}>
              <td><img src={user.picture.thumbnail}></img></td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td><button onClick={() => deleteUser(user.cell)}>Borrar</button></td>
            </tr>


          )}

        </tbody>

      </table>

    </>
  )
}

export default App
