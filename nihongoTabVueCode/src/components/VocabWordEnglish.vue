<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  currentVocabList: String,
  currentWord: Number,
  vocab: object,
  showEnglish: Boolean
}>()
</script>

<template>
  <div class="word" @click="$emit('clickEnglish')">
    <h3 :class="{ invisible: true}">spacing</h3>
    <h1 v-show="showEnglish" class="green">{{ (vocab as any)[props.currentVocabList as any][props.currentWord as any].english }}</h1>
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
</style>
