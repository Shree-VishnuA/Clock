import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"


function Layout(){


    return(
        <div className="flex">
            <div>
                <Sidebar></Sidebar>
            </div>
            <div className="w-[calc(100vw-80px)] ml-20">
                <Outlet></Outlet>
                
            </div>
        </div>
    )
}

export default Layout