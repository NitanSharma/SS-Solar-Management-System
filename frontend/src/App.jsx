import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard';
import AddClient from './pages/AddClient';
import EditTaskForm from './pages/EditTaskForm';
import AddTaskForm from './pages/AddTaskForm';
import ClientDetailsPage from './pages/ClientDetailsPage';

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<LoginPage/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/addClient' element={<AddClient/>} />
      <Route path='/client/:clientId' element={<ClientDetailsPage/>}/>
      <Route path="/addTask" element={<AddTaskForm />} />
      <Route path="/editTask/:taskId" element={<EditTaskForm />} />
    </Routes>
    </>
  )
}

export default App