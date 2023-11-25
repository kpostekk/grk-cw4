import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react"
import { useEffect, useState } from "react"
import { useAsync } from "react-use"

type LabeledSketch = {
  sketch: Sketch
  label?: string
}

const sketchScripts = import.meta.glob<LabeledSketch>("./sketches/*.ts")

export default function SketchLoader() {
  const { loading, value: resolvedSketches } = useAsync(async () => {
    const sketches: { sketch: Sketch; label?: string }[] = []

    for (const [path, loader] of Object.entries(sketchScripts)) {
      const { sketch, label } = await loader()

      sketches.push({ sketch, label: label ?? path })
    }

    return sketches
  })

  const [sketch, setSketch] = useState<LabeledSketch>()

  // load first sketch on mount
  useEffect(() => {
    if (!resolvedSketches) return

    const [firstSketch] = resolvedSketches

    setSketch(firstSketch)
  }, [resolvedSketches, setSketch])

  if (loading || !sketch || !resolvedSketches) return <div>Loading...</div>

  return (
    <div className="bg-slate-800 text-white">
      <div className="grid place-content-center h-screen">
        <ReactP5Wrapper sketch={sketch.sketch} />
        <p className="text-center my-4 italic">{sketch.label}</p>
        <select
          className="text-black mx-auto"
          onChange={(e) => {
            const selectedSketch = resolvedSketches.find(
              (s) => s.label === e.target.value,
            )
            setSketch(selectedSketch)
          }}
        >
          {resolvedSketches.map((s, i) => (
            <option key={s.label ?? i} value={s.label}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
