"use strict";
console.log("search.js loaded");

const URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

// DOM ELEMENTS
const searchButton = document.getElementById("word-search-button");
const searchGridContainer = document.getElementById("search-grid-container");
const inputField = document.getElementById("wordsearch-input");
const selectField = document.getElementById("searchfilter");
const loading = document.getElementById("loading-icon-container");

// CHECK FOR FILTER AND SEARCH FOR POKEMON
// searchButton.onclick = searchForPokemon;  // via handler
searchButton.addEventListener('click', searchForWords);

async function searchForWords(event){
  console.log("Clicked target ID: " + event.target.id);
  const searchVal = inputField.value.toLowerCase();
  console.log("Search value: " + searchVal);
  // add loading to dom
  loading.style.opacity = "1";
  searchGridContainer.innerHTML = "";
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
  const wordName = word[0].word.charAt(0).toUpperCase() + word[0].word.slice(1);
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
  const wordName = word[0].word.charAt(0).toUpperCase() + word[0].word.slice(1);
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
  const searchListItem = document.createElement("div");
  searchListItem.classList.add("search-list-item");

  let definitionHTML = '<div class="info-container">';
  definitionHTML += '<h2>' + wordName + '</h2>';
  definitionHTML += '<p>' + content + '</p>';
  definitionHTML += '</div>';

  searchListItem.innerHTML = definitionHTML;
  searchGridContainer.appendChild(searchListItem);
}

function createNotFound(){
  console.log("Sorry, no matches found");
  // add an html element that says no matches found

  const errListItem = document.createElement("div");
  errListItem.classList.add("search-list-item");

  const searchInnerHTML = `
    <div class="info-container">
        <h2>Nothing, Nada, Zilch</h2>
        <p>Sorry, we couldn\'t find your word in the dictionary.</p>
    </div>
  </div>
  `;

  errListItem.innerHTML = searchInnerHTML;
  searchGridContainer.appendChild(errListItem);
}

// API CALLS ----------------

// Fetch a Pokemon by name
async function getWord(searchWord) {
  try{
    //
    const responsePromise = await fetchWithTimeout((`${URL}/${searchWord}`), {timeout: 2000})
        .catch(e => {
          console.log(e);
        });

    if (responsePromise.status != 200){

      // stop loading screen
      loading.style.opacity = '0';
      console.log("status from api call: " + responsePromise.status);
      // show lack of results from completed call in the dom
      return null;

    } else {
      // the .json method parses the json into a JavaScript object
      //alert(await responsePromise.json());
      const word = await responsePromise.json();
      console.log(word);
      return word;
    }

  } catch (error){
    console.log(error);
  }

}

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}


