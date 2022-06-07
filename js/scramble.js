"use strict";
console.log("scramble.js loaded");

// DOM ELEMENTS
const guessButton = document.getElementById("guess-button");
const inputField = document.getElementById("guess-input");
const scrambleDisplay = document.getElementById("scrambled-word");
const livesDisplay = document.getElementById("lives-display");
const livesDisplayText = document.getElementById("lives-display-text");
const guessTable = document.getElementById("guess-table");

const levelOneWords = ["add","bed","can","day","eat","far","got","has","let","map","new","oil","put","ran","sea","two",
                       "use","war","was","way"];
const levelTwoWords = ["area","base","bird","cold","down","easy","fact","fire","game","hand","idea","just","king",
                       "list","mark","note","open","page","rain","ship","time","true","upon","very","wait"];
const levelThreeWords = ["among","build","class","dream","earth","false","group","heavy","known","large","music",
                         "never","other","place","quick","reach","space","spell","think","usual","vowel","water"];
const levelFourWords = ["answer","behind","change","decide","enough","family","ground","happen","island","letter",
                        "minute","notice","object","person","record","spring","toward","wagons"];
const levelFiveWords = ["against","another","because","between","brought","certain","contain","country","decided",
                        "develop","example","explain","hundred","include","machine","measure","million","morning",
                        "perhaps","picture","problem","product","provide","receive","science","several","special",
                        "thought","through",];
const allLevels = [levelOneWords, levelTwoWords, levelThreeWords, levelFourWords, levelFiveWords];

// CHECK FOR FILTER AND SEARCH FOR POKEMON
// searchButton.onclick = searchForPokemon;  // via handler

guessButton.addEventListener('click', guessWord);
var gameLevel = 0;
var currentWord;
var lives = 4;

window.onload = function init()
{
  createScrambledWord();
}

// Funct to get a scrambled word
function createScrambledWord()
{
  let levelAry = allLevels[gameLevel];
  currentWord = levelAry[Math.floor(Math.random() * levelAry.length)];
  let scrambledWord = currentWord.split("");
  let tries = 3;
  while((scrambledWord.join("") == currentWord) && (tries-- > 0))
  {
    for(let i = 0; i < scrambledWord.length; i++)
    {
        let j = Math.floor(Math.random() * scrambledWord.length);
        let temp = scrambledWord[i];
        scrambledWord[i] = scrambledWord[j];
        scrambledWord[j] = temp;
    }
  }
  scrambledWord = scrambledWord.join("");
  scrambleDisplay.textContent = scrambledWord;
}

// Funct to guess for correctness and lose con
function guessWord(event)
{
  if(gameLevel === -1) // If the game was reset
  {
    raiseLevel();
    inputField.value = "";
    // clear the table of past-game guesses
    while(guessTable.children.length > 2)
    {
        guessTable.removeChild(guessTable.lastChild);
    }
    return;
  }

  const guess = inputField.value.toLowerCase();
  console.log("Cheating output - Input guess: " + guess + " word: " + currentWord);
  inputField.value = "";

  // Dunno if this should happen all the time or only on wrongs
  // It feels off if it's only on wrongs since the table doesn't increase with a right answer
  // but also right answers don't add anything to the table...
  updateGuessesTable(guess);

  // Check if the guess is right
  if(guess === currentWord)
  {
    raiseLevel();
  }
  // Otherwise, we lose a guess and maybe the game
  else
  {


    loseLife();
  }
}

function updateGuessesTable(guess)
{
    const tableGuess = document.createElement("tr");
    var rightGuess = (guess === currentWord);

    let guessHTML = '<tr class="prev-guess">';
    guessHTML += '<td>';
    if(rightGuess)
        guessHTML += "<b>";
    guessHTML += guess;
    if(rightGuess)
            guessHTML += "</b>";
    guessHTML += '</td>';
    guessHTML += '<td>' + scrambleDisplay.textContent + '</td>';
    guessHTML += '</tr>';

    tableGuess.innerHTML = guessHTML;
    guessTable.appendChild(tableGuess);
}

// Funct to increase the game's level (and check win con)
function raiseLevel()
{
    gameLevel++;
    lives = 4;
    if(gameLevel < 5)
    {
        createScrambledWord();
        livesDisplayText.textContent = "" + lives + " guess(es) left!";
    }
    else // GG
    {
        scrambleDisplay.textContent = "You Win! Input any guess to play again!";
        livesDisplayText.textContent = "GG";
        gameLevel = -1;
    }
}

function loseLife()
{
    lives--;
    if(lives <= 0)
    {
        scrambleDisplay.textContent = "You Lost... Input any guess to try again!";
        livesDisplayText.textContent = "The correct word was " + currentWord + ".";
        gameLevel = -1;
    }
    else
    {
        livesDisplayText.textContent = "" + lives + " guess(es) left!";
    }
}

/*
async function searchForWords(event){
  console.log("Clicked target ID: " + event.target.id);
  const searchVal = inputField.value.toLowerCase();
  console.log("Search value: " + searchVal);
  // add loading to dom
  loading.style.opacity = "1";
  pokeGridContainer.innerHTML = "";
  // get search type
  let option = selectField.value;
  // let pokemon = [];
  if (option === "definitions") {
    // create a promise object
    const wordPromise = getWord(`${searchVal}`);
    // when promise is fulfilled, execute callback function
    wordPromise.then( (word) => {
      loading.style.opacity = '0';
      if (word != null) {
        console.log("Wordfound: " + word);
        createDefinitionElems(word);
      } else {
        createNotFound();
      }
    });
  }

  else if (option === "phonetics") {
    const wordPromise = getWord(`${searchVal}`);
    wordPromise.then((word) => {
      console.log("Word found: " + word);
      loading.style.opacity = '0';
      if (word != null) {
        console.log("Word found: " + word);
        createPhoneticElems(word);
      }

      if (word == null){
        createNotFound();
      }
    })
  }
}

function createPhoneticElems(word)
{
  const wordName = word[0].word;
  for(let initialWord of word)
  {
    let phonetic = initialWord.phonetic;
    if(phonetic == null)
    {
      try {
        phonetic = initialWord.phonetics[1].text;
        if(phonetic == null)
          phonetic = "(missing in API)";
      }
      catch (err)
      {
        phonetic = "(missing in API)";
      }
    }
    createElem(wordName, phonetic);
  }
}

function createDefinitionElems(word) {
  // JSON structure
  // word - base json
  // [] - Initial Ary, can contain n different views of a word
  // meanings - Different meanings of a word
  // [] - meanings ary
  // definitions - the different definitions of a word
  // [] - definitions ary
  // definition - the String containing the definition
  const wordName = word[0].word;
  for(let initialWord of word)
  {
    for(let meaning of initialWord.meanings)
    {
        let definition = meaning.definitions[0].definition;
        createElem(wordName, definition);
    }
  }
}

function createElem(wordName, content)
{
  const pokeListItem = document.createElement("div");
  pokeListItem.classList.add("poke-list-item");

  let definitionHTML = '<div class="info-container">';
  definitionHTML += '<h2>' + wordName + '</h2>';
  definitionHTML += '<p>' + content + '</p>';
  definitionHTML += '</div>';

  pokeListItem.innerHTML = definitionHTML;
  pokeGridContainer.appendChild(pokeListItem);
}

function createNotFound(){
  console.log("Sorry, no matches found");
  // add an html element that says no matches found

  const errListItem = document.createElement("div");
  errListItem.classList.add("poke-list-item");

  const pokeInnerHTML = `
    <div class="info-container">
        <h2>MissingNo.</h2>
        <p>No matching results</p>
    </div>
  <div class="img-container"><img src="../images/error.png">
  </div>
  `;

  errListItem.innerHTML = pokeInnerHTML;
  pokeGridContainer.appendChild(errListItem);
}

// API CALLS ----------------

*/
