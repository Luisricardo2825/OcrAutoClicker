const Tesseract = require("tesseract.js");
const robot = require("robotjs");
const { keyboard, Key } = require("@nut-tree/nut-js");
keyboard.config.autoDelayMs = 0;

const Jimp = require("jimp");

async function main() {
  //

  const worker = await Tesseract.createWorker();
  const screen = robot.screen;
  let size = 50;
  var rimg = screen.capture(940, 470, size, size);

  // Create a new blank image, same size as Robotjs' one
  let jimg = new Jimp(size, size);
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      // hex is a string, rrggbb format
      var hex = rimg.colorAt(x, y);
      // Jimp expects an Int, with RGBA data,
      // so add FF as 'full opaque' to RGB color
      var num = parseInt(hex + "ff", 16);
      // Set pixel manually
      jimg.setPixelColor(num, x, y);
    }
  }
  jimg.grayscale();
  jimg.getBuffer(Jimp.MIME_PNG, async (err, buffer) => {
    if (err) throw err;
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    let {
      data: { text, confidence },
    } = await worker.recognize(buffer);
    const delta = 0;
    let escolhido = "";
    const conf = confidence >= delta;
    if (text.toLowerCase().includes("w") && conf) {
      keyboard.pressKey(Key.W);
      keyboard.releaseKey(Key.W);
      escolhido = "w";
    } else if (text.toLowerCase().includes("a") && conf) {
      keyboard.pressKey(Key.A);
      keyboard.releaseKey(Key.A);
      escolhido = "a";
    } else if (text.toLowerCase().includes("s") && conf) {
      keyboard.pressKey(Key.S);
      keyboard.releaseKey(Key.S);
      escolhido = "s";
    } else if (text.toLowerCase().includes("d") && conf) {
      keyboard.pressKey(Key.D);
      keyboard.releaseKey(Key.D);
      escolhido = "d";
    } else {
      keyboard.pressKey(Key.K);
      keyboard.releaseKey(Key.K);
      escolhido = "K";
    }

    console.log("Caracter escolhido: ", escolhido);
    console.log("Confidence: ", confidence);
    console.log("Texto: ", text);
    worker.terminate();
    main();
  });
}

main();
