(function () {

    var app = {

        init: function () {

            gapi.hangout.data.submitDelta({
                key1: 'first key',
                key2: 'second key'
            });

            gapi.hangout.data.onStateChanged.add(function () {
                var state = gapi.hangout.data.getState();
                console.log(state);
            });

        }

    };

    gapi.hangout.onApiReady.add(function (eventObj) {
        if (eventObj.isApiReady) {
            app.init();
        }
    });


}());
