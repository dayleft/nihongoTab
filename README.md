# nihongoTab
Japanese vocab chrome new tab extension

Problem
- Learning vocab is tedious and boring
- Flashcards don't get used often enough (finding them or remembering you have them is another task on top of an already arduous task)

Product Features
- 20 Random vocab words
  - Chosen at random from active lists each day
  - On each newtab load: randomly order and choose (kanji/English) the 20 selected for that day, set progress bar to 0%
    - If vocab word is kanji
      - On left side click: 
        - Show yomigana above kanji
        - If yomigana showing and translation not showing, do nothing
        - If yomigana showing and translation showing, move to next word
      - On right side click: 
        - Show translation 
        - If translation showing, move to next word
    -  If vocab word is English
      - On left click: 
        - If kanji and yomigana not showing, do nothing
        - If kanji and yomigana showing, move to next word
      - On right side click: 
        - Show kanji with yomigana above 
        - If kanji and yomigana showing, move to next word
    - If all 20 words completed and click event occurs
      - Re-randomize 20 words (like on page load) 
      - Do not reset progress bar
      - Show "Vocab refresh" button (selects 20 different words from active lists)
    - If all words in active lists have been "learned" that day
      - Show "you did it image" (ask Amy)
      - Show button to render the active list picker
        - On list selection, clear "learned"
- "Refresh button"
  - On click:
    - Swap day's 20 words with 20 different words from the list (remembers the words learned that day, but clears @end of day)
    - If <20 words left in list, show the remaining words (this will impact progress bar)
    - If 0 words in list
      - show a you're done image (ask Amy)
      - Show button to render the active list picker
        - On list selection, clear "learned"
- Pastel green progress bar 
  - On top of new tab (think youtube loading with red bar, but thicker)
  - Increases with each translation shown
  - Motivates completion in session  
- Multiple vocab lists can be active/inactive at any time (selection in extention icon)
  - If none set to active: on new tab load the list of vocab lists and ask user to select 1 or multiple and confirm, then show the 1st of the 20 words selected
- Vocab shown can be set to kanji only/English only/Random [Default: random]
 

Later features
- Vocab selection order based on how often gotten incorrect
  - Click on left side, flash pastel green and on backend note that it was gotten correct
  - Click on right side, flash pastel red and on backend note taht it was gotten incorrect
- Weekly reporting on words that you are struggling with
- Github like calaendar of days where you at least went through 20 vocab words

Implementation
- Frontend: HTML/CSS, JS
- Backend: google sheets
- Storage: google sheets
