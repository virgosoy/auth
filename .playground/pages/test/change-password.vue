<script setup lang="ts">

const state = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const toast = useToast()

async function doChangePassword() {
  const { oldPassword, newPassword, confirmNewPassword } = state
  if (newPassword !== confirmNewPassword) {
    toast.add({ 
      color: 'red', 
      title: 'Error',
      description: '两次新密码不一致', 
    })
    return
  }
  try {
    await $fetch('/api/auth/my/change-password', {
      method: 'POST',
      body: {
        oldPassword,
        newPassword,
      },
    })
    toast.add({ 
      color: 'primary', 
      title: 'Success',
      description: '修改成功' 
    })
  } catch(err: any) {
    toast.add({ 
      color: 'red', 
      title: 'Error',
      description: err?.data.message ?? err?.message ?? err, 
    })
  }
}

</script>

<template>
  <div>
    <UForm :state="state" @submit="doChangePassword">
      <UFormGroup label="旧密码" name="oldPassword">
        <UInput v-model="state.oldPassword" type="password" placeholder="请输入旧密码"></UInput>
      </UFormGroup>
      <UFormGroup label="新密码" name="newPassword">
        <UInput v-model="state.newPassword" type="password" placeholder="请输入新密码"></UInput>
      </UFormGroup>
      <UFormGroup label="确认新密码" name="confirmNewPassword">
        <UInput v-model="state.confirmNewPassword" type="password" placeholder="请再次输入新密码"></UInput>
      </UFormGroup>
      <UButton type="submit">修改密码</UButton>
    </UForm>
  </div>
</template>
