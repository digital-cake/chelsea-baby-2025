import { defineConfig, loadEnv } from 'vite'
import shopify from 'vite-plugin-shopify'
import pageReload from 'vite-plugin-page-reload'
import cleanup from '@by-association-only/vite-plugin-shopify-clean'
import { resolve } from 'node:path'
import { shopifyR2Plugin } from './plugins/cake-css-hostage-vite-plugin';

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');

  return {
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
        tunnel: 'https://precontinental-nonsyllogistically-shira.ngrok-free.dev:5173',
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
      env.CLOUDFLARE_ACCOUNT_ID && shopifyR2Plugin({
        accountId:
          env.CLOUDFLARE_ACCOUNT_ID,
        accessKeyId:
          env.R2_ACCESS_KEY_ID,
        secretAccessKey:
          env.R2_SECRET_ACCESS_KEY,
        bucket:
          env.R2_BUCKET,
        disabled: env.CLIENT_PAID === 'true',
        publicUrl:
          'https://pub-3f25ec735d88429dadec980c944fda63.r2.dev',
        prefix:
          'chelsea-baby',
        liquidFile:
          './snippets/vite.liquid',
        assetsDir:
          './assets',
        entrypoints: [
          '/frontend/entrypoints/theme.scss',
        ],
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
  }

})