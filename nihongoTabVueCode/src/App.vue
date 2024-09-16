<script setup lang="ts">
import VocabWordJapanese from './components/VocabWordJapanese.vue'
import VocabWordEnglish from './components/VocabWordEnglish.vue'
import VocabListSelector from './components/VocabListSelector.vue';
import vocab from './assets/japanese-vocab.json'
import { ref } from 'vue'

//App State
const appState = ref({
  currentVocabList: 'N5',
  currentWord: 0,
  setLength: 10,
  vocab: vocab,

  showYomigana: false,
  showKanji: true,
  showEnglish: false,

  showNextSetButton: false,
  showEndOfVocabList: false,

  progressBar: 0
})

//Vocab list data
// const vocabListLibrary = ref([
//   {
//     vocabListName: "N5",
//     vocabListIndex: "N5"
//   },
//   {
//     vocabListName: "N4",
//     vocabListIndex: "N4"
//   },
//   {
//     vocabListName: "N3",
//     vocabListIndex: "N3"
//   },
//   {
//     vocabListName: "N2",
//     vocabListIndex: "N2"
//   },
//   {
//     vocabListName: "N1",
//     vocabListIndex: "N1"
//   },
//   {
//     vocabListName: "Other",
//     vocabListIndex: "No set"
//   }
// ])

//On click funtions
function clickJapanese() {
  if (appState.value.showYomigana === false) {
    appState.value.showYomigana = true
  }
}
function clickEnglish() {
  if (appState.value.showEnglish === false) {
    appState.value.showEnglish = true
    //increment progress bar
    if (_atEndOfSet() || _atEndOfVocabList()) {
      appState.value.showNextSetButton = true
    }
  } else {
    _getNextWord()
  }
}
function clickNextSet() {
  _resetFlashcard()
  if (_atEndOfVocabList()) {
    _hideFlashcard()
    appState.value.showEndOfVocabList = true
  } else {
    appState.value.currentWord = appState.value.currentWord+1
  }
}
function changeVocabList(vocabList:string) {
  appState.value.currentVocabList = vocabList
  appState.value.currentWord = 0
  //currentVocabList.value = vocabList
}
function _getNextWord() {
  _resetFlashcard()
  if (_atEndOfVocabList()) { //Go back to the begining of the set when the set length is <setLength
    appState.value.currentWord = (appState.value.currentWord+1) - ((vocab as any)[appState.value.currentVocabList].length % appState.value.setLength)
  } else if (_atEndOfSet()) { //Go back to begining of the set
    appState.value.currentWord = (appState.value.currentWord+1) - appState.value.setLength
  } else {
    appState.value.currentWord = appState.value.currentWord+1
  }
}
function _resetFlashcard() {
  appState.value.showKanji = true
  appState.value.showYomigana = false
  appState.value.showEnglish = false
  appState.value.showNextSetButton = false
}
function _hideFlashcard() {
  appState.value.showYomigana = false
  appState.value.showKanji = false
  appState.value.showEnglish = false
}
function _atEndOfSet() {
  return ((appState.value.currentWord+1) % appState.value.setLength) === 0 //|| (appState.value.currentWord+1) === vocab[_vocabList].length
}
function _atEndOfVocabList() {
  return (appState.value.currentWord+1) === (vocab as any)[appState.value.currentVocabList].length
}
</script>

<template>
  <header>
      <VocabListSelector 
        :currentVocabList="appState.currentVocabList"
        @changeVocabList="changeVocabList"
      />
    <div class="wrapper">
      <VocabWordJapanese 
        :currentVocabList="appState.currentVocabList" 
        :currentWord="appState.currentWord"
        :vocab="appState.vocab"
        :showYomigana="appState.showYomigana"
        :showKanji="appState.showKanji" 
        @clickJapanese="clickJapanese"
      />
    </div>
  </header>
      <VocabWordEnglish 
        :currentVocabList="appState.currentVocabList" 
        :currentWord="appState.currentWord" 
        :vocab="appState.vocab"
        :showEnglish="appState.showEnglish" 
        @clickEnglish="clickEnglish"
      />
    <div>
      <button class="button" v-show="appState.showNextSetButton" @click="clickNextSet()">Next vocab set</button>
    </div>
    <div>
      <h1 v-show="appState.showEndOfVocabList" class="green">Congrats! You completed this vocab list!</h1>
    </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.button {
  background-color: hsla(160, 100%, 37%, 1);
  border: none;
  color: #181818;
  padding: 15px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 22px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
