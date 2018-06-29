$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDobIQNlWrizZRoHEDQrr2qcRWOGHFI4BY",
        authDomain: "train-scheduler-acf86.firebaseapp.com",
        databaseURL: "https://train-scheduler-acf86.firebaseio.com",
        projectId: "train-scheduler-acf86",
        storageBucket: "",
        messagingSenderId: "871984040375"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    database.ref().once('value', function (snapshot) {
        console.log(snapshot);
        snapshot.forEach(function (childSnapshot) {
            var firstTimeConverted = moment(childSnapshot.val().firstTrain, "HH:mm").subtract(1, "years");
            var currentTime = moment();
            var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
            var tRemainder = diffTime % childSnapshot.val().frequency;
            var minutesTillTrain = childSnapshot.val().frequency - tRemainder;
            var nextTrain = moment().add(minutesTillTrain, "minutes");
            $("#trains-table > tbody").append("<tr><td>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" +
                childSnapshot.val().frequency + "</td><td>" + moment(nextTrain).format('HH:mm') + "</td><td>" + minutesTillTrain + " minutes</td></tr>");
        });
    });


    $('#add-train').on('click', function (event) {
        event.preventDefault();

        var newTrain = {
            name: $('#train-name').val(),
            destination: $('#destination').val(),
            firstTrain: $('#first-train').val(),
            frequency: $('#frequency').val()
        };

        console.log($('#first-train').val());

        database.ref().push(newTrain);

        alert("Train successfully added");

        $('#train-name').val('');
        $('#destination').val('')
        $('#first-train').val('');
        $('#frequency').val('');

        $('#trains-table > tbody').empty();

        database.ref().on("child_added", function (childSnapshot, prevChildKey) {
            
            var firstTimeConverted = moment(childSnapshot.val().firstTrain, "HH:mm").subtract(1, "years");
            var currentTime = moment();
            var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
            var tRemainder = diffTime % childSnapshot.val().frequency;
            var minutesTillTrain = childSnapshot.val().frequency - tRemainder;
            var nextTrain = moment().add(minutesTillTrain, "minutes");
            $("#trains-table > tbody").append("<tr><td>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" +
                childSnapshot.val().frequency + "</td><td>" + moment(nextTrain).format('HH:mm') + "</td><td>" + minutesTillTrain + " minutes</td></tr>");
        });
    });

});