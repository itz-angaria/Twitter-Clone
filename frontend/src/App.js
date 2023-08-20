import logo from './logo.svg';
import './App.css';
import Register from './pages/Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Feed from './pages/Resources/Feed';
import SharedLayoutPage from './pages/Resources/Layout';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Sidebar from './pages/Sidebar';
import Modal from './pages/Modals/Modal';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import CreateTweetModal from './pages/Modals/Tweet';
import SingleUserPage from './pages/Modals/SingleUser';
import SingleTweetPage from './pages/Modals/OneTweet';


function App() {
  return (
    <>
{/* ! I have shifted the browser router to the index.js file because I was getting an

    error while importing useNavigate Hook in the TweetContext.js
*/}
    {/* ! show the toast for all pages */}
      <ToastContainer />
      <Routes>
        {/* ! if a user is not logged  */}
      <Route path='/' element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
          {/* ! nested routes */}
          <Route index element={<><Home /> </>} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/:id' element={<SingleUserPage />} />
          <Route path='/tweet/:id' element={<SingleTweetPage />} />
      </Route>

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
