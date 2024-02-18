<script setup lang="ts">
import type { User } from '../../../../server/utils/db';

const accounts = ref<Omit<User, 'password'>[]>([])
async function listAccount() {
  const res = await $fetch('/api/auth/account')
  accounts.value = res
}

const account = ref('')
const user = ref<Omit<User, 'password'>>()
async function getByAccount() {
  const res = await $fetch('/api/auth/account/getByAccount', {
    query: {
      account: account.value
    }
  })
  console.log({res})
  user.value = res
}
</script>

<template>
  <div>
    <UButton @click="listAccount">listAccount</UButton>
    <ul>
      <li v-for="account in accounts">
        <span>{{ account.account }}</span>
      </li>
    </ul>
    <UInput v-model="account"></UInput>
    <UButton @click="getByAccount">getByAccount</UButton>
    <div>{{ user }}</div>
  </div>
</template>
