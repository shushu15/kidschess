/*
This code originated with Steven Estrella of ShearSpire Media. Please retain this comment if you fork this pen. The original pen can be found at:
https://codepen.io/sgestrella/pen/QodzgY
*/
let allVoices, allLanguages, primaryLanguages, langtags /*, langhash */ , langcodehash ;
// let txtFld, rateFld, speakBtn, speakerMenu, languageMenu, blurbs;
let voiceIndex = 0;
let speakerInd =0;
let speedRatio = 0.8;
let initialSetup = true;
// let defaultBlurb = "I enjoy the traditional music of my native country.";

export function init(){
  //speakBtn = qs("#speakBtn");
  //txtFld = qs("#txtFld"); 
  //speakerMenu = qs("#speakerMenu");
  langtags = getLanguageTags();
  //speakBtn.addEventListener("click",talk,false);
  //speakerMenu.addEventListener("change",selectSpeaker,false);
  
  // createBlurbs();
  let ret = true;
  //rateFld = qs("#rateFld");
  //languageMenu = qs("#languageMenu"); 
  //languageMenu.addEventListener("change",selectLanguage,false);
  // langhash = getLookupTable(langtags,"name");
  langcodehash = getLookupTable(langtags,"code");
  
  if (window.speechSynthesis) {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      //Chrome gets the voices asynchronously so this is needed
      speechSynthesis.onvoiceschanged = setUpVoices;
    }
    setUpVoices(); //for all the other browsers
  }else{
    //speakBtn.disabled = true;
    //speakerMenu.disabled = true;
    //languageMenu.disabled = true;
    //qs("#warning").style.display = "block";
    ret = false;
  }
  return ret;
}
function setUpVoices(){
  allVoices = getAllVoices();
  allLanguages = getAllLanguages(allVoices);
  primaryLanguages = getPrimaryLanguages(allLanguages);
  filterVoices();
  if (initialSetup && allVoices.length){
    initialSetup = false;
    createLanguageMenu();
  }
}
export function talk(text){
  let sval = Number(speakerInd);
  let u = new SpeechSynthesisUtterance();
  u.voice = allVoices[sval];
  u.lang = u.voice.lang;
  u.text = text;
  u.rate = Number(speedRatio);
  speechSynthesis.speak(u);
}

function createLanguageMenu(){
  // let code = `<option selected value="all">Show All</option>`;
  let langnames = [];
  primaryLanguages.forEach(function(lobj){
    langnames.push(langcodehash[lobj.substring(0,2)].name);
  });
  langnames.sort();
  /*
  langnames.forEach(function(lname,i){
    let lcode = langhash[lname].code;
    code += `<option value=${lcode}>${lname}</option>`;
  });
  languageMenu.innerHTML = code;
  */
}

/*
function createSpeakerMenu(voices){
  let code = ``;
  voices.forEach(function(vobj,i){
    code += `<option value=${vobj.id}>${vobj.name} (${vobj.lang})`;
    code += vobj.voiceURI.includes(".premium") ? ' (premium)' : ``;
    code += `</option>`;
  });
  speakerMenu.innerHTML = code;
}
*/
function getAllLanguages(voices){
  let langs = [];
  voices.forEach(vobj => {
    langs.push(vobj.lang.trim());
  });
  return [...new Set(langs)];
}
function  getPrimaryLanguages(langlist){
  let langs = [];
  langlist.forEach(vobj => {
    langs.push(vobj.substring(0,2));
  });
  return [...new Set(langs)];
}
function selectSpeaker(){
  voiceIndex = speakerMenu.selectedIndex;
}
export function selectLanguage(langcode){
  filterVoices(langcode);
  speakerMenu.selectedIndex = 0;
}
function filterVoices(langcode){
  // let langcode = languageMenu.value;
  let voices = allVoices.filter(function (voice) {
    return langcode === "all" ? true : voice.lang.indexOf(langcode + "-") >= 0;
  });
  /*
  createSpeakerMenu(voices);
  let t = blurbs[languageMenu.options[languageMenu.selectedIndex].text];
  txtFld.value = t ? t : defaultBlurb;
  speakerMenu.selectedIndex = voiceIndex;
  */
 return voices;
}



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
     }
  });
  voices.forEach(function(obj,index){obj.id = index;});
  return voices;
}
/*
function createBlurbs(){
  blurbs = {
    "Arabic" : "أنا أستمتع بالموسيقى التقليدية لبلدي الأم.",
    "Chinese" : "我喜歡我祖國的傳統音樂。",
    "Czech" : "Mám rád tradiční hudbu mé rodné země.",
    "Danish" : "Jeg nyder den traditionelle musik i mit hjemland.",
    "Dutch" : "Ik geniet van de traditionele muziek van mijn geboorteland.",
    "English" : "I enjoy the traditional music of my native country.",
    "Finnish" : "Nautin kotimaassani perinteistä musiikkia.",
    "French" : "J'apprécie la musique traditionnelle de mon pays d'origine.",
    "German" : "Ich genieße die traditionelle Musik meiner Heimat.",
    "Greek" : "Απολαμβάνω την παραδοσιακή μουσική της πατρίδας μου.",
    "Hebrew" : "אני נהנה מהמוסיקה המסורתית של מולדתי.",
    "Hindi" : "मैं अपने मूल देश के पारंपरिक संगीत का आनंद लेता हूं।",
    "Hungarian" : "Élvezem az én hazám hagyományos zenéjét.",
    "Indonesian" : "Saya menikmati musik tradisional negara asal saya.",
    "Italian" : "Mi piace la musica tradizionale del mio paese natale.",
    "Japanese" : "私は母国の伝統音楽を楽しんでいます。",
    "Korean" : "나는 내 조국의 전통 음악을 즐긴다.",
    "Norwegian Bokmal" : "Jeg liker den tradisjonelle musikken i mitt hjemland.",
    "Polish" : "Lubię tradycyjną muzykę mojego kraju.",
    "Portuguese" : "Eu gosto da música tradicional do meu país natal.",
    "Romanian" : "Îmi place muzica tradițională din țara mea natală.",
    "Russian" : "Мне нравится традиционная музыка моей родной страны.",
    "Slovak" : "Mám rád tradičnú hudbu svojej rodnej krajiny.",
    "Spanish" : "Disfruto de la música tradicional de mi país natal.",
    "Swedish" : "Jag njuter av traditionell musik i mitt hemland.",
    "Thai" : "ฉันเพลิดเพลินกับดนตรีดั้งเดิมของประเทศบ้านเกิดของฉัน",
    "Turkish" : "Ülkemdeki geleneksel müzikten zevk alıyorum."
  };
}
*/
function getLanguageTags(){
  let langs = ["en-English","es-Spanish","ru-Russian"];
  let langobjects = [];
  for (let i=0;i<langs.length;i++){
    let langparts = langs[i].split("-");
    langobjects.push({"code":langparts[0],"name":langparts[1]});
  }
  return langobjects;
}
// Generic Utility Functions
/*
function qs(selectorText){
  //saves lots of typing for those who eschew Jquery
  return document.querySelector(selectorText);
}
*/
function getLookupTable(objectsArray,propname){
  return objectsArray.reduce((accumulator, currentValue) => (accumulator[currentValue[propname]] = currentValue, accumulator),{});
}
/*
document.addEventListener('DOMContentLoaded', function (e) {
  try {init();} catch (error){
    console.log("Data didn't load", error);}
});
*/