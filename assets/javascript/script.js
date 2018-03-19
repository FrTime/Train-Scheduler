//  This will prevent functions from running before all scripts are loaded
$(document).ready(function () {
    veryImportant(function () {
        audio.play();
        console.log("Cheat activated!");
    });
    trainScheduler.addTrains();
});

var config = {
    apiKey: "AIzaSyBgnAU6r39_qdEb2eA203aA5Nh3D7spjDA",
    authDomain: "bootcamp-demo-4e619.firebaseapp.com",
    databaseURL: "https://bootcamp-demo-4e619.firebaseio.com",
    projectId: "bootcamp-demo-4e619",
    storageBucket: "bootcamp-demo-4e619.appspot.com",
    messagingSenderId: "952060630907"
};

firebase.initializeApp(config);

var database = firebase.database();

function veryImportant(cb) {
    var input = '';
    var key = '38384040373937396665';
    document.addEventListener('keydown', function (e) {
        input += ('' + e.keyCode);
        if (input === key) {
            return cb();
        }
        if (!key.indexOf(input)) return;
        input = ('' + e.keyCode);
    });
}

var audio = new Audio('assets/sounds/secret.mp3');

var trainScheduler = {
    // frequencyFormat: '',
    // nextTrain = (moment().toNow()),

    addTrains: function () {
        $('#submit-train').on('click', function (event) {
            event.preventDefault();
            var userTrain = $('#train-name').val().trim();
            console.log('Train name: ' + userTrain);
            var userDestination = $('#train-destination').val().trim();
            console.log('Train destination: ' + userDestination);
            var userFirstTrain = $('#train-time').val().trim();
            console.log('Train arrival time: ' + userFirstTrain);
            var userFrequency = $('#train-frequency').val().trim();
            console.log('Train frequency: ' + userFrequency + ' minutes');

            database.ref().push({
                trainName: userTrain,
                trainDestination: userDestination,
                trainArrival: userFirstTrain,
                trainFrequency: userFrequency
            });

            database.ref().on("child_added", function (childSnapshot) {
                console.log(childSnapshot.val());
                var tName = childSnapshot.val().trainName;
                var tDestination = childSnapshot.val().trainDestination;
                var tArrivalTime = childSnapshot.val().trainArrival;
                var tFrequency = childSnapshot.val().trainFrequency;
                var tIndexKey = childSnapshot.key;
                console.log(tIndexKey);

                var tArrivalTimeConverted = moment(tArrivalTime, "HH:mm");
                var now = moment().format('HH:mm');
                console.log(now);

                var tTimeToArrival = moment().diff(moment(tArrivalTimeConverted), "minutes");
                console.log(tTimeToArrival + ' minutes apart');
                var tTimeDifference = tTimeToArrival % tFrequency;
                var tNextArrival = tFrequency - tTimeDifference;
                console.log('The next train is ' + tNextArrival + ' minutes away!');

                var tTimeToNextArrival = moment().add(tNextArrival, "minutes");
                var tTimeOfNextArrival = moment(tTimeToNextArrival).format("HH:mm");
                console.log('The next train will arrive at : ' + tTimeOfNextArrival);

                $('#user-trains').prepend(
                    `
                <tr>
                    <td>${tName}</td>
                    <td>${tDestination}</td>
                    <td>${tFrequency}</td>
                    <td>${tTimeOfNextArrival}</td>
                    <td>${tNextArrival}</td>
                </tr>
                `
                );

            });

        });

        $('#train-name').val('');
        $('#train-destination').val('');
        $('#train-time').val('');
        $('#train-frequency').val('');
    },
};