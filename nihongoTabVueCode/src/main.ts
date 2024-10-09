import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

console.log("before create")
const app = createApp(App)
console.log("after create")


console.log("before mount")
app.mount('#app')
console.log("after mount")
