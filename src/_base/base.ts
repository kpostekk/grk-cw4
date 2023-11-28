import { Sketch } from "@p5-wrapper/react"
import { Image } from "p5"

// draw a rotating cube
export const sketch: Sketch = (p5) => {

  let imgA: Image;
  let imgB: Image;

  p5.setup = () => {
    p5.createCanvas(512, 512);
    p5.background('white');
    imgA = p5.createImage(512, 512);
    imgB = p5.createImage(512, 512);
    imgA.loadPixels();
    imgB.loadPixels();
    
    const d = p5.pixelDensity();
    for (let i = 0; i < 512 * 512 * 4 * d; i += 4) {
      imgA.pixels[i] = 240;
      imgA.pixels[i + 1] = 250;
      imgA.pixels[i + 2] = 240;
      imgA.pixels[i + 3] = 255;
      imgB.pixels[i]     = 240;
      imgB.pixels[i + 1] = 240;
      imgB.pixels[i + 2] = 250;
      imgB.pixels[i + 3] = 255;
    }
    imgA.updatePixels();
    imgB.updatePixels();
  }
  
  p5.draw = () => {
    if (!p5.keyIsDown(32)) { // space
      p5.image(imgA, 0, 0);
      p5.text('Image A', 10, 20);
    } else {
      p5.image(imgB, 0, 0);
      p5.text('Image B', 10, 20);
    }
  }
}

export const label = "base"
