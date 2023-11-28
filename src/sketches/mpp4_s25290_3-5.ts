import { Sketch } from "@p5-wrapper/react"
import { Image } from "p5"

// draw a rotating cube
export const sketch: Sketch = (p5) => {
  let imgA: Image
  let imgB: Image

  type Vector = readonly [number, number, number]
  type Matrix = readonly [Vector, Vector, Vector]

  const makeVector = (x: number, y: number) => {
    return [x, y, 1] satisfies Vector
  }

  const drawVector = (image: Image, vec: Vector) => {
    image.set(vec[0], vec[1], p5.color(0, 0, 0, 255))
    image.updatePixels()
  }

  const makeIdentity = () => {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ] satisfies Matrix
  }

  const makeTranslation = (tx: number, ty: number) => {
    return [
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1],
    ] satisfies Matrix
  }

  const makeScale = (sx: number, sy: number) => {
    return [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1],
    ] satisfies Matrix
  }

  const makeRotation = (angle: number) => {
    const rad = p5.radians(angle)
    return [
      [p5.cos(rad), -p5.sin(rad), 0],
      [p5.sin(rad), p5.cos(rad), 0],
      [0, 0, 1],
    ] satisfies Matrix
  }

  const makeShear = (shx: number, shy: number) => {
    return [
      [1, shx, 0],
      [shy, 1, 0],
      [0, 0, 1],
    ] satisfies Matrix
  }

  p5.mouseDragged = () => {
    const vec = makeVector(p5.mouseX, p5.mouseY)
    drawVector(imgA, vec)
  }

  p5.setup = () => {
    p5.createCanvas(512, 512)
    p5.background("white")
    imgA = p5.createImage(512, 512)
    imgB = p5.createImage(512, 512)
    imgA.loadPixels()
    imgB.loadPixels()

    const d = p5.pixelDensity()
    for (let i = 0; i < 512 * 512 * 4 * d; i += 4) {
      imgA.pixels[i] = 240
      imgA.pixels[i + 1] = 250
      imgA.pixels[i + 2] = 240
      imgA.pixels[i + 3] = 255
      imgB.pixels[i] = 240
      imgB.pixels[i + 1] = 240
      imgB.pixels[i + 2] = 250
      imgB.pixels[i + 3] = 255
    }
    imgA.updatePixels()
    imgB.updatePixels()

    // Weryfikacja macierzy transformacji
    console.log({
      makeVector: makeVector(21, 37),
      makeIdentity: makeIdentity(),
      makeTranslation: makeTranslation(73, 21),
      makeScale: makeScale(3, 5),
      makeRotation: makeRotation(60),
      makeShear: makeShear(1, 0),
    })
  }

  p5.draw = () => {
    // space pressed
    if (!p5.keyIsDown(32)) {
      p5.image(imgA, 0, 0)
      p5.text("Image A", 10, 20)
    } else {
      p5.image(imgB, 0, 0)
      p5.text("Image B", 10, 20)
    }
  }
}

export const label = "Zadanie 3-5"
