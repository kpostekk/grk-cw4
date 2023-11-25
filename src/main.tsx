import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import SketchLoader from "./SketchLoader"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense>
      <SketchLoader />
    </Suspense>
  </React.StrictMode>,
)
