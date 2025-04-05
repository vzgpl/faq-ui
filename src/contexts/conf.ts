import {createContext} from "react";

export type ConfContextType = {
    permissions: object,
    roles: object
};
export const ConfContext = createContext<ConfContextType>({
    permissions: {},
    roles: {}
})
