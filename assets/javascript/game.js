/* global moment firebase */
    // Initialize Firebase
    // Make sure to match the configuration to the script version number in the HTML
    // (Ex. 3.0 != 3.7.0)
    var config = {
        apiKey: "AIzaSyBX8kYiMF6cLoPj7JCtTkTO8w9riKNgZiU",
        authDomain: "rock-paper-scissors-4bca5.firebaseapp.com",
        databaseURL: "https://rock-paper-scissors-4bca5.firebaseio.com",
        projectId: "rock-paper-scissors-4bca5",
        storageBucket: "rock-paper-scissors-4bca5.appspot.com",
        messagingSenderId: "724862951295"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    //variable declarations and initialization
    var player_name, player_hand;
    var opponent, opponentHand;
    var wins = 0;
    var losses = 0;
    var ties = 0;
    var flag = false; //flag if player has entered choice
    var flag2 = false; //flag if opponent has entered choice
    var instant_message;
    var sound_effect;
    var counter = 0;


    // At the page hand value updates, get a snapshot of the local data.
    // This function allows you to update your page in real-time when the values within the firebase node handata changes
    database.ref("/handData").on("value", function(snapshot) {

        // Set the local variables for opponent equal to the stored values in firebase.
       if (snapshot.child("opponent").exists() && snapshot.child("opponentHand").exists()) {

           if (snapshot.val().opponent != null || snapshot.val().opponentHand != null) {

                if (player_name !== snapshot.val().opponent) {
                    counter++;

                    //allow only 1 opponent to be matched with player
                    if(counter === 1) {
                    opponent = snapshot.val().opponent;
                    opponentHand = snapshot.val().opponentHand;
                    console.log(opponent);
                    console.log(opponentHand);
                    
                    $("#message_board").prepend('<p>' + opponent + ' has picked a hand!</p>');
                    
                    sound_effect = new sound("./assets/audio/Alert.mp3");
                    sound_effect.play();
                    
                    flag2 = true;

                    check_winner(); 

                    } else {

                        opponent = snapshot.val().opponent;
                        $("#message_board").prepend('<p>' + opponent + ' has picked a hand!</p>');
                        $("#message_board").prepend('<p>A match has been decided that you were not a part of.</p>');
                        
                        sound_effect = new sound("./assets/audio/Alert.mp3");
                        sound_effect.play();

                        flag2 = false;
                        counter = 0;

                        //clears all information in database after each round
                        database.ref("/handData").set({
                        opponent: null,
                        opponentHand: null
                        });    
                    }             
                }
            } 
       }
        // If any errors are experienced, log them to console.
        }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


    //event listener when a new message is sent to the database
    database.ref("/messaging").on("value", function(snap) {

        // Set the local variables for opponent equal to the stored values in firebase.
       if (snap.child("user_name").exists() && snap.child("IMessage").exists()) 

         $("#message_board").prepend('<p>' + snap.val().user_name + ' says: ' + snap.val().IMessage + '</p>');

        sound_effect = new sound("./assets/audio/instant.mp3");
        sound_effect.play();

        //clears all information in database after each round
        database.ref("/messaging").set({
            user_name: null,
            IMessage: null
        });
        
        }, function(errorObject) {

        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);
    });


    //checks winner after player and opponent has entered choice
    function check_winner() {
        if (flag && flag2) {

            if ((player_hand === "r" && opponentHand === "s") ||
                (player_hand === "s" && opponentHand === "p") || 
                (player_hand === "p" && opponentHand === "r")) {
                wins++;
                $("#message_board").prepend('<p>' + player_name + ' vs. ' + opponent + '. You won! Wins: ' + wins + ' Losses: ' + losses + ' Ties: ' + ties + ' </p>');
            } else if (player_hand === opponentHand) {
                ties++;
                $("#message_board").prepend('<p>' + player_name + ' vs. ' + opponent + '. It is a tie!  Wins: ' + wins + ' Losses: ' + losses + ' Ties: ' + ties + ' </p>');
            } else {
                losses++;
                $("#message_board").prepend('<p>' + player_name + ' vs. ' + opponent + '. You lost! Wins: ' + wins + ' Losses: ' + losses + ' Ties: ' + ties + ' </p>');
            }
            
            sound_effect = new sound("./assets/audio/Boxing_Bell.mp3");
            sound_effect.play();

            //reset flags after each round is done
            flag = false;
            flag2 = false;
            counter = 0; //clear opponent count to allow for another opponent

            //clears all information in database after each round
            database.ref("/handData").set({
            opponent: null,
            opponentHand: null
        });
        }
    }

    // Whenever a user clicks the start button
    $("#start_button").on("click", function(event) {
        event.preventDefault(); 

            player_name = $("#name-input").val().trim();
            player_name = player_name.toUpperCase();

            $("iframe").remove();
            $("#start_button").hide();
            $("#entry-form").hide();
            $("#name-input").val('');
            $("#name-input").hide();
            $("#online_users").text("Click on a hand to play a round."); 
            $("#message_board").empty();
            $("#scorecard").show();
            $("#message-form").show();
            $("#status").show(); 
            //$("body").prepend('<audio autoplay loop  id="playAudio"><source src="bensound-theduel.mp3"></audio>');
           
    }); 

    //function when a hand is picked to play game
    $(".clicked").on("click", function() {

        if (!flag) {

        player_hand = $(this).attr("data-btnID");

        $("#message_board").prepend('<p>You have picked a hand.</p>');

        sound_effect = new sound("./assets/audio/Drop.mp3");
        sound_effect.play();

        database.ref("/handData").set({
            opponent: player_name,
            opponentHand: player_hand
        });

        flag = true;

        check_winner();
    } else
        $("#message_board").prepend("<p>You already picked a hand. Waiting for an opponent's pick to match yours with.</p>");

    });

    //funtion for grabbing instant message and sendind it to firebase
    $("#IM_button").on("click", function() {

        instant_message = $("#message-area").val().trim();
        $("#message-area").val('');


        database.ref("/messaging").set({
            user_name: player_name,
            IMessage: instant_message
        });

    });

    //sound function
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
        this.sound.play();
        }
        this.stop = function(){
        this.sound.pause();
        }
    }