<script setup lang="ts">
import { ref } from 'vue'
import vocab from './../assets/japanese-vocab.json'

const props = defineProps<{
  vocabList: String,
  currentWord: Number,
  showYomigana: Boolean,
  showKanji: Boolean
  //vocabPack - which set of 20 words are you learning?
}>()

// let vocabWord = vocab[props.vocabList][props.currentWord]
const kanji = ref(vocab[props.vocabList][props.currentWord].kanji)
const yomigana = ref(vocab[props.vocabList][props.currentWord].hiragana)
</script>

<template>
  <div class="word">
    <h3 :class="{ invisible: !showYomigana}">{{ yomigana }}</h3>

    <!-- <h3 v-show="showYomigana">{{ yomigana }}</h3> -->
    <h1 v-show="showKanji" class="green">{{ kanji }}</h1>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 3.5rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 2.0rem;
}

.word h1,
.word h3 {
  text-align: center;
}

.invisible {
    visibility: hidden;
}

@media (min-width: 1024px) {
  .word h1,
  .word h3 {
    text-align: left;
  }
}
</style>
