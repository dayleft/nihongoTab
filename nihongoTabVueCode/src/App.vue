<script setup async lang="ts">
import VocabWordJapanese from './components/VocabWordJapanese.vue'
import VocabWordEnglish from './components/VocabWordEnglish.vue'
import VocabListSelector from './components/VocabListSelector.vue';
import vocab from './assets/japanese-vocab.json'
import { ref } from 'vue'

//Interfaces
interface StorageData {
  currentVocabList : string
  vocabListSet : object
}

//Set initial State
const currentVocabList = ref("N5")
var currentWord = 0
var set = 0
var setLength = 10
var randomSetWords = _getRandomSetWords(set,setLength)

const yomigana = ref({
  text: (vocab as any)[currentVocabList.value][randomSetWords[currentWord]].hiragana,
  show: false
})
const kanji = ref({
  text: (vocab as any)[currentVocabList.value][randomSetWords[currentWord]].kanji,
  show: true
})
const english = ref({
  text: (vocab as any)[currentVocabList.value][randomSetWords[currentWord]].english,
  show: false
})

const showNextSetButton = ref(false)
const showEndOfVocabList = ref(false)
var showComponents = false;

// Update initial state based on storage data
async function setGlobalState() {
  var storageData  =  await _getStorageData("storageData")
  currentVocabList.value = storageData.currentVocabList
  currentWord = 0
  set = (storageData as any).vocabListSet[storageData.currentVocabList]
  setLength = 10
  randomSetWords = _getRandomSetWords(set,setLength)

  yomigana.value.text = (vocab as any)[currentVocabList.value][randomSetWords[currentWord]].hiragana
  yomigana.value.show = false
  
  kanji.value.text = (vocab as any)[currentVocabList.value][randomSetWords[currentWord]].kanji
  kanji.value.show = true

  english.value.text = (vocab as any)[currentVocabList.value][randomSetWords[currentWord]].english
  english.value.show = false

  showNextSetButton.value = false
  showEndOfVocabList.value = false
  showComponents = true
}

async function _getStorageData(key : string) {
  const defaultStorageData : StorageData = {
    currentVocabList : 'N5',
    vocabListSet : {
      "N5" : 0,
      "N4" : 0,
      "N3" : 0,
      "N2" : 0,
      "N1" : 0
    }
  }
  return new Promise((resolve,reject) => {
    chrome.storage.sync.get({key : defaultStorageData},resolve);
  })
    .then(result => {
      return (result as any).key;
    });
}

// async function getStorageData(key : string) {
//   var storageData  =  await _getStorageData(key)
// }

async function setStoragedata(key : string, value : StorageData) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({key : value},resolve);
  });
}

//Calling the 'main' async function
setGlobalState();

//On click funtions ===============================
function clickJapanese() {
  if (yomigana.value.show === false) {
    yomigana.value.show = true
  }
}
function clickEnglish() {
  if (english.value.show === false) {
    english.value.show = true
    //increment progress bar
    if (_atEndOfSet() || _atEndOfVocabList()) {
      showNextSetButton.value = true
    }
  } else {
    _getNextWord()
  }
}
function clickNextSet() {
  _resetFlashcard()
  if (_atEndOfVocabList()) {
    _hideFlashcard()
    showEndOfVocabList.value = true
  } else {
    _setupNextSet()
  }
}
async function changeVocabList(vocabList : string) {
  // set up the new vocablist
  currentVocabList.value = vocabList
  english.value.show = false
  currentWord = 0
  _updateWord()
  // save the change of vocablist
  var updatedStorageData : StorageData = await _getStorageData("storageData");
  updatedStorageData.currentVocabList = vocabList
  setStoragedata("storageData",updatedStorageData);
}

// Helper Functions =========================================
async function _setupNextSet() {
  // set up the set
  english.value.show = false
  set = set+1
  currentWord = 0
  randomSetWords = _getRandomSetWords(set,setLength)
  _updateWord()
  // save the change of set
  var updatedStorageData : StorageData = await _getStorageData("storageData");
  (updatedStorageData as any).vocabListSet[currentVocabList.value] = set
  setStoragedata("storageData",updatedStorageData);
}

function _getRandomSetWords(set : number,setLength : number) {
  //Create an array with all numbers
  let randomSetWords = Array(setLength)
  for (let i = 0; i < setLength; i++) {
    randomSetWords[i] = (set*setLength)+i
  }
  //Randomize array positions
  for (let i = 0; i < setLength; i++) {
    let randomIndex = Math.floor(Math.random()*setLength)
    let swappedValue = randomSetWords[randomIndex]
    randomSetWords[randomIndex] = randomSetWords[i]
    randomSetWords[i] = swappedValue
  }
  return randomSetWords
}
function _getNextWord() {
  _resetFlashcard()
  if (_atEndOfVocabList() || _atEndOfSet()) {
    currentWord = 0
    randomSetWords = _getRandomSetWords(set,setLength)
  } else {
    currentWord = currentWord+1
  }
  _updateWord()
}
function _updateWord() {
  yomigana.value.text = (vocab as any)[currentVocabList.value][randomSetWords[currentWord]].hiragana
  kanji.value.text = (vocab as any)[currentVocabList.value][randomSetWords[currentWord]].kanji
  english.value.text = (vocab as any)[currentVocabList.value][randomSetWords[currentWord]].english
}
function _resetFlashcard() {
  kanji.value.show = true
  yomigana.value.show = false
  english.value.show = false
  showNextSetButton.value = false
}
function _hideFlashcard() {
  yomigana.value.show = false
  kanji.value.show = false
  english.value.show = false
}
function _atEndOfSet() {
  return currentWord+1 === setLength
}
function _atEndOfVocabList() { //Need to test ****************************************************
  return (set*setLength+currentWord+1) === (vocab as any)[currentVocabList.value].length
}
</script>

<template>
  <div>
      <VocabListSelector 
        :currentVocabList="currentVocabList"
        @changeVocabList="changeVocabList"
        v-show="showComponents"
      />
  </div>
  <div class="wrapper">
      <VocabWordJapanese 
        :yomigana="yomigana" 
        :kanji="kanji"
        @click="clickJapanese()"
        v-show="showComponents"
      />
  </div>
      <VocabWordEnglish 
        :english="english"
        @click="clickEnglish()"
        v-show="showComponents"
      />
    <div>
      <button class="button" v-show="showNextSetButton" @click="clickNextSet()">Next vocab set</button>
    </div>
    <div>
      <h1 v-show="showEndOfVocabList" class="green">Congrats! You completed this vocab list!</h1>
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
