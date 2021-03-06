Tracy.Debug.captureAjax = function () {
    var ajaxCounter = 1;
    var autoRefresh = true;
    var reqIdPrefix = ((new Date().getTime()).toString(16)).split('', 10).reverse().join('');

    var oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        oldOpen.apply(this, arguments);
        var url = new URL(arguments[1], location.origin);
        if (autoRefresh) { // url.host === location.host;
            var reqId = reqIdPrefix + '_' + (ajaxCounter++).toString();
            this.setRequestHeader('X-Tracy-Ajax', reqId);
            this.addEventListener('load', function () {
                if (this.getAllResponseHeaders().match(/^X-Tracy-Ajax: 1/mi)) {
                    var scriptUrl = url.origin + '/api/?' + '_tracy_bar=content-ajax.' + reqId + '&XDEBUG_SESSION_STOP=1&v=' + Math.random();
                    Tracy.Debug.loadScript(scriptUrl);
                }
            });
        }
    };

    var oldFetch = window.fetch;
    window.fetch = function (request, options) {
        request = request instanceof Request ? request : new Request(request, options || {});
        var url = new URL(request.url, location.origin);
        if (autoRefresh) { // && url.host === location.host
            var reqId = reqIdPrefix + '_' + (ajaxCounter++).toString();
            request.headers.set('X-Tracy-Ajax', reqId);
            return oldFetch(request).then((response) => {
                if (response instanceof Response && response.headers.has('X-Tracy-Ajax') && response.headers.get('X-Tracy-Ajax')[0] === '1') {
                    var scriptUrl = url.origin + '/api/?' + '_tracy_bar=content-ajax.' + reqId + '&XDEBUG_SESSION_STOP=1&v=' + Math.random();
                    Tracy.Debug.loadScript(scriptUrl);
                }

                return response;
            });
        }

        return oldFetch(request);
    };
};

window.addEventListener('load', () => {
    const mainGroup = `<ul class="tracy-row" data-tracy-group="main">
            <li id="tracy-debug-logo" style="flex-grow:1;">
                <svg viewBox="0 -10 1561 333"><path fill="#585755" d="m176 327h-57v-269h-119v-57h291v57h-115v269zm208-191h114c50 0 47-78 0-78h-114v78zm106-135c17 0 33 2 46 7 75 30 75 144 1 175-13 6-29 8-47 8h-27l132 74v68l-211-128v122h-57v-326h163zm300 57c-5 0-9 3-11 9l-56 156h135l-55-155c-2-7-6-10-13-10zm-86 222l-17 47h-61l102-285c20-56 107-56 126 0l102 285h-61l-17-47h-174zm410 47c-98 0-148-55-148-163v-2c0-107 50-161 149-161h118v57h-133c-26 0-45 8-58 25-12 17-19 44-19 81 0 71 26 106 77 106h133v57h-119zm270-145l-121-181h68l81 130 81-130h68l-121 178v148h-56v-145z"></path></svg>
            </li>
            <li><a href="#" data-tracy-action="close" title="close debug bar">&times;</a></li>
        </ul>`

    Tracy.Debug.setOptions({
        maxAjaxRows: 10,
        panelZIndex: 9999
    });

    Tracy.Debug.init('<div id="tracy-debug-bar">' + mainGroup + '</div>');
})