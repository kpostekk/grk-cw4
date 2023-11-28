import { Sketch } from "@p5-wrapper/react"

// draw a rotating cube
export const sketch: Sketch = (p5) => {

  p5.setup = () => {
    p5.createCanvas(800, 600, 'webgl')
  }

  p5.draw = () => {
    p5.background(150)
    p5.rotateX(p5.frameCount * 0.03)
    p5.rotateY(p5.frameCount * 0.03)
    p5.rotateZ(p5.frameCount * 0.03)
    p5.box(100)
  }
}

export const label = "Rotating Cube"
