let questionCount = document.querySelector(".quiz-info .question-count span");
let bulletsContanier = document.querySelector(".bullets .spans");
let bulletsSection = document.querySelector(".bullets")
let questionArea = document.querySelector(".question-area");
let ansewrsArea = document.querySelector(".ansewrs-area");
let submitButton = document.getElementById("submit-button");
let mainResults = document.querySelector(".result");
let countdownElement = document.querySelector(".coutdown");
let iconHome = document.querySelector("#move");
let rightAnswers = 0;
let currentIndex = 0;
let countDownInterval;

function getQuestions(questionsLink){
    let myRequest = new XMLHttpRequest();
    
    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let jsObject = JSON.parse(this.responseText);
            let objectLength = jsObject.length;
            createBullets(objectLength);
            addData(jsObject[currentIndex], objectLength);
            countdown(10, objectLength)
            submitButton.onclick = () => {
                let rightAnswer = jsObject[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(rightAnswer, objectLength);
                questionArea.innerHTML = ''
                ansewrsArea.innerHTML = ''
                addData(jsObject[currentIndex], objectLength);
                handelBullets();
                clearInterval(countdownInterval)
                countdown(10, objectLength)
                showResults(objectLength);
            }
        }
    }

    myRequest.open("GET", questionsLink);
    myRequest.send();
}

function createBullets(n){
    questionCount.innerHTML = `0${n}`;

    for(let i = 0; i < n; i++){
        let theBullet = document.createElement("span");
        bulletsContanier.append(theBullet)
        if(i === 0){
            theBullet.className = "on";
            theBullet.innerHTML = `1`
        }
    }
}

function addData(obj, objCount){
    if(currentIndex < objCount){
            // Create h2 & hr 
    let h2 = document.createElement("h2");
    let hr = document.createElement("hr")
    h2.innerHTML = obj.title;
    questionArea.prepend(h2, hr);
    for(let i = 1; i <= 4; i++){
        // Create Input
        let div = document.createElement("div")
        div.className = "answer"
        let input = document.createElement("input")
        input.id = `answer_${i}`;
        input.name = "question";
        input.type = "radio";
        input.dataset.answer = obj[`answer_${i}`]

        if(i === 1){
            input.checked = true;
        }

        // Create Label
        let label = document.createElement("label");
        label.setAttribute("for", `answer_${i}`);
        label.innerHTML = obj[`answer_${i}`]
        div.append(input, label)
        ansewrsArea.appendChild(div)
    }
    }
}

function checkAnswer(theRightAnswer, objectLength){
    let ansewrs = document.getElementsByName("question");
    let choosenAnswers;
    for(let i = 0; i < ansewrs.length; i++){
        if(ansewrs[i].checked === true){
            choosenAnswers = ansewrs[i].dataset.answer;
        }
    }
    if(theRightAnswer === choosenAnswers){
        rightAnswers++;        
    }
}

function handelBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayFromBullets = Array.from(bulletsSpans);
    arrayFromBullets.forEach(function(sp, index){
        if(currentIndex === index){
            sp.className = "on";
            sp.innerHTML = index + 1
        }
    })
}

function showResults(count){
    let theResults;
    if(currentIndex === count){
        mainResults.style.display = "block"
        questionArea.remove();
        ansewrsArea.remove();
        submitButton.remove();
        bulletsSection.remove();
        if(rightAnswers >= count / 2 && rightAnswers < count){
            theResults = `Your Grade Is: <span class="good">Good</span>, You Answer: ${rightAnswers} Qustion Right`
            console.log(`rightAnswers: ${rightAnswers}, count: ${count}`);
        } else if(rightAnswers === count){
            theResults = `Your Grade Is: <span class="perfect">Perfect</span>, You Answer: All Qustion Right!`
        }
         else{
            theResults = `Your Grade Is: <span class="bad">Bad</span>, You Answer: ${rightAnswers} Qustion Right`
        }
        let backButton = document.createElement("button");
        backButton.className = "back-bttn"
        let backLink = document.createElement("a");
        backLink.innerHTML = "Back To Home";
        backLink.setAttribute("href", "home.html");
        backButton.append(backLink);
        mainResults.innerHTML = theResults;
        mainResults.append(backButton);
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
      let minutes, seconds;
      countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
  
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
  
        countdownElement.innerHTML = `${minutes}:${seconds}`;
  
        if (--duration < 0) {
          clearInterval(countdownInterval);
          submitButton.click();
        }
      }, 1000);
    }
  }

if(document.title === "Quiz App | HTML Quiz"){
    getQuestions("html_question.json")
} else if(document.title === "Quiz App | CSS Quiz"){
    getQuestions("css_qustions.json")
} else if(document.title === "Quiz App | JS Quiz"){
    getQuestions("js_questions.json")
} else if(document.title === "Quiz App | Python Quiz"){
    getQuestions("py_questions.json")
}