$("#upload").submit(function(event) {

  var formData = new FormData();
  console.log("client image upload")
  formData.append("photo", $('[name="file"]')[0].files[0]);
  event.stopPropagation();
  event.preventDefault();
  $.ajax({
    url: $(this).attr("action"),
    data: formData,
    processData: false,
    contentType: false,
    type: 'POST',
    success: function(data) {
      alert(data);
    }
  });
  return false;
});



var textarea = document.getElementById("chattext");
try {
  textarea.addEventListener("keydown", keyPress, false);
} catch (e) {
  textarea.attachEvent("onkeydown", keyPress);
}

function keyPress(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    var conversation = document.getElementById('chattext').value;
    messageContainer.innerHTML += `<div class="user">User:${conversation} <div id="datetime11"></div> </div>`;
    data = "Bot is typing...";
    messageContainer.innerHTML += `<div><img src="bot.png"></img><div class="bot"> ${data}</div></div>`;
    document.getElementById("datetime11").innerHTML = dt.toLocaleTimeString();
    location.href = '#edge'
    setTimeout(function(){
      getResponse (conversation);
    }, 1000);
    document.getElementById('chattext').value = "";
    document.getElementById('chattext').focus();
    //$("#chattext").focus();
    //console.log("click check ----"+ $("#chattext").click());
    //$("chattext").click();
    //document.getElementById('chatarea').click();
    //return false;
  } else {
    return;
  }
}

function ReplaceContentInContainer(botclass,content) {
  var container = document.getElementsByClassName(botclass);
  var last  = container[container.length -1];
  //var last = document.querySelector(id+":last-child");
  console.log("continer check:",last)
  last.innerHTML = content;
}

// (function() {
//       var txt = document.getElementById('chattext');
//       txt.addEventListener('keypress', function(event) {
//       if (event.keyCode == 13) {
//           var conversation = document.getElementById('chattext').value;
//           messageContainer.innerHTML += `<div class="user">User:${conversation} <div id="datetime11"></div> </div>`;
//           document.getElementById("datetime11").innerHTML = dt.toLocaleTimeString();
//           location.href = '#edge'
//           getResponse (conversation);
//           conversation = ''
//           }
//       });
//   }());


const messageContainer = document.querySelector('.messages')
var dt = new Date();
//document.getElementById("datetime").innerHTML = dt.toLocaleTimeString();
var langs =
[['Afrikaans',       ['af-ZA']],
['Bahasa Indonesia',['id-ID']],
['Bahasa Melayu',   ['ms-MY']],
['Català',          ['ca-ES']],
['Čeština',         ['cs-CZ']],
['Deutsch',         ['de-DE']],
['English',         ['en-AU', 'Australia'],
['en-CA', 'Canada'],
['en-IN', 'India'],
['en-NZ', 'New Zealand'],
['en-ZA', 'South Africa'],
['en-GB', 'United Kingdom'],
['en-US', 'United States']],
['Español',         ['es-AR', 'Argentina'],
['es-BO', 'Bolivia'],
['es-CL', 'Chile'],
['es-CO', 'Colombia'],
['es-CR', 'Costa Rica'],
['es-EC', 'Ecuador'],
['es-SV', 'El Salvador'],
['es-ES', 'España'],
['es-US', 'Estados Unidos'],
['es-GT', 'Guatemala'],
['es-HN', 'Honduras'],
['es-MX', 'México'],
['es-NI', 'Nicaragua'],
['es-PA', 'Panamá'],
['es-PY', 'Paraguay'],
['es-PE', 'Perú'],
['es-PR', 'Puerto Rico'],
['es-DO', 'República Dominicana'],
['es-UY', 'Uruguay'],
['es-VE', 'Venezuela']],
['Euskara',         ['eu-ES']],
['Français',        ['fr-FR']],
['Galego',          ['gl-ES']],
['Hrvatski',        ['hr_HR']],
['IsiZulu',         ['zu-ZA']],
['Íslenska',        ['is-IS']],
['Italiano',        ['it-IT', 'Italia'],
['it-CH', 'Svizzera']],
['Magyar',          ['hu-HU']],
['Nederlands',      ['nl-NL']],
['Norsk bokmål',    ['nb-NO']],
['Polski',          ['pl-PL']],
['Português',       ['pt-BR', 'Brasil'],
['pt-PT', 'Portugal']],
['Română',          ['ro-RO']],
['Slovenčina',      ['sk-SK']],
['Suomi',           ['fi-FI']],
['Svenska',         ['sv-SE']],
['Türkçe',          ['tr-TR']],
['български',       ['bg-BG']],
['Pусский',         ['ru-RU']],
['Српски',          ['sr-RS']],
['한국어',            ['ko-KR']],
['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
['cmn-Hans-HK', '普通话 (香港)'],
['cmn-Hant-TW', '中文 (台灣)'],
['yue-Hant-HK', '粵語 (香港)']],
['日本語',           ['ja-JP']],
['Lingua latīna',   ['la']]];

// for (var i = 0; i < langs.length; i++) {
//   select_language.options[i] = new Option(langs[i][0], i);
// }
// select_language.selectedIndex = 6;
// updateCountry();
// select_dialect.selectedIndex = 6;
showInfo('info_start');

// function updateCountry() {
//   for (var i = select_dialect.options.length - 1; i >= 0; i--) {
//     select_dialect.remove(i);
//   }
//   var list = langs[select_language.selectedIndex];
//   for (var i = 1; i < list.length; i++) {
//     select_dialect.options.add(new Option(list[i][1], list[i][0]));
//   }
//   select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
// }

var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var synth = window.speechSynthesis
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
    start_img.src = 'mic-animate.gif';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = 'mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'mic.gif';
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
    if (create_email) {
      create_email = false;
      createEmail();
    }
  };
  var reply = text => {
    const utter = new SpeechSynthesisUtterance(text)
    const voices = speechSynthesis.getVoices()
    //utter.voice = voices[10]
    synth.speak(utter)
  }

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    res = event.results[0].isFinal;
    console.log("start time:"+start_timestamp);
    final_transcript = capitalize(final_transcript);

    //final_span.innerHTML = "USER:"+linebreak(final_transcript)+"<br />";
    //interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');

    }
    if (res == true && final_transcript!='') {
      console.log("Time up");
      messageContainer.innerHTML += `<div class="user">User:${final_transcript} <div id="datetime11"></div> </div>`;
      document.getElementById("datetime11").innerHTML = dt.toLocaleTimeString();
      location.href = '#edge'
      data = "Bot is typing...";
      messageContainer.innerHTML += `<div><img src="bot.png"></img><div class="bot"> ${data}</div></div>`;
      //chatBotResponse.innerHTML = "Bot: "+ getResponse (final_transcript);
      setTimeout(function(){
        getResponse (final_transcript);
      }, 1000);
      final_transcript = ''
    }
    //start_timestamp = event.timeStamp;
    return;
  };
}
function getResponse1(input){
  console.log("from ajax call:"+input);
  $.post('/startChat',{
    "email": "aayushku@buffalo.edu",
    "message": input
  }).done(function(data){
    console.log(data);
    BootstrapDialog.alert(data);
  }).fail(function(xhr, status, error) {
    console.log(xhr);
  });
}

function getResponse(input){
  console.log("from ajax call:"+input);
  $.ajax({
    type: "POST",
    cache: false,
    timeout: 5000,
    headers: "Access-Control-Allow-Origin: *", // enable cors
    data: {"email": "aayushku@buffalo.edu",
    "message": input},
    //url: "http://localhost:7000/startChat",
    //url: "http://192.168.1.156:7000/startChat",
    url: "http://127.0.0.1:7000/startChat",
  }).done(function(data){
    console.log("Reply from ChatBot:"+data);
    //reply(data)
    //messageContainer.innerHTML += `<div><img src="bot.png"></img><div class="bot"> ${data}</div></div>`;
    //document.getElementsByClassName("bot").innerHTML = data;
    ReplaceContentInContainer('bot',data);
    location.href = '#edge'
    //BootstrapDialog.alert(data);
    //return data
  }).fail(function(xhr, status, error) {
    console.log(xhr);
  });
}

function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function createEmail() {
  var n = final_transcript.indexOf('\n');
  if (n < 0 || n >= 80) {
    n = 40 + final_transcript.substring(40).indexOf(' ');
  }
  var subject = encodeURI(final_transcript.substring(0, n));
  var body = encodeURI(final_transcript.substring(n + 1));
  window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
}

function copyButton() {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  copy_button.style.display = 'none';
  copy_info.style.display = 'inline-block';
  showInfo('');
}

function emailButton() {
  if (recognizing) {
    create_email = true;
    recognizing = false;
    recognition.stop();
  } else {
    createEmail();
  }
  email_button.style.display = 'none';
  email_info.style.display = 'inline-block';
  showInfo('');
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  // recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'mic-slash.gif';
  showInfo('info_allow');
  showButtons('none');
  start_timestamp = event.timeStamp;
}

function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}

var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
  copy_button.style.display = 'none';
  email_button.style.display = 'none';
  copy_info.style.display = 'none';
  email_info.style.display = 'none';
}
