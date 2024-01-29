// 权限控制
// 最早来源于：https://github.com/nuxt/examples/tree/main/examples/auth/local

// This code is demo only.
if (!process.env.NUXT_AUTH_PASSWORD) {
  console.warn('Security warning: NUXT_AUTH_PASSWORD is not set. Using an example value. Please set it otherwise your session is unsecure!');
  process.env.NUXT_AUTH_PASSWORD = 'secretsecretsecretsecretsecretsecretsecret'
}

import type { SessionConfig } from "h3";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    auth: {
      name: "nuxt-session",
      password: process.env.NUXT_AUTH_PASSWORD || "",
      cookie: {secure: false},
    }, // as SessionConfig
  },
  nitro: {
    storage: {
      ".data:auth": { driver: "fs", base: "./.data/auth" },
    },
  },
})
