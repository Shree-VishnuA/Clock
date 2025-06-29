import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"


function Layout(){


    return(
        <div className="flex overflow-y-hidden">
            <div>
                <Sidebar></Sidebar>
            </div>
            <div className="sm:w-[calc(100vw-100px)] sm:ml-25 sm:mt-0 w-screen mt-20">
                <Outlet></Outlet>
                
            </div>
        </div>
    )
}

export default Layout