<script setup lang="ts">
interface Word {
  text : string
  show : boolean
}
const props = defineProps<{
  yomigana: Word,
  kanji: Word
}>()
</script>

<template>
  <div class="wordbox">
    <h3 class="wordYomigana" :class="{ invisible: !yomigana.show}">{{ yomigana.text }}</h3>    
    <h1 v-show="kanji.show" class="wordKanji">{{ kanji.text }}</h1>
  </div>
</template>

<style scoped>
.wordKanji {
  font-weight: 500;
  font-size: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: hsla(160, 100%, 37%, 1);
}

.wordYomigana {
  font-size: 2.0rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: hsla(160, 100%, 37%, 1)
}

.invisible {
    visibility: hidden;
}

.wordbox {
  padding-top: 6rem;
  padding-bottom: 2.5rem;
  width: 80vw;
}
</style>
