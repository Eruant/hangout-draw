(function () {

    var app = {

        init: function () {

            console.log('Starting hangout');

            gapi.hangout.data.submitDelta({
                key1: 'first key',
                key2: 'second key'
            });

            gapi.hangout.data.onStateChanged.add(function () {
                var state = gapi.hangout.data.getState();
                console.log(state);
            });

            this.events();

        },

        events: function () {

            var input = document.getElementById('input'),
                btn = document.getElementById('submit'),
                value = '';

            btn.addEvent('onClick', function () {
                console.log('Button pressed');
                value = input.value;

                gapi.hangout.data.submitDelta({
                    inputData: value
                });
            });

        }

    };

    gapi.hangout.onApiReady.add(function (eventObj) {
        if (eventObj.isApiReady) {
            app.init();
        }
    });


}());
