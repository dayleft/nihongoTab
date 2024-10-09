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
  <div class="word">
    <h3 :class="{ invisible: true}">spacing</h3>
    <h1 v-show="english.show" class="green">{{ english.text }}</h1>
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
.word{
  padding: 15px;
  width: 100vw;
  height: 50vh;
  border: 1px solid green;
}
.word h1,
.word h3 {
  text-align: center;
}

.invisible {
    visibility: hidden;
  }
</style>
