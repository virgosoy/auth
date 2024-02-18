<script setup lang="ts">
import type { User } from '../../../../server/utils/db';

const accounts = ref<Omit<User, 'password'>[]>([])
async function listAccount() {
  const res = await $fetch('/api/auth/account')
  accounts.value = res
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
  </div>
</template>
