<script setup lang="ts">

async function getSession(){
    const session = await $fetch('/api/auth/session')
    console.log(session)
}
</script>

<template>
  <div>
    <UButton @click="getSession">获取Session</UButton>
  </div>
</template>
