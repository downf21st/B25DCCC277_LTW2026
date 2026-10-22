import {Outlet} from "react-router-dom";
import NavBar from "./NavBar";

function Layout(){
    return (
        <div>
            <NavBar />
            <main>
                <Outlet></Outlet>
            </main>
        </div>
    )

}

export default Layout;