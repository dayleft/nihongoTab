<script setup lang="ts">
import { ref } from 'vue'
import vocab from './../assets/japanese-vocab.json'

const props = defineProps<{
  vocabList: String,
  currentWord: Number,
  showEnglish: Boolean
  //vocabPack - which set of 20 words are you learning?
}>()

const english = ref(((vocab as any)[props.vocabList as any][props.currentWord as any]).english)
</script>

<template>
  <div class="word">
    <h3 :class="{ invisible: true}">spacing</h3>
    <h1 v-show="showEnglish" class="green">{{ english }}</h1>
  </div>
  <!-- <h1 v-show="showEnglish" class="green">{{ english }}</h1> -->
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
</style>
