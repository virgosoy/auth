<script setup lang="ts">
import type { User } from '../../../../server/utils/db';

const accounts = ref<Omit<User, 'password'>[]>([])
async function listAccount() {
  const res = await $fetch('/api/auth/user/list')
  accounts.value = res
}

const account = ref('')
const user = ref<Omit<User, 'password'>>()
async function getByAccount() {
  const res = await $fetch('/api/auth/user/get-by-account', {
    query: {
      account: account.value
    }
  })
  console.log({res})
  user.value = res
}

const password = ref('')
async function addUser() {
  await $fetch('/api/auth/user/add', {
    method: 'POST',
    body: {
      account: account.value,
      password: password.value
    }
  })
}

async function updateUser() {
  await $fetch('/api/auth/user', {
    method: 'PUT',
    body: {
      id: user!.value!.id,
      account: account.value,
      ...password.value && {password: password.value}
    }
  })
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
    <UFormGroup label="account">
      <UInput v-model="account"></UInput>
    </UFormGroup>
    <UFormGroup label="password">
      <UInput v-model="password"></UInput>
    </UFormGroup>
    <UButton @click="addUser">addUser</UButton>
    <UButton @click="updateUser">updateUser</UButton>
  </div>
</template>
