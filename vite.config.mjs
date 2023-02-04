
import { resolve } from 'path'
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite'

const pkg = require('./package.json');

const ignore = Object.keys(pkg.dependencies)
ignore.push(...Object.keys(pkg.devDependencies))
ignore.push('path','fs-extra','fs')

export default defineConfig( {



    plugins: [dts()],

    build: {

     rollupOptions: {

     external: ignore,

    },


    lib: {
   // Could also be a dictionary or array of multiple entry points
   entry: resolve(__dirname, 'src/index.ts'),
   name: 'routes_generator',
   formats: ['es', 'cjs'],
   fileName: 'routes_generator',
   },

    target: "node14",
   },



  }
  )