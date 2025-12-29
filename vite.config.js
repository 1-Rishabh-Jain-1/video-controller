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
        "injectReact": resolve(__dirname, "src/injectReact.jsx")
      },
      output: {
        entryFileNames: "[name].js",
        format: "iife",
        name: "VideoControllerReact"
      },
    }
  }
})