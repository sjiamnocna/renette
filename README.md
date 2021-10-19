# React - Nette framework API

Trying to effectively use Nette/Framework on backend (/server directory)

/server is git@github.com:sjiamnocna/nette-minimal.git

Api calls looks like

```APICall({
        resource: 'user',
        action: 'login',
        id: 42,
        data: {
            'username': 'ahoj',
            'password': '12345'
        }
})```

causes calling to `${proxysite}/api/user/login/42` with `body: JSON.stringify(data)`