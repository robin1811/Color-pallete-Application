// selectors

const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
let initialColors;

// Event Listners

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
    div.addEventListener("change",()=>{
        updateTextUI(index);
    })
})

// functions

// color Generator
// function generateHex(){
//     const letter = "0123456789ABCDEF";
//     let hash = "#";
//     for(let i=0; i<6; i++){
//         hash += letter[Math.floor(Math.random() * 16)]
//     }
//     return hash;
// }

// random logic
// let str = "Kunwar Kuljeet Singh";
// let myStr = "";
// for(let i=0; i<str.length; i=i+2){
//      myStr = str[i];
//      console.log(myStr);
// }
function generateHex() {
  let hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
    initialColors = [];
  colorDivs.forEach((div, index) => {
    // console.log(div);
    let hexText = div.children[0];
    // console.log(hexText);
    let randomColor = generateHex();
    // add it to array
    // console.log(randomColor.hex());
    initialColors.push(randomColor.hex());

    // Adding color to background
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    // fixing the color of h2 according to bg color luminance(black and white heading)
    checkTextContrast(randomColor, hexText);

    // iniitialize colorize silders
    let color = chroma(randomColor);
    let sliders = div.querySelectorAll(".sliders input");
    let hue = sliders[0];
    let brightness = sliders[1];
    let saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
  });
    // reset Inputs for the sliders
    resetInputs();

}

function checkTextContrast(color, text) {
  let luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  // scaling saturation
  let noSat = color.set("hsl.s", 0);
  let fullSat = color.set("hsl.s", 1);
  let scaleSat = chroma.scale([noSat, color, fullSat]);
  // scale Brightness
  let midBright = color.set("hsl.l", 0.5);
  let scaleBright = chroma.scale(["black", midBright, "white"]);
  // scale hue

  //Update input colors
  saturation.style.background = `linear-gradient(to right, ${scaleSat(0)} , ${scaleSat(1)})`;
  brightness.style.background = `linear-gradient(to right, ${scaleBright(0)} ,${scaleBright(0.5)} , ${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function hslControls(e) {
  //   console.log(e.target.parentElement);
  let index =  e.target.getAttribute("data-bright") || e.target.getAttribute("data-sat") || e.target.getAttribute("data-hue");
  //   console.log(index);
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  
  let hue = sliders[0];
  let brightness = sliders[1];
  let saturation = sliders[2];
//   console.log(hue);


  let bgColor = initialColors[index];
    console.log(bgColor);
  let color = chroma(bgColor)
//   console.log(color);
  .set("hsl.s", saturation.value)
  .set("hsl.l", brightness.value)
  .set("hsl.h", hue.value);

    colorDivs[index].style.backgroundColor = color;

    // colorizr inputs/sliders
    colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUI(index){
    let activeDiv = colorDivs[index];
    // console.log(activeDiv.style.backgroundColor);
    let color = chroma(activeDiv.style.backgroundColor);
    // console.log(color);
    let textHex = activeDiv.querySelector("h2");
    // console.log(color,textHex)
    let icons = activeDiv.querySelectorAll(".controls button");
    textHex.innerText = color.hex();
    // console.log(textHex.innerText);
    
    //Check Contrast(black or white color of h2)
     checkTextContrast(color, textHex);
     for(icon of icons){
        checkTextContrast(color, icon);
     }

}

function resetInputs(){
    let sliders = document.querySelectorAll(".sliders input");
    sliders.forEach(slider => {
        // console.log("reset input " , slider)
        if(slider.name == "hue"){
            let hueColor = initialColors[slider.getAttribute("data-hue")];
            // console.log("get attribute " ,slider.getAttribute("data-hue"));
            // console.log("dot 2" , slider.getAttribute("name"))
            // console.log("dot " ,slider.data-hue);
            let hueValue = chroma(hueColor).hsl()[0]; //chroma functions
            slider.value = Math.floor(hueValue);
        }
        if(slider.name == "brightness"){
            let brightness = initialColors[slider.getAttribute("data-bright")];
            let brightnessValue = chroma(brightness).hsl()[2];
            slider.value = Math.floor(brightnessValue *100)/100;

        }
        if(slider.name == "saturation"){
            let saturation = initialColors[slider.getAttribute("data-sat")];
            let saturationValue = chroma(saturation).hsl()[1];
            slider.value = Math.floor(saturationValue *100)/100;

        }
    })
}

randomColors();
