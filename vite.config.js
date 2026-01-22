import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import pageReload from 'vite-plugin-page-reload'
import cleanup from '@by-association-only/vite-plugin-shopify-clean'
import { resolve } from 'node:path'

export default defineConfig({
  publicDir: 'public',
  resolve: {
    alias: {
      '@@': resolve('resources/js'),
      '@sectionStyles': resolve('frontend/styles/sections'),
      '@snippetStyles': resolve('frontend/styles/snippets'),
    }
  },
  plugins: [
    cleanup(),
    shopify({
      tunnel: 'https://maxdev.ngrok.app:5173',
      //tunnel: process.env.TUNNEL_URL, // https://maxdev.ngrok.app:5173 npm run
      snippetFile: 'vite.liquid',
      additionalEntrypoints: [
        'frontend/theme.js', // relative to sourceCodeDir
        'frontend/theme.scss',
        'frontend/styles/**/*.scss',
        'resources/**/*.js', // relative to themeRoot
      ],
      disableManifest: true
    }),
    pageReload('/tmp/theme.update', {
      delay: 2000
    })
  ],
  server: {
    cors: {
      origin: [
        /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/,
        'https://7f1ae8-3.myshopify.com',
        'https://chelseababy.com'
      ],
    },
  },
  build: {
    sourcemap: false,
    cssMinify: 'lightningcss',
    manifest: false
  }
})