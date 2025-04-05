import React, {FC, useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import {MainLayout} from "./layouts/MainLayout";
import {ConfContext, ConfContextType} from "./contexts/conf";


const App: FC = () => {
    const [conf, setConf] = useState<ConfContextType>({
        permissions: {},
        roles: {}
    })


    useEffect(() => {
        setConf({
            permissions: {},
            roles: {}
        });
    }, [])

    return (
        <BrowserRouter
            future={{
                v7_startTransition: true
            }}
        >
            <ConfContext.Provider value={conf}>
                <MainLayout/>
            </ConfContext.Provider>
        </BrowserRouter>
    );
};

export default App
