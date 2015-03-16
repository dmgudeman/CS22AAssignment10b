/*
 * Word Guessing Game - Solution
 *
 */
'use strict';
//Define a container for the game, its variables and its methods.
var game = {
  answerPosition: 0,   // position of the current answer in the wordList - start at 0
  display: '',         // the current dash/guessed letters display - ex '-a-a--r--t'
  wrong: '',           // all the wrong letters guessed so far
  answer: '',          // the correct answer - one word from game.answersList
  wrongCount: 0,       // the number of wrong guesses so far
  over: false,         // is the game over?
  answersList: [       // list of answers to cycle through
    'JavaScript',
    'document',
    'element',
    'ajax',
    'jQuery',
    'event',
    'json',
    'listener',
    'transition',
    'window'
  ]
}; 

var gameScore;


function remember (){ 
    if (Number(localStorage.memoryScore !==0)){
        gameScore = Number(localStorage.memoryScore);
          console.log("local storage remember = " + localStorage.memoryScore)
          console.log("local storage remember = " + gameScore)
          console.log("#score " + $('#score').text().value);
        $('#score').text().value = gameScore;

    } else {
    var gameScore = 0;
   }
}


 game.restartTally = function () {
   
     gameScore = gameScore - 1;
     localStorage.memoryScore = gameScore;
      console.log("local storage = " + localStorage.memoryScore)
    console.log("gameScore = " + gameScore)
   $('#score').text(gameScore);
    localStorage.memoryScore = gameScore;
    game.restart ();
 };

game.restart = function () {

        remember();
        console.log("restart game score = " + gameScore)
         $('#score').text(gameScore);

    // Initialize the game at the beginning or after restart
    // Initialize the game variables - the model
    game.answer = game.answersList[game.answerPosition].toLowerCase(); // get the word for this round
    // use the modulo operator to cycle through the answersList
    game.answerPosition = (game.answerPosition + 1) % game.answersList.length;
    game.display = game.dashes(game.answer.length);
    game.wrong = '';
    game.wrongCount = 0;
    game.over = false;
  
    // Initialize the web page (the view)
    $('progress').val('0');  // initialize the progress bar
    $('#display').text(game.display);
    $('#wrong').text('');
    $('#guessedletter').val('');


    
    // The focus method invoked on an input element allows the user to type in that input without having to click it.
    $('#guessedletter').focus();
};

game.dashes = function (number) {
    // this function takes a number as a parameter
    // and returns a string with that many dashes
    var result = '';
    for (var i = 1; i <= number; i++)  {
        result = result + '-';
    }
    return result;  
};

game.check = function (answer, letter) {
    // Checks all occurrences of the letter guessed against game.answer. 
    // Returns true if the guess is correct and false otherwise. 
    // Updates the game dash display variable game.display if applicable.
    var position;
    var result = false;
    if (letter) {   // check that guess is not the empty string
        // Find the first occurrence of guess in the answer
        position = game.answer.indexOf(letter);
        // if the guessed letter is found in the answer
        if (position > - 1) {
            result = true;
        }
        while (position >= 0) {
            // update the dash display and find all remaining occurrences
            game.display = game.display.substring(0, position) + letter + game.display.substring(position + 1);
            // get the next occurrence
            position = game.answer.indexOf(letter, position + 1);
        }
    }
    return result;
};


game.play = function () {
    // Invoked when the user clicks on GUESS
    if (game.over) {// if the game is over
        $('#wrong').text('Press RESTART to play again.');  // user has to restart

    } else {
        //if the game is not over yet
        var guess = $('#guessedletter').val().toLowerCase();
        if (game.check(game.answer, guess)) {
            // if the guess is valid
            $('#display').text(game.display);
        } else if (guess) {
            // If it's a wrong non-empty guess 
            game.wrong = guess + ' ' + game.wrong;
            game.wrongCount++;
            $('#wrong') .text(game.wrong);
            $('progress').val(game.wrongCount);
        }
        // reinitialize the guess
        $('#guessedletter') .val('');
        $('#guessedletter').focus();
        // check for a win or loss
        game.outcome();
    }
};

game.outcome = function () {
    // check if the game is won or lost
    if (game.answer === game.display) {
        $('#wrong') .text('Congratulations!  You win');
        gameScore = gameScore + 3;
        console.log("game.outcome gamescore = " + gameScore)
        game.over = true;  // game is over.  User has to restart to play again
    } else if (game.wrongCount >= 10) {
        $('#wrong') .text('No more guesses - the answer was ' + game.answer);
        gameScore = gameScore -2;
         console.log(" 2nd game.outcome gamescore = " + gameScore)
         $('#score').text(gameScore);
        game.over = true;  // game is over.  User has to restart to play again
    }
    
    if (game.over) { 
        localStorage.memoryScore = gameScore;
        console.log("local storage = " + localStorage.memoryScore)
    console.log("gamescore = " + gameScore)
        game.restart();
}

         
};

// Main program starts here
$(document).ready(function () {
    //gameScore =  localStorage.gameScore;

   
     remember();
    game.restart();
    $('#guessbutton').click(game.play);
    $('#restart').click(game.restartTally);
});