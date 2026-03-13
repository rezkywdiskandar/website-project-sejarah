import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    root: './',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                era3g: resolve(__dirname, 'era-3g.html'),
                voc: resolve(__dirname, 'voc.html'),
                kolonial: resolve(__dirname, 'kolonial.html'),
                galeri: resolve(__dirname, 'galeri.html'),
                tim: resolve(__dirname, 'tim.html'),
            }
        }
    },
    server: {
        port: 3000,
        open: true
    }
})
