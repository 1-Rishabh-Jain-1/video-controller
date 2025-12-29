import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        "react-ui": resolve(__dirname, "src/ui/VideoWidget.jsx")
      },
      output: {
        entryFileNames: "react-ui.js"
      },
    }
  }
})