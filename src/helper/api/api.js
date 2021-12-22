import { access } from "fs"

const credentials = {
    serviceName: 'testing',
    serviceKey: 'abcdef',
    accessKey: null
}

// combine headers into one object
const defaultHeaders = {
    'X-Requested-With': 'XMLHttpRequest',
    'content-type': 'application/json',
}

/**
 * HOC - first access to API and get generated hash
 * @param {*} baseUri 
 * @param {*} serviceName 
 * @param {*} serviceKey
 * @returns 
 */
const CallAPIWithKey = async (baseUri, serviceName, serviceKey) => {
    // first time we need API
    const accessDetails = {}
    
    fetch(baseUri + '/ch/init', {
        method: 'POST',
        headers: {
            'X-Service-Name': serviceName,
            ...defaultHeaders
        }
    }).then(res => res.text()).then(res => {
        const accessToken = res
        console.log('acc', accessToken)

        return fetch(baseUri + '/ch/init', {
            method: 'POST',
            headers: {
                'X-Access-Key': accessToken,
                'X-Service-Key': credentials.serviceKey,
                ...defaultHeaders
            }
        }).then(res => accessDetails.accessKey = res.text())
    })


    /**
     * 
     * @param object Fetch API parameters
     *  'resource'  string  (reqired)
     *  'action'    string  if not set, default action is used
     *  'id'        int     resource id
     *  'method'    HTTP2   REST method ['GET', 'PUT', 'DELETE', 'PATCH'] (POST is default)
     *  'headers'   Object  Key => Value pairs
     *  'data'      Object  Key => Value pairs, data used to create request body
     * @returns promise
     */
    return (param) => {
        const {resource, action, id, method} = param
        const path = `${baseUri}/${resource}` + (action ? `/${action}` : '') + (id ? `/${id}` : '')
    
        const fetchParam = {
            method: method ?? 'POST',
            headers: param.hasOwnProperty('header') ?
                // create new object from both default headers and param.headers
                Object.assign({
                    'x-access-key' : accessDetails.accessKey,
                    ...defaultHeaders
                }, param.headers) : defaultHeaders,
            body: method !== 'GET' ?
                JSON.stringify(param.data) : null
        }

        return fetch(path, fetchParam)
    }
}

export default CallAPIWithKey('/api', credentials.serviceName, credentials.serviceKey);