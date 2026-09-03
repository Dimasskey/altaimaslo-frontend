import Routing from "@/1app/routing/routing";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "@/1app/providers/authProvider/authProvider";
import {StatusModalProvider} from "@/1app/providers/statusModalProvider/statusModalProvider";
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
