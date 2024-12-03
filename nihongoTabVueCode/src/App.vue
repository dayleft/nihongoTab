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
var showWordComponents = true

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
  showWordComponents = true
  // console.log("end of async call: "+showWordComponents)
}

async function _getStorageData(key : string) {
  const defaultStorageData : StorageData = {
    currentVocabList : 'N5',
    vocabListSet : {
      "N5" : 0,
      "N4" : 0,
      "N3" : 0,
      "N2" : 0,
      "N1" : 0,
      "TerraceHouse" : 0
    }
  }
  return new Promise((resolve,reject) => {
    chrome.storage.sync.get({key : defaultStorageData},resolve);
  })
    .then(result => {
      return (result as any).key;
    });
}

async function setStoragedata(key : string, value : StorageData) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({key : value},resolve);
  });
}

//Calling the 'main' async function
setGlobalState();
// console.log("after set global state: "+showWordComponents)

//On click funtions ===============================
function clickJapanese() {
  if (yomigana.value.show === false) {
    yomigana.value.show = true
  }
}

function clickEnglish() {
  if (english.value.show === false) {
    english.value.show = true
    if (_atEndOfSet() && !_atEndOfVocabList()) {
      showNextSetButton.value = true
    }
  } else if (english.value.show === true && _atEndOfVocabList()) {
    _hideFlashcard()
    showEndOfVocabList.value = true
  }
  else {
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
  // reset word components
  _resetFlashcard()
  // set up the new vocablist
  currentVocabList.value = vocabList
  currentWord = 0
  var updatedStorageData : StorageData = await _getStorageData("storageData");
  set = (updatedStorageData as any).vocabListSet[vocabList]
  if (_atFinalSet()) {
    randomSetWords = _getRandomSetWords(set,_getFinalSetLength())
  } else {
    randomSetWords = _getRandomSetWords(set,setLength)
  }
  _updateWord()
  // save the change of vocablist
  updatedStorageData.currentVocabList = vocabList
  setStoragedata("storageData",updatedStorageData);
}

async function resetVocabList() {
  // reset flashcard and set
  _resetFlashcard()
  currentWord = 0
  set = 0
  if (_atFinalSet()) {
    randomSetWords = _getRandomSetWords(set,_getFinalSetLength())
  } else {
    randomSetWords = _getRandomSetWords(set,setLength)
  }
  _updateWord()
  // save the change
  var updatedStorageData : StorageData = await _getStorageData("storageData");
  (updatedStorageData as any).vocabListSet[currentVocabList.value] = 0
  setStoragedata("storageData",updatedStorageData);
}

// Helper Functions =========================================
async function _setupNextSet() {
  // set up the set
  english.value.show = false
  set = set+1
  // console.log("current set: "+set)
  currentWord = 0
  if (_atFinalSet()) {
    randomSetWords = _getRandomSetWords(set,_getFinalSetLength())
  } else {
    randomSetWords = _getRandomSetWords(set,setLength)
  }
  _updateWord()
  // save the change of set
  var updatedStorageData : StorageData = await _getStorageData("storageData");
  (updatedStorageData as any).vocabListSet[currentVocabList.value] = set
  setStoragedata("storageData",updatedStorageData);
}

function _getRandomSetWords(set : number,setLengthLocal : number) {
  // console.log("getRandomSet inputs, set: "+set+" setlength: "+setLengthLocal)
  //Create an array with all numbers
  let randomSetWords = Array(setLengthLocal)
  for (let i = 0; i < setLengthLocal; i++) {
    randomSetWords[i] = (set*setLength)+i
  }
  //Randomize array positions
  for (let i = 0; i < setLengthLocal; i++) {
    let randomIndex = Math.floor(Math.random()*setLengthLocal)
    let swappedValue = randomSetWords[randomIndex]
    randomSetWords[randomIndex] = randomSetWords[i]
    randomSetWords[i] = swappedValue
  }
  // console.log("randomSet: "+randomSetWords)
  return randomSetWords
}

function _atFinalSet() {
  return ((set+1)*setLength) >= (vocab as any)[currentVocabList.value].length
}

function _getFinalSetLength() {
  return (vocab as any)[currentVocabList.value].length - (set*setLength)
}

function _getNextWord() {
  _resetFlashcard()
  if (_atEndOfSet() && !_atEndOfVocabList()) {
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
  showWordComponents = true
  showEndOfVocabList.value = false
}
function _hideFlashcard() {
  showWordComponents = false
}
function _atEndOfSet() {
  return currentWord+1 === setLength
}
function _atEndOfVocabList() {
  return (set*setLength+currentWord+1) === (vocab as any)[currentVocabList.value].length
}
</script>

<template>
  <VocabListSelector 
    :currentVocabList="currentVocabList"
    @changeVocabList="changeVocabList"
  />
  <VocabWordJapanese 
    :yomigana="yomigana" 
    :kanji="kanji"
    @click="clickJapanese()"
    v-show="showWordComponents"
  />
  <VocabWordEnglish 
    :english="english"
    @click="clickEnglish()"
    v-show="showWordComponents"
  />
  <div>
    <button class="nextSetButton" v-show="showNextSetButton" @click="clickNextSet()">Next vocab set</button>
  </div>
  <div>
    <h1 v-show="showEndOfVocabList" class="endOfVocabList">Congrats! You completed this vocab list!</h1>
  </div>
  <div> 
    <button class="resetVocabListButton" v-show="showEndOfVocabList" @click="resetVocabList()">Reset vocab list</button>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.nextSetButton {
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

.resetVocabListButton {
  background-color: hsla(160, 100%, 37%, 1);
  border: none;
  color: #181818;
  padding: 15px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 22px;
  margin: 4rem 2rem;
  cursor: pointer;
  border-radius: 8px;
}

.endOfVocabList {
  font-weight: 500;
  font-size: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: hsla(160, 100%, 37%, 1);
  padding-top: 18rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
