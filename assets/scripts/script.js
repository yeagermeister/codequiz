// variables for html elements
// Initial layout
var body = document.body
var highscoreEl = document.querySelector("#highscore");
var timerEl = document.querySelector("#timer");
var headingEl = document.querySelector("#heading");
var paraEl = document.querySelector("#para");
var startButtonEl = document.querySelector("#start-button");

// quiz layout
var quizareaEl = document.querySelector("#quizarea")
var button1 = document.querySelector("#b1");
var button2 = document.querySelector("#b2");
var button3 = document.querySelector("#b3");
var button4 = document.querySelector("#b4");
var resultEl = document.querySelector("#result");

// Submit Layout
var formEl = document.querySelector("#initials");
var initEl = document.querySelector("#init");

//Highscores Layout
var goBackEl = document.createElement("button-back");
var clearEl = document.createElement("button-clear");
var listEl = document.createElement("ol");
var footerEl = document.createElement("ul");


// These arrays are used to fill in the questions and answers on the quiz.
var items
var question1 = ["Commonly used data types Do NOT include:", 
"1. strings", "2. booleans", "3. alerts", "4. numbers", 3];
var question2 = ["The condition in an if/else statement is enclosed within ______.:", 
"1. quotes", "2. curly brackets", "3. parantheses","4. square brackets", 3] ;
var question3 = ["Arrays in JavaScript can be used to store _______.", 
"1. numbers and strings",  "2. other arrays", "3. booleans", "4. all of the above", 4];
var question4 = ["String values must be stored in _______ when being assigned to variables.",
"1. commas", "2. curly brackets", "3. quotes", "4. parantheses", 3];
var question5 = ["A very useful tool used during development and debugging for printing content to the debugger is:", 
"1. JavaScript", "2. terminal / bash", "3. for loops", "4. console.log", 4];

// timer variables
var timeInterval
var timeLeft = 75;

var page = 1; //sets which page of the quiz we are on
var answer;
var correct;
var score;
var highscores =[];


startButtonEl.addEventListener("click", startQuiz);

clearEl.addEventListener("click", clearHighscores);

highscoreEl.addEventListener("click", function() {
    getHighScores();
    renderHighScores();
});

goBackEl.addEventListener("click", refresh);

quizareaEl.addEventListener("click", function(event) {
    var element = event.target;

    if (element.matches(".button")) {
        answer = element.getAttribute("data-value");
        checkAnswer();
        setQuestions();
    }
    
    if (page === 6) {
        calculateScore();
        renderForm();
    }
}); 

formEl.addEventListener("submit", function(event) {
    event.preventDefault();
    var int = initEl.value.trim();
    if (int.length === 0) {
        alert("Please enter your initials before submitting your score.")
    }   else {
        var write = int + " - " + score;
        highscores.push(write);
        localStorage.setItem("Highscores", JSON.stringify(highscores));
        renderHighScores();
    }
});

initEl.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("click caught")
    resultEl.className = "hidden";
});


// *********************************************************
// ***************** Start the quiz ***********************
// *********************************************************
function startQuiz() {  
    startTimer();
    buildQuiz();
    setQuestions();
    getHighScores();
};

function startTimer() {
    timeInterval = setInterval(function () {
		if (timeLeft > 0) {
            timeLeft--;
		    timerEl.textContent = 'Time: ' + timeLeft;
        }
        
		else if (timeLeft === 0) {
			clearInterval(timeInterval);
            calculateScore();// If time runs out, end the game
            renderForm();
		}
    }, 1000);
};

// Check if the answers are correct and notify the user.  Increment the page count so the next question can be displayed.
function checkAnswer() {
    resultEl.className = "result";
    if (answer == correct) {
        resultEl.textContent = "Correct!";
    } else {
        resultEl.textContent = "Incorrect!";
        timeLeft = timeLeft - 10;
    };
    page++
};

// stop the timer and set the score to a global variable
function calculateScore () {
    score = timeLeft
    clearInterval(timeInterval);
};

// get high scores from local storage and load to a  global variable
function getHighScores() {
    var storedHighscores  = JSON.parse(localStorage.getItem("Highscores"));
    if (storedHighscores !== null) {
        highscores = storedHighscores;
    };
};

// clear the high scores from the local storage and reset what is displayed
function clearHighscores () {
    localStorage.clear();
    highscores = null;
    listEl.className = "hidden";
};

// refresh the page when go back is clicked
function refresh () {
    location.reload(true);
};

// *********************************************************
// ***************** page setup ****************************
// *********************************************************

// sets the layout of the quiz area
function buildQuiz () {
    startButtonEl.className = "hidden",
    paraEl.className = "hidden";
    quizareaEl.className = "quizarea";
};

// Adds text to the heading and buttons depending on which page we are on
function setQuestions(){
    if (page === 1) {items = question1};
    if (page === 2){items = question2};
    if (page === 3){items = question3};
    if (page === 4){items = question4};
    if (page === 5) {items = question5};

    headingEl.textContent = items[0];          
    button1.innerHTML = items[1];
    button2.innerHTML = items[2];
    button3.innerHTML = items[3];
    button4.innerHTML = items[4];
    correct = items[5];
};

// Render the form page to submit the high score
function renderForm () {
    headingEl.setAttribute("class", "heading heading-left");
    headingEl.textContent = "All done!";
    quizareaEl.setAttribute("class", "hidden");
    paraEl.setAttribute("class", "p p-left");
    paraEl.innerHTML = "Your final score is " + score;
    formEl.setAttribute("class", "form");
    timerEl.className = "hidden";
};

// Render the high scores page
function renderHighScores() {
    headingEl.setAttribute("class", "heading heading-left");
    headingEl.textContent = "Highscores";
    startButtonEl.className = "hidden";
    paraEl.className ="hidden";
    formEl.className = "hidden";
    body.appendChild(listEl);
    listEl.className = "custom-list";

    for (var i = 0; i < highscores.length; i++ ) {
        var temp = highscores[i];
        var li = document.createElement("li");
        li.textContent = temp;
        listEl.appendChild(li);
    };

    body.appendChild(footerEl)
    footerEl.className = "horizontal";
    footerEl.appendChild(goBackEl);
    footerEl.appendChild(clearEl);
    goBackEl.classList.add("button");
    goBackEl.classList.add("highscore-setup");
    clearEl.className = "button";
    clearEl.innerHTML = "Clear Highscores"
    goBackEl.innerHTML = "Go Back";
    highscoreEl.className = "hidden";
};

