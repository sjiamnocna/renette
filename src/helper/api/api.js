const credentials = {
    serviceName: 'testing',
    serviceKey: 'abcdef'
}

// combine headers into one object
const defaultHeaders = {
    'X-Requested-With': 'XMLHttpRequest',
    'content-type': 'application/json',
}

const allowedMethod = ['POST', 'GET', 'PUT', 'DELETE']
const apiUri = '/api'

class CAPI
{
    /** @var string Access key to use to authenticate each request */
    accessKey
    /** @var bool If the API is authorized via key or not */
    authorized
    /** @var bool API lock */
    lock
    /** @var string API Base URI */
    baseUri

    /**
     * Authenticate session
     * @param function Function after the work is done
     */
    async api_init(onReady)
    {
        if (this.accessKey || this.lock) {
            // if the API is authenticated, then do nothing
            return false
        }

        // prevent multiple calls
        this.lock = true
        return await this.get({
            resource: 'Ch',
            action: 'init',
            headers: {
                'X-Service-Name': credentials.serviceName
            }
        })
        .then(res => res.text())
        .then(res => {
            this.lock = false
            if (typeof onReady === 'function'){
                // callback after init actions
                onReady(typeof res === 'string')
            }
            return res ?
                this.accessKey = res : null
        })
    }

    async api_authorize(onReady)
    {
        if (this.authorized || this.lock) {
            // if the API is locked, then do nothing
            return false
        }

        // prevent multiple calls
        this.lock = true
        return await this.get({
            resource: 'Ch',
            action: 'authorize',
            headers: {
                'X-Access-Key': this.accessKey,
                'X-Service-Key': credentials.serviceKey,
            }
        })
        .then(res => res.text())
        .then(res => {
            this.lock = false
            if (typeof onReady === 'function') {
                // callback after init actions
                onReady(typeof res === 'string')
            }
            if (typeof res === 'string' && res.length === 32){
                return this.accessKey = res;
            }
            console.log(res)
        })
    }

    async get(param)
    {
        param.method = 'GET'

        if (param.data){
            // cannot use data with GET method
            throw Error('Cant use data with GET method')
        }

        return this.__fetch(param)
    }

    async post(param)
    {
        param.method = 'POST'

        return this.__fetch(param)
    }

    /**
    * 
    * @param object Fetch API data
    *  'resource'  string  (reqired)
    *  'action'    string  if not set, default action is used
    *  'id'        int     resource id
    *  'method'    HTTP2   REST method ['GET', 'PUT', 'DELETE', 'PATCH'] (POST is default)
    *  'headers'   Object  Key => Value pairs
    *  'data'      Object  Key => Value pairs, data used to create request body
    * @returns promise
    */
    async __fetch(param)
    {
       const {resource, action, id} = param
       const method = allowedMethod.includes(param.method) ? param.method : 'GET'
       const path = `${apiUri}/${resource}` + (action ? `/${action}` : '') + (id ? `/${id}` : '')
   
       const fetchParam = {
           method: method,
           headers:
               // create new object from both default headers and param.headers
               {
                   ...defaultHeaders,
                   ...param.headers
               },
           body: method !== 'GET' ? // if request is GET, body is not allowed
                JSON.stringify(param.data) : null
       }

       return fetch(path, fetchParam)
   }
}

const API = new CAPI()

export default API