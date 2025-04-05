import {useContext} from "react";
import {ConfContext} from "../contexts/conf";

export function CheckPermissionIsAdmin(pName: string): boolean {

    const confContext = useContext(ConfContext);
    let res = confContext.permissions[pName];
    if (localStorage.getItem('is_admin') === '1') {
        res = true;
    }
    return res
}

export function CheckPermission(pName: string): boolean {
    const confContext = useContext(ConfContext);
    let res = confContext.permissions[pName];
    return res;
}

