(function (window, document) {

    var results = document.getElementById('results');

    gapi.hangout.data.submitDelta({
        key1: 'first key',
        key2: 'second key'
    });

    gapi.hangout.data.onStateChanged.add(function (event) {
        var state = gapi.hangout.data.getState();
        console.log(state);
    });

}(window, window.document));
