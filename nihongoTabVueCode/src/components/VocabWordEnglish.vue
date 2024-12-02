<script setup lang="ts">
interface Word {
  text : string
  show : boolean
}

const props = defineProps<{
  english: Word
}>()
</script>

<template>
  <div class="wordbox">
    <h1 v-show="english.show" class="word">{{ english.text }}</h1>
  </div>
</template>

<style scoped>
.word {
  font-weight: 500;
  font-size: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: hsla(160, 100%, 37%, 1);
}

.wordbox {
  width: 80vw;
  height: 30vh;
  border-top: 1px solid hsla(160, 100%, 37%, 1);
}
</style>
