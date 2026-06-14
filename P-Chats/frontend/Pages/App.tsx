import {BrowertRouter, Routes, Route, Navigate} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import {useAuth} from './context/AuthContext'

function AppRoutes(){
   const {firebaseUser, userDoc, loading} = useAuth()

   if(loading) return null
   
   const fullyAuthed = !!(firebaseUser && userDoc)

   return(
    <Routes>
        
    </Routes>
   )
}
export default function App(){
    const {firebaseUser} = useAuth()

    return(
        <BrowertRouter>
        <div className="flex bg-dark-bg min-h-dvh"></div>
        </BrowertRouter>
    )
}