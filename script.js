const numberOfQuestions = document.querySelector(".count span");
const bulletsSpanContainer = document.querySelector(".bullets .spans");
const questionTitle = document.querySelector(".quiz-area .title");
const quizArea = document.querySelector(".quiz-area");
const answerArea = document.querySelector(".answers-area");
const submit = document.querySelector(".submit-answer");
const bullets = document.querySelector(".bullets");
const result = document.querySelector(".results");
const quizInfo = document.querySelector(".quiz-info");
let startQuiz = document.querySelector(".start-quiz-off");
const XXX = document.querySelector(".count");
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval; // Store the countdown interval
result.innerHTML = "";
submit.style.display = "none";
XXX.style.display = "none";
if (startQuiz) {
  startQuiz.onclick = function () {
    startQuiz.remove();
    submit.style.display = "block";
    XXX.style.display = "block";

    function getQuestions() {
      // Function To Get JSON Object
      let myRequest = new XMLHttpRequest();

      myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          let questionsObject = JSON.parse(this.responseText); // From JSON object To Js Object
          let questionCount = questionsObject.length;
          // Create Bullets + Set Question Count
          createBullets(questionCount);
          // Add Question Data
          addQuestionData(questionsObject[currentIndex], questionCount);

          // Start the countdown timer for the first question
          countDown(300, questionCount); // Set 5 minutes per question (300 seconds)

          // Click on Submit
          submit.onclick = () => {
            let rightAnswer = questionsObject[currentIndex].rightAnswer;
            currentIndex++;
            checkAnswer(rightAnswer, questionCount);
            questionTitle.innerHTML = " ";
            answerArea.innerHTML = " ";
            addQuestionData(questionsObject[currentIndex], questionCount);
            handleBullets();

            // Reset countdown for the next question
            clearInterval(countdownInterval);
            countDown(300, questionCount); // Start countdown for the next question

            ShowResults(questionCount);
          };
        }
      };
      myRequest.open("GET", "html_questions.json", true);
      myRequest.send();
    }

    getQuestions();

    function createBullets(num) {
      numberOfQuestions.innerHTML = num;
      for (let i = 0; i < num; i++) {
        let bullet = document.createElement("span");
        if (i === 0) {
          bullet.className = "on";
        }
        bulletsSpanContainer.appendChild(bullet);
      }
    }

    function addQuestionData(obj, count) {
      if (currentIndex < count) {
        questionTitle.textContent = obj.title; // Set the question title
        for (let i = 1; i <= 4; i++) {
          let mainDiv = document.createElement("div");
          mainDiv.className = "answer";

          let radioInput = document.createElement("input");
          radioInput.name = "question";
          radioInput.type = "radio";
          radioInput.id = `answer${i}`;
          radioInput.dataset.answer = obj[`answer${i}`]; // Store answer text in data-answer

          let theLabel = document.createElement("label");
          theLabel.htmlFor = `answer${i}`;
          theLabel.appendChild(document.createTextNode(obj[`answer${i}`])); // Add text to label

          mainDiv.appendChild(radioInput);
          mainDiv.appendChild(theLabel);

          answerArea.appendChild(mainDiv);
        }
      }
    }

    function checkAnswer(rightAnswer, count) {
      let answers = document.getElementsByName("question");
      let chosenAnswer;

      for (let i = 0; i < 4; i++) {
        if (answers[i].checked) {
          chosenAnswer = answers[i].dataset.answer;
        }
      }

      if (rightAnswer === chosenAnswer) {
        rightAnswers++;
        console.log("Good");
      }
    }

    function handleBullets() {
      let bulletsSpans = document.querySelectorAll(".bullets .spans span");
      let arrayOfSpans = Array.from(bulletsSpans);
      for (let i = 0; i < 10; i++) {
        if (currentIndex === i) {
          arrayOfSpans[i].className = "on";
        } else {
          arrayOfSpans[i].className = " ";
        }
      }
    }

    function ShowResults(count) {
      if (currentIndex === count) {
        questionTitle.innerHTML = " ";
        answerArea.innerHTML = " ";
        submit.remove();
        bullets.remove();
        if (rightAnswers >= 5 && rightAnswers < 10) {
          result.innerHTML = `<span class="good">Good</span> : You got ${rightAnswers} out of 10`;
        } else if (rightAnswers < 5) {
          result.innerHTML = `<span class="bad">bad</span> : You got ${rightAnswers} out of 10`;
        } else {
          result.innerHTML = `<span class="perfect"> Excellent </span> : You got ${rightAnswers} out of 10`;
        }
      }
    }

    // Countdown function
    function countDown(duration, count) {
      let timeRemaining = duration;

      const minutesDisplay = document.querySelector(".countdown .min");
      const secondsDisplay = document.querySelector(".countdown .sec");

      clearInterval(countdownInterval);

      countdownInterval = setInterval(() => {
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining % 60;

        minutesDisplay.textContent = minutes.toString().padStart(2, "0");
        secondsDisplay.textContent = seconds.toString().padStart(2, "0");

        timeRemaining--;

        if (timeRemaining < 0) {
          clearInterval(countdownInterval);
          onTimeUp(); // Handle when time is up
        }
      }, 1000);
    }

    function onTimeUp() {
      console.log("Time's up! Moving to the next question...");
      submit.click(); // Simulate submit when time runs out
    }
  };
}
