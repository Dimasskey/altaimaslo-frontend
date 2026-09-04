import Routing from "@/app/routing/routing";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "@/app/providers/authProvider/authProvider";
import {StatusModalProvider} from "@/app/providers/statusModalProvider/statusModalProvider";
import {StoreProvider} from "@shared/providers/StoreProvider";


function App() {
  return (

    <>
        <BrowserRouter>
            <AuthProvider>
                <StoreProvider>
                    <StatusModalProvider>
                        <Routing/>
                    </StatusModalProvider>
                </StoreProvider>
            </AuthProvider>
        </BrowserRouter>
    </>
  )
}

export default App
