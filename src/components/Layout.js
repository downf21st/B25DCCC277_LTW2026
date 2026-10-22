import {Outlet} from "react-router-dom";
import NavBar from "./NavBar";

function Layout(){
    return (
        <div>
            <NavBar>
                <Outlet></Outlet>
            </NavBar>
        </div>
    )

}

export default Layout;