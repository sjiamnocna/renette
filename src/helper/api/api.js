const callApi = (resource, action, data) =>
    fetch(`/api/${resource}/${action}`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'content-type': 'application/json',
        },
        body: JSON.stringify(data)
    }).catch(err => {
        console.log('catch', err);
    });

export default callApi;