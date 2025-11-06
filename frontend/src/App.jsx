import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard';
import AddClient from './pages/AddClient';
import EditTaskForm from './pages/EditTaskForm';
import AddTaskForm from './pages/AddTaskForm';
import ClientDetailsPage from './pages/ClientDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<LoginPage/>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addClient"
          element={
            <ProtectedRoute>
              <AddClient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/:clientId"
          element={
            <ProtectedRoute>
              <ClientDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addTask"
          element={
            <ProtectedRoute>
              <AddTaskForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editTask/:taskId"
          element={
            <ProtectedRoute>
              <EditTaskForm />
            </ProtectedRoute>
          }
        />
    </Routes>
    </>
  )
}

export default App