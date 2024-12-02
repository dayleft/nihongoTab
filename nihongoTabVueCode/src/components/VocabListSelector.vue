<script setup lang="ts">
const props = defineProps<{
  currentVocabList?: String,
}>()

</script>

<template>
    <div class="navbar">
        <div class="dropdown">
            <button class="dropbtn">{{ currentVocabList }} 
            </button>
            <div class="dropdown-content">
            <a href="#" @click="$emit('changeVocabList','N5')">N5 vocab</a>
            <a href="#" @click="$emit('changeVocabList','N4')">N4 vocab</a>
            <a href="#" @click="$emit('changeVocabList','N3')">N3 vocab</a>
            <a href="#" @click="$emit('changeVocabList','N2')">N2 vocab</a>
            <a href="#" @click="$emit('changeVocabList','N1')">N1 vocab</a>
            <a href="#" @click="$emit('changeVocabList','TerraceHouse')">TerraceHouse vocab [Testing]</a>
            </div>
        </div> 
    </div>
</template>

<style scoped>
.navbar {
  overflow: hidden;
  background-color: #333;
}

.navbar a {
  float: left;
  font-size: 16px;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

.dropdown {
  float: left;
  overflow: hidden;
}

.dropdown .dropbtn {
  font-size: 16px;  
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}

.navbar a:hover, .dropdown:hover .dropbtn {
  background-color: hsla(160, 100%, 37%, 1);
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: flex;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>