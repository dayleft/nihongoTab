<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  currentVocabList: string,
  currentWord: Number,
  vocab: object,
  showYomigana: Boolean,
  showKanji: Boolean
}>()

// let vocabWord = vocab[props.vocabList][props.currentWord]
//const kanji = ref((vocab as any)[props.currentVocabList][props.currentWord as any].kanji)
//const yomigana = ref((vocab as any)[props.currentVocabList][props.currentWord as any].hiragana)
</script>

<template>
  <div class="word" @click="$emit('clickJapanese')">
    <h3 :class="{ invisible: !showYomigana}">{{ (vocab as any)[currentVocabList][currentWord as any].hiragana }}</h3>
    <!-- <h3 v-show="showYomigana">{{ yomigana }}</h3> -->
    
    <h1 v-show="showKanji" class="green">{{ (vocab as any)[currentVocabList][currentWord as any].kanji }}</h1>
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
