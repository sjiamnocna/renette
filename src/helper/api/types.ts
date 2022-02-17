export interface API_props {
    busy: boolean,
    authorized: boolean,
    accessKey: string
}

export interface API_config {
    apiUri: string,
    allowedMethod: string[],
    defaultHeaders: Headers
}

export interface API_fetch_param {
    resource: string,
    action: string,
    method?: 'GET' | 'POST',
    headers?: Headers,
    data?: object
    id?: number,
}