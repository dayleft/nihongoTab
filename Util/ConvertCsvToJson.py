import csv
import json
import sys

#Convert CSV version of japanese-vocab google sheet to Json (note: must have specific stricutre)
def convertCsvToJson(filename):
    #key=vocabSet name, value=list of words (words are a dict with english, hiragana, kanji)
    # ex: vocabSets["n1"]=[{"english":"hi","hiragana":"こんにちは","kanji":"今日は"},{"english":""...}]
    vocabSets = {}
    with open(filename, newline='') as csvfile:
        csvReader = csv.reader(csvfile)
        #skip header
        next(csvReader, None)
        #japanese-vocab google sheet structure
        englishColumn = 2
        hiraganaColumn = 3
        kanjiColumn = 4
        vocabSetColumn = 5
        exampleColumn = 6
        for row in csvReader:
            #define info for each row
            englishWord = str(row[englishColumn])
            if englishWord == "":
                englishWord = None
            hiraganaWord = str(row[hiraganaColumn])
            if hiraganaWord == "":
                hiraganaWord = None
            kanjiWord = str(row[kanjiColumn])
            if kanjiWord == "":
                kanjiWord = hiraganaWord
            vocabSetName = str(row[vocabSetColumn])
            if vocabSetName == "":
                vocabSetName = "No set"
            exampleSentance = str(row[exampleColumn])
            if exampleSentance == "":
                exampleSentance = None
            #debugging
            #print('en: '+str(englishWord)+' hiragana: '+str(hiraganaWord)+' kanji: '+str(kanjiWord)+' vocabSet: '+str(vocabSetName)+' ex: '+str(exampleSentance))
            #add word to the correct set
            if vocabSetName not in vocabSets:
                vocabSets[vocabSetName] = [{"english":englishWord,"hiragana":hiraganaWord,"kanji":kanjiWord,"example":exampleSentance}]
            else:
                vocabSets[vocabSetName].append({"english":englishWord,"hiragana":hiraganaWord,"kanji":kanjiWord,"example":exampleSentance})
    #create json file
    with open(filename[:-4]+'.json', 'w') as newJsonFile:
        json.dump(vocabSets, newJsonFile)

if __name__ == "__main__":
    convertCsvToJson(str(sys.argv[1]))

