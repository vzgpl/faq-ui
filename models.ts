export interface IPrdo {
    id: number,
    text: string,
}

export interface IPageData {
    current_page?: number,
    data: [],
    first_page_url?: string,
    last_page_url?: string,
    path?: string,
    from?: number,
    last_page?: number,
    per_page?: number,
    to?: number,
    total?: number,
    prev_page_url?: string | null,
    links?: [],
}

export interface IModActions {
    name: string,
    type: string,
    label: string,
    value: boolean,
    "actions": []
}

export interface ICall {
    calls_uuid: string,
    calls_parent_uuid: string,
    calls_directions: string,
    calls_status: string,
    calls_durability: number,
    calls_billable: number,
    calls_date_beginning: Date | null,
    calls_date_dial: Date | null,
    calls_date_answer: string,
    calls_date_end: Date | null,
    calls_date_answer_extention: string,
    calls_record: string,
    calls_phone: string,
    calls_extension: string,
    calls_trunk: string,
    calls_dial_type: string,
    calls_click_ivr: string,
    calls_custom: string,
    calls_uniqueid: string,
    calls_linkedid: string,
    calls_hangup_request: string,
    calls_hangup_request_label: string,
    calls_hangup_cause: string,
    calls_hangup_cause_txt: string,
    calls_created_at: Date | null,
    calls_updated_at: Date | null
}

export interface IUser {
    id: number,
    name: string,
    email: string,
}

export interface IEndpoint {
    endpoint_uuid: string,
    endpoint_name: string,
    endpoint_type: string,
    endpoint_allow: string,
    endpoint_language: string,
    endpoint_context: string,
    endpoint_activity: boolean,
    endpoint_apply: boolean,
    endpoint_last_name: string,
    endpoint_first_name: string,
}

export interface IRole {
    users_roles_uuid: string,
    users_roles_name: string,
    users_roles_activity: boolean,
    users_roles_responsible: string,
}

export interface ILogin {
    uuid: string,
    name: string,
    api_token: string,
    refresh_token: string,
    is_admin: boolean,
    permission: {}
}

