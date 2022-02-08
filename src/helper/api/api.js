class CAPI {
    /**
     * @var bool    Locked for initialization
     * @var string  Access key to use to authenticate each request
     * @var bool    If the API is authorized via key or not
     * @var string  API Base URI
     * 
     */
    __props = {
        busy: false,
        authorized: false,
        accessKey: null,
    }

    __config = {
        apiUri: '/api',
        allowedMethod: ['POST', 'GET', 'PUT', 'DELETE'],
        defaultHeaders: {
            'X-Requested-With': 'XMLHttpRequest',
            'content-type': 'application/json',
        }
    }

    get isAuthenticated() {
        return this.__props.accessKey
    }

    get isAuthorized() {
        return this.__props.authorized
    }

    setConfig(config) {
        if (typeof config !== 'object') {
            throw Error('Config must be object')
        }

        this.__config = {
            ...this.__config,
            ...config,
        }
    }

    /**
     * Authenticate session
     * @param function Function after the work is done
     */
    async authenticateWithName(serviceName) {
        return new Promise((resolve, reject) => {
            if (this.__props.busy) {
                reject('API is preparing, wait')
            }
            if (this.isAuthenticated) {
                reject('API already authenticated')
            }

            // block another initializations while working
            this.__props.busy = true

            this.post({
                resource: 'Chk',
                action: 'init',
                headers: {
                    'X-Service-Name': serviceName
                }
            })
                .then(res => res.json())
                .then(res => {
                    this.__props.busy = false

                    const accessKey = res.accessKey

                    console.log('authentication', accessKey)

                    if (accessKey && typeof accessKey === 'string' && accessKey.length === 32) {
                        this.__props.accessKey = accessKey
                        this.__config.defaultHeaders['X-Access-Key'] = accessKey
                        resolve(accessKey)
                    } else {
                        reject('Something went wrong with access key')
                    }
                })
        }).finally(() => {
            this.busy = false
        })
    }

    async authorizeWithKey(serviceKey) {
        return new Promise((resolve, reject) => {
            if (this.__props.busy) {
                reject('API is preparing, wait')
            }
            if (this.__props.authorized) {
                reject('API already authorized with key')
            }
            if (!this.__props.accessKey) {
                reject('No access key, run `authenticate` first')
            }
            if (!serviceKey || typeof serviceKey !== 'string') {
                reject('serviceKey must be present')
            }

            // block another initializations while working
            this.__props.busy = true

            this.post({
                resource: 'Chk',
                action: 'authorize',
                headers: {
                    'X-Access-Key': this.__props.accessKey,
                    'X-Service-Key': serviceKey,
                }
            })
                .then(res => res.json())
                .then(res => {
                    this.__props.busy = false
                    const accessKey = res.accessKey

                    console.log('authorization', res)

                    if (accessKey && typeof accessKey === 'string' && accessKey.length === 32) {
                        this.__props.accessKey = accessKey
                        this.__config.defaultHeaders['X-Access-Key'] = accessKey
                        resolve(accessKey)
                    } else {
                        console.log('reject', res);
                        reject('Something went wrong with access key')
                    }
                })
        }).finally(() => {
            this.busy = false
        })
    }

    async connectionClose(){
        this.post({
            resource: 'Chk',
            action: 'connectionClose',
        })
    }

    async get(param) {
        param.method = 'GET'

        if (param.data) {
            // cannot use data with GET method
            throw Error('Cant use data with GET method')
        }

        return this.__fetch(param)
    }

    async post(param) {
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
    async __fetch(param) {
        const { resource, action, id } = param
        const method = this.__config.allowedMethod.includes(param.method) ? param.method : 'GET'
        const path = `${this.__config.apiUri}/${resource}` + (action ? `/${action}` : '') + (id ? `/${id}` : '')
        const headers = {
            ...this.__config.defaultHeaders,
            ...param.headers
        }

        const fetchParam = {
            method: method,
            headers: headers,
            body: method !== 'GET' ? // if request is GET, body is not allowed
                JSON.stringify(param.data) : null
        }

        return fetch(path, fetchParam)
    }
}

const API = new CAPI()

export default API