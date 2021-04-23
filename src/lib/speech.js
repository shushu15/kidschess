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

export function init(lang){

  if (!window.speechSynthesis) {
    // console.log(`speech init ${window.speechSynthesis}`);
    return new Promise((resolve) => resolve(false));
  }
  const allVoicesObtained = new Promise(function(resolve) {
    // allVoices = window.speechSynthesis.getVoices();
    loadAllVoices();
    if (allVoices.length !== 0) {
      resolve(allVoices);
    } else {
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        // allVoices = window.speechSynthesis.getVoices();
        loadAllVoices();
        if (allVoices.length !== 0)
          resolve(allVoices);
      });
    }
  });
  
  return allVoicesObtained.then( () => voiceLanguage(lang) !== null);
  // return true;
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

function loadAllVoices(){
  allVoices = window.speechSynthesis.getVoices(); // getAllVoices();
}

/*
function setUpVoices(){
  allVoices = speechSynthesis.getVoices(); // getAllVoices();
  selectLanguage();
}
*/
export function clear(){
  if (!window.speechSynthesis) return null;

  speechSynthesis.cancel();
}


export function talk(text, lang){
  if (!window.speechSynthesis) return null;

  let u = new SpeechSynthesisUtterance();
  u.voice = voiceLanguage(lang);
  u.lang = u.voice.lang;
  u.text = text;
  u.rate = Number(speedRatio);
  speechSynthesis.speak(u);
  /*
  u.onstart = function(event) {
    console.log('Utterance onstart: ' + event.utterance.text);
    console.log(`speechSynthesis paused ${speechSynthesis.paused}, pending ${speechSynthesis.pending}, speaking ${speechSynthesis.speking}`);
  };
  u.onpause = function(event) {
    console.log('Utterance onpause after ' + event.elapsedTime + ' milliseconds.');
    console.log(`speechSynthesis paused ${speechSynthesis.paused}, pending ${speechSynthesis.pending}, speaking ${speechSynthesis.speking}`);
  };
  u.onresume = function(event) {
      console.log('Utterance onresume after ' + event.elapsedTime + ' milliseconds.');
      console.log(`speechSynthesis paused ${speechSynthesis.paused}, pending ${speechSynthesis.pending}, speaking ${speechSynthesis.speking}`);
    };
  u.onend = function(event) {
    console.log('Utterance onend after ' + event.elapsedTime + ' milliseconds.');
    console.log(`speechSynthesis paused ${speechSynthesis.paused}, pending ${speechSynthesis.pending}, speaking ${speechSynthesis.speking}`);
  };
  u.onerror = function(event) {
    console.log('Utterance onerror: ' + event.error);
    console.log(`speechSynthesis paused ${speechSynthesis.paused}, pending ${speechSynthesis.pending}, speaking ${speechSynthesis.speking}`);
  };
  */

}


function filterVoices(langcode){
  // let langcode = languageMenu.value;
  let voices = allVoices.filter(function (voice) {
    // console.log(`Lang ${voice.lang}`);
    return voice.lang.indexOf(langcode + "-") >= 0 || voice.lang.indexOf(langcode + "_") >= 0;
  });
 return voices;
}

export function voiceLanguage(lang){
  if (!window.speechSynthesis) return null;
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
