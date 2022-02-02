// Tecken översättetaren täcker
var conversions = {
  a: ".- ",
  b: "-... ",
  c: "-.-. ",
  d: "-.. ",
  e: ". ",
  f: "..-. ",
  g: "--. ",
  h: ".... ",
  i: ".. ",
  j: ".--- ",
  k: "-.- ",
  l: ".-.. ",
  m: "-- ",
  n: "-. ",
  o: "--- ",
  p: ".--. ",
  q: "--.- ",
  r: ".-. ",
  s: "... ",
  t: "- ",
  u: "..- ",
  v: "...- ",
  w: ".-- ",
  x: "-..- ",
  y: "-.-- ",
  z: "--.. ",
  å: "- --- --- - ---",
  ä: "- --- - ---",
  ö: "--- --- --- -",
  "1": ".---- ",
  "2": "..--- ",
  "3": "...-- ",
  "4": "....- ",
  "5": "..... ",
  "6": "-.... ",
  "7": "--... ",
  "8": "---.. ",
  "9": "----. ",
  "0": "----- ",
  ".": ".-.-.- ",
  ",": "--..-- ",
  "?": "..--.. ",
  "'": ".----. ",
  "!": "-.-.-- ",
  "/": "-..-. ",
  "(": "-.--. ",
  ")": "-.--.- ",
  "&": ".-... ",
  ":": "---... ",
  ";": "-.-.-. ",
  "=": "-...- ",
  "+": ".-.-. ",
  "-": "-....- ",
  _: "..--.- ",
  '"': ".-..-. ",
  $: "...-..- ",
  "@": ".--.-. ",
  " ": "/ "
};
var context = new (window.AudioContext || window.webkitAudioContext)();
var oscillator = context.createOscillator();
var dotDuration = 0.08; // Tid för varhe bip

// Conversion
$("input").on("keyup", function() {
  var input = $(this).val(); // tar det du skriver in på i Input
  var output = ""; // Sparar konverterad text

  if (input == "") {
    $("#output").text("...och din text kommer komma här!"); // Default text, återgår när det andra tagit borts
    return false;
  }

  for (var i = 0; i < input.length; i++) {
    output += conversions[input[i].toLowerCase()]; // Letar genom arrayen och lägger till värdet på output (gör texten liten för att arrayen är i små bokstäver)
  }                                               

  $("#output").text(output); // sätter texten till outputen
});

// Spela tillbaka ljudet
$("#play-btn").click(function() {
  var time = context.currentTime; // Sätter en timeline på 0, detta för att  

  // Skapa oscillator, konfigurera vågrörelsen(Hz) 
  var oscillator = context.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = 600;

  // creates a volume controller. The sine wave is played continuously as one long sound,
  // and the volume is modulated to create a beeping effect
  var gainNode = context.createGain();    
  gainNode.gain.setValueAtTime(0, time); // volume: 0 is off, 1 is full, decimal values in between

  $("#output")
    .text()
    .split("") // reads the output field after the conversion has been done, and splits it into characters
    .forEach(function(letter) {
      if (letter == ".") { // decides what type of character each one is
        gainNode.gain.setValueAtTime(1, time); // sets volume to full
        time += dotDuration; // lets a period of time passby. Since this is a dot, it just does dotDuration once
        gainNode.gain.setValueAtTime(0, time); // turns the beep back off by setting the volume to 0
        time += dotDuration; // A space between each beep so they don't blend together into one
      } else if (letter == "-") {
        gainNode.gain.setValueAtTime(1, time);
        time += dotDuration * 3; // In morse, a dash is 3 times the duration of a dot
        gainNode.gain.setValueAtTime(0, time);
        time += dotDuration;
      } else {
        time += dotDuration * 7; // "else" is assumed to be a space between each morse letter, adding some time to show that the sequence is finished
                                 // when a space (forward slash) is detected, it goes quiet for a total of 21 dotDurations (space, slash, space), adding spacing between individual words as well
      }
    });

  // initialising the oscillator and volume controller
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  return false;
});
