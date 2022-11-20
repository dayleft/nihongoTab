import listMajors from './googleSheets.js';

function getDataFromSheets() {
  console.log(listMajors())
  return [{kanji:'秘密',yomigana:'ひみつ',english: 'secret'},{kanji:'単語',yomigana:'たんご',english: 'vocab'},{kanji:'嬉しい',yomigana:'うれしい',english: 'happy'},{kanji:'頑張る',yomigana:'がんばる',english: 'will try hard'},{kanji:'寂しい',yomigana:'さびしい',english: 'lonely'}]
}

function randomizeVocab(vocabList) {

}

const app = Vue.createApp({
  data(){
    return {
      randomizedVocab: getDataFromSheets(),
      currentWord: 0,
      offset: 0,
      pageSize: 2, //should be 20
      leftShow: false,
      rightShow: false,
      refreshShow: false,
      progressBar: 0,
      currentDay: 0, //set to a default value
    }
  },
  methods: {
    clickLeft() {
      if (this.leftShow === false) {
        this.leftShow = true
      } else if (this.leftShow === true && this.rightShow === true) {
        this._getNextWord()
      }
    },
    clickRight() {
      if (this.rightShow === false) {
        this.rightShow = true
        this._incrementProgressBar()
        if (this._atEndOfList()) {
          this.refreshShow = true
        }
      } else {
        this._getNextWord()
      }
    },
    clickRefresh() {
       this.refreshShow = false
       this.offset = this.offset+this.pageSize
       if (this.offset >= this.randomizedVocab.length) {
        console.log("you're done for today!")
       }
       else {
        this.currentWord = this.offset-1 //makes sure that we start at the beginning of the new page 
        this._getNextWord()
       }
    },
    _getNextWord() {
      this.leftShow = false
      this.rightShow = false
      if (this._atEndOfList()) {
        this.currentWord = this.offset
      } else {
        this.currentWord = (this.currentWord+1)%(this.pageSize)+this.offset
      }
      console.log("currentWord: "+this.currentWord)
    },
    _atEndOfList() {
      return (this.currentWord-this.offset+1) === this.pageSize || (this.currentWord+1) === this.randomizedVocab.length
    },
    _incrementProgressBar() {
      var currentVocabPageSize = Math.min(this.pageSize,this.randomizedVocab.length-this.offset) //+1 error potentially
      this.progressBar = Math.min(this.progressBar + (1/currentVocabPageSize),1)
      console.log("prgress bar: "+this.progressBar)
    },
    _setTodaysDate() {
      today = (new Date()).getDate()
      if (this.currentDay != today) {
        this.currentDay = today
        this.offset = 0
      }
    },
  }
})

app.mount('#app')