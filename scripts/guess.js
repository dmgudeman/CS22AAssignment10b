/*
 * Word Guessing Game and localStorage
 * CS22A Assignment 10
 * David M Gudeman
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

var gameScore; // variable to hold the game score

 game.restartTally = function () {
        
    // adjust the score for a forced restart
    gameScore = gameScore - 1;

    // update the localStaorage variable
    localStorage.memScore = gameScore;
    
   
    $('#score').text(gameScore);
   
    // move to the restart method
    game.restart ();
     $('#wrong').text('');
 };

game.restart = function () {
     // show score on the webpage
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

    // update the localStorage variable to the new answerposition
    localStorage.memAnsPosition = game.answerPosition;
  
    // Initialize the web page (the view)
    $('progress').val('0');  // initialize the progress bar
    $('#display').text(game.display);
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
        $('#wrong').text('Congratulations!  You win');

        // adjust the score
        gameScore = gameScore + 3;
        // update the localStorage variable
        localStorage.memScore = gameScore;
      
        game.over = true;  // game is over.  User has to restart to play again
    } else if (game.wrongCount >= 10) {
        $('#wrong').text('No more guesses - the answer was ' + game.answer);

        // adjust the score
        gameScore = gameScore -2;
          // update the localStorage variable
        localStorage.memScore = gameScore;
       
         $('#score').text(gameScore);
        game.over = true;  // game is over.  User has to restart to play again
    }
    
    if (game.over) {     
        game.restart();
    }
        
};

// Main program starts here
$(document).ready(function () {

    // initialize score in both localStorage variable and the gamescore when 
    // localStorage is clear
    if (localStorage.getItem("memScore") === null) {
        localStorage.memScore = 0;
        game.gameScore = 0;
      } else {
        // collect the gameScore from localStorage
        gameScore = Number(localStorage.memScore);
      }

    // initialize answerPosition in both localStorage variable and the gamescore when 
    // localStorage is clear
     if (localStorage.getItem("memAnsPosition") === null) {
        game.answerPosition= 0;
        localStorage.memAnsPosition = 0;
        
     } else {
         // collect the answerposition from localStorage and cast it
        game.answerPosition = Number(localStorage.memAnsPosition);
       
      }

    game.restart();
    $('#guessbutton').click(game.play);
    $('#restart').click(game.restartTally);
});