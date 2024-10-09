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
  <div class="word">
    <h3 :class="{ invisible: !yomigana.show}">{{ yomigana.text }}</h3>
    <!-- <h3 v-show="showYomigana">{{ yomigana }}</h3> -->
    
    <h1 v-show="kanji.show" class="green">{{ kanji.text }}</h1>
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
