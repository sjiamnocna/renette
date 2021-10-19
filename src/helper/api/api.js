/**
 * sjiamnocna
 * @param object Fetch API parameters
 *  'resource'  string  (reqired)
 *  'action'    string  if not set, default action is used
 *  'id'        int     resource id
 *  'method'    HTTP2   REST method ['GET', 'PUT', 'DELETE', 'PATCH'] (POST is default)
 *  'headers'   Object  Key => Value pairs
 *  'data'      Object  Key => Value pairs, data used to create request body
 * @returns promise
 */
const APICall = (param) => {
    const {resource, action, id} = param
    const path = `/api/${resource}` + (action ? `/${action}` : '') + (id ? `/${id}` : '')

    // check method
    const method = ['GET', 'PUT', 'DELETE', 'PATCH'].includes(String(param.method).toUpperCase()) ?
        String(param.method).toUpperCase() : 'POST'

    // combine headers into one object
    const defaultHeaders = {
        'X-Requested-With': 'XMLHttpRequest',
        'content-type': 'application/json',
    }
    const headers = param.headers !== undefined ?
        Object.assign(param.headers, defaultHeaders) : defaultHeaders; 

    return fetch(path, {
        method: method,
        headers: headers,
        body: method !== 'GET' ?
            JSON.stringify(param.data) : null
    })
}

export default APICall;