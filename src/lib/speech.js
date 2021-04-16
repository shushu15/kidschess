/*
This code originated with Steven Estrella of ShearSpire Media. Please retain this comment if you fork this pen. The original pen can be found at:
https://codepen.io/sgestrella/pen/QodzgY
*/

// let langs = ["en","es","ru"];

 let allVoices /*, currentVoice  , allLanguages, primaryLanguages /*, langtags , langhash,  langcodehash */ ;
// let lang = 'en';
// let txtFld, rateFld, speakBtn, speakerMenu, languageMenu, blurbs;
//let voiceIndex = 0;
// let speakerInd =0;
let speedRatio = 1.0; // 0.8;
// let initialSetup = true;
// let defaultBlurb = "I enjoy the traditional music of my native country.";

export function init(){

  if (!window.speechSynthesis)
    return false;
  const allVoicesObtained = new Promise(function(resolve) {
  allVoices = window.speechSynthesis.getVoices();
  if (allVoices.length !== 0) {
      resolve(allVoices);
    } else {
      window.speechSynthesis.addEventListener("voiceschanged", function() {
        allVoices = window.speechSynthesis.getVoices();
        resolve(allVoices);
      });
    }
  });
  
  allVoicesObtained.then(allVoices => console.log("All voices:", allVoices));
  return true;
  /*
  let ret = true;
  
  if (window.speechSynthesis) {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      //Chrome gets the voices asynchronously so this is needed
      speechSynthesis.onvoiceschanged = setUpVoices;
    }
    setUpVoices(); //for all the other browsers
  }else{
    ret = false;
  }
  return ret;
  */
}

/*
function setUpVoices(){
  allVoices = speechSynthesis.getVoices(); // getAllVoices();
  selectLanguage();
}
*/

export function talk(text, lang){
  let u = new SpeechSynthesisUtterance();
  u.voice = voiceLanguage(lang);
  u.lang = u.voice.lang;
  u.text = text;
  u.rate = Number(speedRatio);
  speechSynthesis.speak(u);
}


function filterVoices(langcode){
  // let langcode = languageMenu.value;
  let voices = allVoices.filter(function (voice) {
    return langcode === "all" ? true : voice.lang.indexOf(langcode + "-") >= 0;
  });
 return voices;
}

function voiceLanguage(lang){
  let voices = filterVoices(lang);
  return  voices.length > 0? voices[0]: null;
}

/*
export function preferredLanguage(langcode) {
  lang = langcode;
}
*/
/*
export function selectLanguage(){
  let voices = filterVoices(lang);
  currentVoice = voices.length > 0? voices[0]: null;
  // return currentVoice;
}
*/


/*
function getAllVoices() {
  let voicesall = speechSynthesis.getVoices();
  let vuris = [];
  let voices = [];
  //unfortunately we have to check for duplicates
  voicesall.forEach(function(obj){
    let uri = obj.voiceURI;
    if (!vuris.includes(uri)){
        vuris.push(uri);
        voices.push(obj);
        console.log(`voice: ${JSON.stringify(obj)}`);
     }
  });
  voices.forEach(function(obj,index){obj.id = index;});
  return voices;
}
*/
