//  This will prevent functions from running before all scripts are loaded
$(document).ready(function () {

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