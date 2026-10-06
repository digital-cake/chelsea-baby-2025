import type { Plugin } from 'vite'

import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3'

import {
  readFile,
  writeFile,
} from 'node:fs/promises'

import path from 'node:path'

type ShopifyR2Options = {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  publicUrl: string
  liquidFile: string
  assetsDir: string
  entrypoints: string[]
  prefix?: string
  disabled?: boolean
}

export function shopifyR2Plugin(
  options: ShopifyR2Options,
): Plugin {
  const s3 = new S3Client({
    region: 'auto',

    endpoint:
      `https://${options.accountId}.r2.cloudflarestorage.com`,

    credentials: {
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
    },
  })

  return {
    name: 'shopify-r2-css',
    apply: 'build',
    enforce: 'post',
    closeBundle: {
      order: 'post',

      async handler() {

        if (options.disabled) return;

        const liquidPath = path.resolve(
          options.liquidFile,
        )

        let liquid = await readFile(
          liquidPath,
          'utf8',
        )

        for (const entrypoint of options.entrypoints) {
          /*
           * Find the {% if/elsif %} block which references
           * our source entrypoint.
           *
           * Example:
           *
           * {% elsif path == entrypoint.scss"
           *    or path == "theme.scss" %}
           *
           *   {{ 'theme-7n0kMnFS.css'
           *      | asset_url ...
           *   }}
           */
          const escapedEntrypoint =
            escapeRegExp(entrypoint)

          const blockRegex = new RegExp(
            `({%\\s*(?:if|elsif)[^%]*${escapedEntrypoint}[^%]*%}` +
              `[\\s\\S]*?)` +
              `({{\\s*'([^']+\\.css)'\\s*\\|\\s*asset_url[\\s\\S]*?}})`,
          )

          const match = liquid.match(blockRegex)

          if (!match) {
            console.warn(
              `[shopify-r2-css] No CSS found for ${entrypoint}`,
            )

            continue
          }

          const fullLiquidExpression = match[2]
          const cssFilename = match[3]

          const cssPath = path.resolve(
            options.assetsDir,
            cssFilename,
          )

          const css = await readFile(cssPath)

          const prefix = options.prefix
            ? `${options.prefix.replace(/^\/|\/$/g, '')}/`
            : ''

          const r2Key = `${prefix}${cssFilename}`

          await s3.send(
            new PutObjectCommand({
              Bucket: options.bucket,
              Key: r2Key,
              Body: css,

              ContentType:
                'text/css; charset=utf-8',

              CacheControl:
                'public, max-age=31536000, immutable',
            }),
          )

          const publicUrl =
            `${options.publicUrl.replace(/\/$/, '')}/${r2Key}`

          const replacement =
            `<link rel="stylesheet" href="${publicUrl}">`

          liquid = liquid.replace(
            fullLiquidExpression,
            replacement,
          )

          console.log(
            `[shopify-r2-css] ${cssFilename} -> ${publicUrl}`,
          )
        }

        await writeFile(
          liquidPath,
          liquid,
          'utf8',
        )
      },
    },
  }
}

function escapeRegExp(value: string) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  )
}