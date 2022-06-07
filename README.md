# SBA - HTML/CSS/JavaScript
## Project Description
This is a small Dictionary-based website with a basic landing page, word scramble game, and a dictionary searcher that uses the Free Dictionary API (https://github.com/meetDeveloper/freeDictionaryAPI) to find word definitions and phonetics.

This project uses PokeTEK as a baseline, with edits to its HTML, CSS, and JS to create a new site.

## Word Scramble
### General Description
Guess five scrambled words to win! Each correct guess increases the length of each word by a letter. You can safely make three incorrect guesses on a word before you'll have to restart.
### Technical Description
- There are five game levels, with level one using 3-letter long words, and the final level using 7-letter long words. Words increase in length with each level.
- Player may make three incorrect guesses on a word without penalty, but failing a fourth time ends the game.
- With each guess, the player's guess and the currently-scrambled word are shown in a table below the input field. Correct player gusses are bolded.
- The game can be reset and played again after winning or losing, reseting to level one and clearing the guesses table.
- Words are scrambled using a Fisher–Yates shuffle, and are reshuffled up to 2 additional times if a word scrambles into its original order.
- Words are chosen from the list of the top 500 most used english words (source: https://summerboardingcourses.com/blogs/500-most-common-words-in-english/).

## Word Search
### General Description
Look up a word in the dictionary! Enter the word, select if you want to see its definition or phonetics, then hit Search.
### Technical Description
- As stated above, the Free Dictionary API is used to look up entered words.
- Users may use a drop-down menu to search for either word definitions or word phonetics.
- Search results are displayed in a flexbox below the user input field that spreac out evenly in the remaining space.
- When there are many words, meanings, and definitions in the JSON response data, the program will only grab the first definition from each definitions array in an attempt to limit how crowded the flexbox becomes.
- If too many elements are still generated during a search for the page to easily hold, a scrollbar will show up on the search results section to view additional elements.
- When a word is missing a phonetic field but has a phonetics array, the program will try to extract phonetics from the phonetics array instead.
- If phonetic data cannot be found, an error message is displayed as a result instead for that instance of the word.
