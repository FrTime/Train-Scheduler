//  This will prevent functions from running before all scripts are loaded
$(document).ready(function () {
    veryImportant(function () {
        audio.play();
        console.log("Cheat activated!");
    });
    getTrains();
    autoUpdate();
    trainScheduler.addTrains();
});

// Initializing firebase
var config = {
    apiKey: "AIzaSyBgnAU6r39_qdEb2eA203aA5Nh3D7spjDA",
    authDomain: "bootcamp-demo-4e619.firebaseapp.com",
    databaseURL: "https://bootcamp-demo-4e619.firebaseio.com",
    projectId: "bootcamp-demo-4e619",
    storageBucket: "bootcamp-demo-4e619.appspot.com",
    messagingSenderId: "952060630907"
}; firebase.initializeApp(config);

// Setting a varaiable to call the firebase database
var database = firebase.database();

// 
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
}; var audio = new Audio('assets/sounds/secret.mp3');
// 

// Setting a variable to contain the variables and functions of the trian scheduling app
var trainScheduler = {

    // This on-click function will run when a train is submitted in order to add it to the schedule
    addTrains: function () {
        $('#submit-train').on('click', function (event) {
            event.preventDefault();
            // $('#user-trains').empty();
            // Setting the variables that will be used to push data into firebase
            var userTrain = $('#train-name').val().trim();
            console.log('Train name: ' + userTrain);
            var userDestination = $('#train-destination').val().trim();
            console.log('Train destination: ' + userDestination);
            var userFirstTrain = $('#train-time').val().trim();
            console.log('Train arrival time: ' + userFirstTrain);
            var userFrequency = $('#train-frequency').val().trim();
            console.log('Train frequency: ' + userFrequency + ' minutes');

            // Pushing these variables into the firebase database
            database.ref().push({
                trainName: userTrain,
                trainDestination: userDestination,
                trainArrival: userFirstTrain,
                trainFrequency: userFrequency
            });

            // This function will run on every addition to the schedule.  The variables will be reset for each train added to reflect the data entered by the user.
            $('#user-trains').empty();

            database.ref().on("child_added", function (childSnapshot) {
                console.log(childSnapshot.val());
                var tName = childSnapshot.val().trainName;
                var tDestination = childSnapshot.val().trainDestination;
                var tArrivalTime = childSnapshot.val().trainArrival;
                var tFrequency = childSnapshot.val().trainFrequency;

                // Converting the time entered by the user from a string to military time with moment.js 
                var tArrivalTimeConverted = moment(tArrivalTime, "HH:mm");

                // Setting a variable to call the current time through moment.js
                var now = moment().format('HH:mm');
                console.log(now);

                // Using moment.js to calculate the time difference between train arrivals
                var tTimeToArrival = moment().diff(moment(tArrivalTimeConverted), "minutes");
                console.log(tTimeToArrival + ' minutes apart');
                var tTimeDifference = tTimeToArrival % tFrequency;
                var tNextArrival = tFrequency - tTimeDifference;
                console.log('The next train is ' + tNextArrival + ' minutes away!');
                var tTimeToNextArrival = moment().add(tNextArrival, "minutes");
                var tTimeOfNextArrival = moment(tTimeToNextArrival).format("HH:mm");
                console.log('The next train will arrive at : ' + tTimeOfNextArrival);

                // Adding the user-submitted train to the HTML with the times calculated with moment.js
                $('#user-trains').append(
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
            // Clearing the user forms after adding the train to the schedule
            $('#train-name').val('');
            $('#train-destination').val('');
            $('#train-time').val('');
            $('#train-frequency').val('');
        });
    },
};


// This function will update the train schedule in the HTML with all trains currently in the firebase database when the user loads the page.  It uses the same logic as the function above inside of the trainScheduler object with the addition of a child item key variable
var getTrains = function () {
    $('#user-trains').empty();
    console.log('emptying schedule');
    console.log('populating schedule');
    database.ref().once("value", function (snapshot) {

        // This variable saves the unique child key value so that the values from each child can be looped through
        //console.log(snapshot.val());
        var trains = snapshot.val();
        console.log(trains);
        snapshot.forEach(function (train) {
            console.log(train.key);
            // var trainKey = Object.keys(snapshot.val())[0];
            // console.log(trainKey);

            // Setting the child values to variables using the above key
            var tName = train.val().trainName;
            var tDestination = train.val().trainDestination;
            var tArrivalTime = train.val().trainArrival;
            var tFrequency = train.val().trainFrequency;

            // Converting the time entered by the user from a string to military time with moment.js 
            var tArrivalTimeConverted = moment(tArrivalTime, "HH:mm");

            // Setting a variable to call the current time through moment.js
            var now = moment().format('HH:mm');

            // Using moment.js to calculate the time difference between train arrivals
            var tTimeToArrival = moment().diff(moment(tArrivalTimeConverted), "minutes");
            var tTimeDifference = tTimeToArrival % tFrequency;
            var tNextArrival = tFrequency - tTimeDifference;
            var tTimeToNextArrival = moment().add(tNextArrival, "minutes");
            var tTimeOfNextArrival = moment(tTimeToNextArrival).format("HH:mm");

            // Adding the user-submitted train to the HTML with the times calculated with moment.js
            $('#user-trains').append(
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
};

// This function will update the schedule in the HTML every one minute
var autoUpdate = function () {
    setInterval(getTrains, 30000);
    console.log('schedule updated at ' + moment().format('HH:mm:ss'));
};