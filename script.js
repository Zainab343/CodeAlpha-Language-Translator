"use strict";

/* ============================================================
   RELAY TRANSLATOR
   CodeAlpha Project
============================================================ */

const sourceLang=document.getElementById("sourceLang");
const targetLang=document.getElementById("targetLang");

const sourceText=document.getElementById("sourceText");
const targetText=document.getElementById("targetText");

const translateBtn=document.getElementById("translateBtn");

const swapBtn=document.getElementById("swapBtn");

const micBtn=document.getElementById("micBtn");

const speakBtn=document.getElementById("speakBtn");

const copyBtn=document.getElementById("copyBtn");

const charCount=document.getElementById("charCount");

const statusText=document.getElementById("statusText");

const historyList=document.getElementById("historyList");

const clearHistory=document.getElementById("clearHistory");

const MAX=800;

let lastTranslation="";
let history=[];

const LANGUAGES=[

["en","English"],
["ur","Urdu"],
["ar","Arabic"],
["hi","Hindi"],
["ja","Japanese"],
["ko","Korean"],
["zh-CN","Chinese"],
["fr","French"],
["de","German"],
["es","Spanish"],
["it","Italian"],
["pt","Portuguese"],
["ru","Russian"],
["tr","Turkish"],
["fa","Persian"],
["bn","Bengali"],
["pa","Punjabi"],
["nl","Dutch"],
["pl","Polish"],
["id","Indonesian"]

];

LANGUAGES.forEach(lang=>{

let a=document.createElement("option");
a.value=lang[0];
a.textContent=lang[1];

let b=a.cloneNode(true);

sourceLang.appendChild(a);

targetLang.appendChild(b);

});

sourceLang.value="en";

targetLang.value="ur";

sourceText.addEventListener("input",()=>{

charCount.textContent=`${sourceText.value.length} / ${MAX}`;

});

translateBtn.addEventListener("click",translate);

sourceText.addEventListener("keydown",e=>{

if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){

translate();

}

});

async function translate() {

    const text = sourceText.value.trim();

    if (!text) {
        statusText.textContent = "Enter text";
        return;
    }

    translateBtn.disabled = true;
    statusText.textContent = "Translating...";

    try {

        const response = await fetch(
            "https://google-translate113.p.rapidapi.com/api/v1/translator/text",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-rapidapi-host": "google-translate113.p.rapidapi.com",
                    "x-rapidapi-key": "YOUR-API-KEY"
                },
                body: JSON.stringify({
                    from: sourceLang.value || "auto",
                    to: targetLang.value,
                    text: text
                })
            }
        );

        const data = await response.json();

        console.log(data);

        // Different APIs return different field names
        lastTranslation =
            data.trans ||
            data.translation ||
            data.translatedText ||
            data.text ||
            "";

        if (!lastTranslation) {
            throw new Error("No translation returned");
        }

        targetText.textContent = lastTranslation;
        targetText.classList.remove("placeholder");

        statusText.textContent = "Done";

        saveHistory();

    } catch (err) {

        console.error(err);

        targetText.textContent = "Translation Failed";
        statusText.textContent = "Translation Failed";

    }

    translateBtn.disabled = false;
}


// =====================================================
// PART 2
// Swap • Copy • History
// =====================================================

swapBtn.addEventListener("click",()=>{

swapBtn.classList.add("spin");

setTimeout(()=>{

swapBtn.classList.remove("spin");

},250);

const tempLang=sourceLang.value;

sourceLang.value=targetLang.value;

targetLang.value=tempLang;

const tempText=sourceText.value;

sourceText.value=lastTranslation;

targetText.textContent=tempText||"Translation will appear here.";

targetText.classList.add("placeholder");

charCount.textContent=`${sourceText.value.length} / ${MAX}`;

});

copyBtn.addEventListener("click",async()=>{

if(!lastTranslation){

statusText.textContent="Nothing to copy";

return;

}

try{

await navigator.clipboard.writeText(lastTranslation);

statusText.textContent="Copied";

setTimeout(()=>{

statusText.textContent="";

},1200);

}

catch{

statusText.textContent="Copy Failed";

}

});

function saveHistory(){

if(!lastTranslation)return;

history.unshift({

from:sourceLang.value,

to:targetLang.value,

source:sourceText.value,

target:lastTranslation

});

history=history.slice(0,6);

renderHistory();

}
function renderHistory(){

if(history.length===0){

historyList.innerHTML=`
<li class="history-empty">
Nothing translated yet — your last few conversions will show up here.
</li>`;

return;

}

historyList.innerHTML="";

history.forEach(item=>{

const li=document.createElement("li");

li.className="history-item";

li.innerHTML=`

<span class="h-lang">${item.from.toUpperCase()}</span>

<span class="h-src">${item.source}</span>

<span class="h-arrow">→</span>

<span class="h-tgt">${item.target}</span>

`;

historyList.appendChild(li);

});

}

clearHistory.addEventListener("click",()=>{

history=[];

renderHistory();

});
// =====================================
// MICROPHONE
// =====================================

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(SpeechRecognition){

const recognition=new SpeechRecognition();

recognition.continuous=false;
recognition.interimResults=false;
recognition.maxAlternatives=1;

micBtn.addEventListener("click",()=>{

recognition.lang=sourceLang.value;

statusText.textContent="Listening...";

micBtn.classList.add("active");

try{

recognition.start();

}catch(err){

console.log(err);

}

});

recognition.onresult=(event)=>{

const text=event.results[0][0].transcript;

sourceText.value=text;

charCount.textContent=`${text.length} / ${MAX}`;

recognition.stop();

translate();

};

recognition.onerror=(event)=>{

console.log(event.error);

switch(event.error){

case "not-allowed":

statusText.textContent="Microphone permission denied.";

break;

case "audio-capture":

statusText.textContent="No microphone found.";

break;

case "no-speech":

statusText.textContent="No speech detected.";

break;

default:

statusText.textContent="Microphone Error.";

}

micBtn.classList.remove("active");

};

recognition.onend=()=>{

micBtn.classList.remove("active");

if(statusText.textContent==="Listening..."){

statusText.textContent="";

}

};

}else{

micBtn.disabled=true;

statusText.textContent="Speech Recognition not supported.";

}
// =======================
// SPEAKER
// =======================

function speakTranslation() {

    if (!lastTranslation) return;

    speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(lastTranslation);

    const voices = speechSynthesis.getVoices();

let voice = voices.find(v =>
    v.lang === "ja-JP" &&
    !v.name.includes("Online")
);

if (!voice) {
    voice = voices.find(v => v.lang === "ja-JP");
}

if (!voice) {
    voice = voices.find(v => v.lang.startsWith("ja"));
}

if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
}

    if (voice) {
        utter.voice = voice;
        utter.lang = voice.lang;
    }

    utter.volume = 1;
    utter.rate = 1;
    utter.pitch = 1;

    utter.onstart = () => console.log("Started");

    utter.onend = () => console.log("Finished");

    utter.onerror = (e) => console.log("Speech Error:", e);

    speechSynthesis.speak(utter);
}

speakBtn.onclick = speakTranslation;