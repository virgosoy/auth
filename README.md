# Nuxt Layer Starter

Create Nuxt extendable layer with this GitHub template.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Working on your theme

Your theme is at the root of this repository, it is exactly like a regular Nuxt project, except you can publish it on NPM.

The `.playground` directory should help you on trying your theme during development.

Running `pnpm dev` will prepare and boot `.playground` directory, which imports your theme itself.

## Distributing your theme

Your Nuxt layer is shaped exactly the same as any other Nuxt project, except you can publish it on NPM.

To do so, you only have to check if `files` in `package.json` are valid, then run:

```bash
npm publish --access public
```

Once done, your users will only have to run:

```bash
npm install --save your-theme
```

Then add the dependency to their `extends` in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: 'your-theme'
})
```

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Or statically generate it with:

```bash
pnpm generate
```

Locally preview production build:

```bash
pnpm preview
```

Checkout the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## 依赖说明

开发依赖的 @nuxt/examples-ui 是 playground 依赖的，实际并不需要。

## 使用

首先依赖此层，nuxt.config.js：
```ts
export default defineNuxtConfig({
  extends: [
    // master 分支
    'github:virgosoy/auth#master',
  ],
})
```

创建服务端插件，进行初始化：
/server/plugins/0.auth-server.ts
```ts
export default defineNitroPlugin((nirtoApp) => {
  defineAuthServer(...)
  defineUserDb(...)
})
```

定义类型，便于TS使用。后面程序中直接使用定义的方法。
/composables/auth.ts
```ts
export const useMyAuthClient = useAuthClient_<...>
export const useMyUser = useUser_<...>
```

