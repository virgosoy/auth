declare module '#app' {
  interface PageMeta {
    auth?: boolean
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {}