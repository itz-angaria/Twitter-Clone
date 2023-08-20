import React, { useEffect } from 'react'
import { useNavigate,Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../Datacontext/AuthData';
import Login from '../../pages/Login';


const ProtectedRoute = ({children}) => {

    const [auth,setAuth] = useAuth();
    const navigate = useNavigate()

   useEffect(()=>{
    if(!localStorage.getItem('auth')){
        toast.warning("Please Enter your details to login ",{
          toastId:"please login to continue post"
        })
        return navigate('/login')
     }
   },[]);

  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedRoute