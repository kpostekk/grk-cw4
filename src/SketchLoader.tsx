import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react"
import { useMemo, useState } from "react"
import { Image } from "p5"

type Vector = [number, number, number]
type Matrix = [Vector, Vector, Vector]

function VectorPreview(props: { vector: Vector }) {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1">
      {props.vector.map((v, i) => (
        <div key={i}>{v.toLocaleString()}</div>
      ))}
    </div>
  )
}

function MatrixPreview(props: { matrix: Matrix }) {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1">
      {props.matrix
        .flatMap((v) => v.map((v) => v))
        .map((v, i) => (
          <div key={i}>{v.toLocaleString()}</div>
        ))}
    </div>
  )
}

export default function SketchLoader() {
  const [vectorA, setVectorA] = useState<Vector>()
  const [vectorB, setVectorB] = useState<Vector>()
  const [matrixA, setMatrixA] = useState<Matrix>()
  const [matrixB, setMatrixB] = useState<Matrix>()
  const [rotation, setRotation] = useState<number>(0)
  const [translationX, setTranslationX] = useState<number>(0)
  const [translationY, setTranslationY] = useState<number>(0)
  const [scaleX, setScaleX] = useState<number>(1)
  const [scaleY, setScaleY] = useState<number>(1)
  const [shearX, setShearX] = useState<number>(0)
  const [shearY, setShearY] = useState<number>(0)

  const sketch = useMemo(() => {
    const sketch: Sketch = (p5) => {
      let imgA: Image
      let imgB: Image

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

      const multiplyMatrixVector = (matrix: Matrix, vector: Vector) => {
        const result: Vector = [0, 0, 0]
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            result[i] += matrix[i][j] * vector[j]
          }
        }
        result[2] = 1
        return result
      }

      const multiplyMatrices = (matrixA: Matrix, matrixB: Matrix) => {
        const rowsA = matrixA.length
        const colsA = matrixA[0].length
        const rowsB = matrixB.length
        const colsB = matrixB[0].length
        const result: Matrix = [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ]

        if (colsA !== rowsB) throw new Error("Cannot multiply matrices")

        for (let i = 0; i < rowsA; i++) {
          for (let j = 0; j < colsB; j++) {
            result[i][j] = 0
            for (let k = 0; k < colsA; k++) {
              result[i][j] += matrixA[i][k] * matrixB[k][j]
            }
          }
        }
        return result
      }

      p5.mouseDragged = () => {
        const vec = makeVector(p5.mouseX, p5.mouseY)
        drawVector(imgA, vec)
        setVectorA(vec)

        // Transformacje dla imgA
        const translationMatrixA = makeTranslation(translationX, translationY)
        const rotationMatrixA = makeRotation(rotation)
        const scaleMatrixA = makeScale(scaleX, scaleY)
        let combinedMatrixA = multiplyMatrices(
          translationMatrixA,
          rotationMatrixA,
        )
        combinedMatrixA = multiplyMatrices(combinedMatrixA, scaleMatrixA)
        const transformedVecA = multiplyMatrixVector(combinedMatrixA, vec)
        drawVector(imgA, transformedVecA)
        setMatrixA(combinedMatrixA)

        // Transformacje dla imgB
        const translationMatrixB = makeTranslation(translationX, translationY)
        const rotationMatrixB = makeRotation(rotation)
        const scaleMatrixB = makeScale(scaleX, scaleY)
        let combinedMatrixB = multiplyMatrices(scaleMatrixB, translationMatrixB)
        combinedMatrixB = multiplyMatrices(combinedMatrixB, rotationMatrixB)
        const transformedVecB = multiplyMatrixVector(combinedMatrixB, vec)
        drawVector(imgB, transformedVecB)
        setMatrixB(combinedMatrixB)
        setVectorB(transformedVecB)
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
          makeRotation: makeRotation(rotation),
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

    return sketch
  }, [rotation, scaleX, scaleY, translationX, translationY])

  return (
    <div className="bg-slate-800 text-white">
      <div className="grid grid-cols-2 place-items-center h-screen">
        <ReactP5Wrapper sketch={sketch} />
        <div className="w-2/3">
          <p>Vector A</p>
          {vectorA && <VectorPreview vector={vectorA} />}
          <p>Vector B</p>
          {vectorB && <VectorPreview vector={vectorB} />}
          <p>Matrix A</p>
          {matrixA && <MatrixPreview matrix={matrixA} />}
          <p>Matrix B</p>
          {matrixB && <MatrixPreview matrix={matrixB} />}
          <div>
            <p>Rotation = {rotation.toLocaleString()}</p>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
            />
          </div>
          <div>
            <p>Translation = {translationX.toLocaleString()}, {translationY.toLocaleString()}</p>
            <label>
              translationX
              <input
                type="range"
                min="-100"
                max="100"
                value={translationX}
                onChange={(e) => setTranslationX(Number(e.target.value))}
              />
            </label>
            <label>
              translationY
              <input
                type="range"
                min="-100"
                max="100"
                value={translationY}
                onChange={(e) => setTranslationY(Number(e.target.value))}
              />
            </label>
          </div>
          <div>
            <p>Scale = {scaleX.toLocaleString()}, {scaleY.toLocaleString()}</p>
            <label>
              scaleX
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={scaleX}
                onChange={(e) => setScaleX(Number(e.target.value))}
              />
            </label>
            <label>
              scaleY
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={scaleY}
                onChange={(e) => setScaleY(Number(e.target.value))}
              />
            </label>
          </div>
          <div>
            <p>Shear (not implemented yet)</p>
            <label>
              shearX
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={shearX}
                onChange={(e) => setShearX(Number(e.target.value))}
              />
            </label>
            <label>
              shearY
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={shearY}
                onChange={(e) => setShearY(Number(e.target.value))}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
