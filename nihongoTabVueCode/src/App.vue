<script setup lang="ts">
import VocabWordJapanese from './components/VocabWordJapanese.vue'
import VocabWordEnglish from './components/VocabWordEnglish.vue'
import vocab from './assets/japanese-vocab.json'
import { ref } from 'vue'


//Global vars
const _vocabList = ref('TerraceHouse')
const _currentWord = ref(0)
const _setLength = ref(10) //should be 10-20

const _showYomigana = ref(false)
const _showKanji = ref(true)
const _showEnglish = ref(false)

const _showNextSetButton = ref(false)
const _showEndOfVocabList = ref(false)

const progressBar = ref(0)

//On click funtions
function clickJapanese() {
  if (_showYomigana.value === false) {
    _showYomigana.value = true
  } //else if (_showYomigana.value === true && _showEnglish.value === true) {
  //   _getNextWord()
  // }
}

function clickEnglish() {
  if (_showEnglish.value === false) {
    _showEnglish.value = true
    //increment progress bar
    if (_atEndOfSet() || _atEndOfVocabList()) {
      _showNextSetButton.value = true
    }
  } else {
    _getNextWord()
  }
}

function _getNextWord() {
  _showYomigana.value = false
  _showEnglish.value = false
  _showNextSetButton.value = false
  if (_atEndOfVocabList()) {
    _currentWord.value = (_currentWord.value+1) - ((vocab as any)[_vocabList.value].length % _setLength.value)
  } else if (_atEndOfSet()) {
    _currentWord.value = (_currentWord.value+1) - _setLength.value //causes bug that last set will refresh and add words if less than set length
  } else {
    _currentWord.value = _currentWord.value+1
  }
}

function _atEndOfSet() {
  return ((_currentWord.value+1) % _setLength.value) === 0 //|| (_currentWord+1) === vocab[_vocabList].length
}

function _atEndOfVocabList() {
  return (_currentWord.value+1) === (vocab as any)[_vocabList.value].length
}

function clickNextSet() {
  _showNextSetButton.value = false
  _showYomigana.value = false
  _showEnglish.value = false
  if (_atEndOfVocabList()) {
    _showYomigana.value = false
    _showKanji.value = false
    _showEnglish.value = false
    _showEndOfVocabList.value = true
  } else {
    _currentWord.value = _currentWord.value+1
  }
}
</script>

<template>
  <header>
    <div @click="clickJapanese()" class="wrapper">
      <VocabWordJapanese v-bind:vocabList="_vocabList" v-bind:currentWord="_currentWord" v-bind:showYomigana="_showYomigana" v-bind:showKanji="_showKanji" :key="_currentWord"/>
    </div>
  </header>
    <div @click="clickEnglish()">
      <VocabWordEnglish :vocabList="_vocabList" :currentWord="_currentWord" :showEnglish="_showEnglish" :key="_currentWord"/>
    </div>
    <div>
      <button class="button" v-show="_showNextSetButton" @click="clickNextSet()">Next vocab set</button>
    </div>
    <div>
      <h1 v-show="_showEndOfVocabList" class="green">Congrats! You completed this vocab list!</h1>
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
