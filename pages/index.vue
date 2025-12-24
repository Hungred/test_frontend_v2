<template>
  <div class="min-h-screen bg-[#222] text-white p-4 sm:p-8 flex flex-col items-center gap-6">
    <div class="w-full max-w-[600px] flex justify-end gap-4 text-sm">
      <button
        v-for="loc in locales"
        :key="loc.code"
        @click="locale = loc.code"
        :class="{ 'text-yellow-500 font-bold': locale === loc.code }"
      >
        {{ loc.name }}
      </button>
    </div>

    <div
      class="w-full max-w-[600px] border box-border border-gray-600 rounded-3xl p-6 bg-[#2a2a2a] shadow-xl"
    >
      <h2 class="text-center text-xl font-bold mb-6 tracking-widest">{{ $t('operation') }}</h2>
      <div class="flex flex-col gap-5">
        <ETextField
          :label="$t('name')"
          v-model:value="formData.name"
          :placeholder="$t('inputName')"
        />
        <p v-if="errors.name" class="text-red-500 text-xs -mt-4 ml-1">{{ errors.name }}</p>

        <ETextField
          :label="$t('age')"
          v-model:value.number="formData.age"
          :placeholder="$t('inputAge')"
        />
        <p v-if="errors.age" class="text-red-500 text-xs -mt-4 ml-1">{{ errors.age }}</p>

        <div class="flex justify-end gap-3 mt-2">
          <EBtn v-if="isEditing" color="success" @click="handleConfirm('update')">{{
            $t('update')
          }}</EBtn>
          <EBtn color="warn" v-if="!isEditing" @click="handleConfirm('add')">{{ $t('add') }}</EBtn>
        </div>
      </div>
    </div>

    <div
      class="w-full max-w-[600px] border box-border border-gray-600 rounded-3xl p-6 bg-[#2a2a2a] shadow-xl overflow-x-auto"
    >
      <table class="w-full text-center border-collapse">
        <thead>
          <tr class="border-b border-gray-700 text-gray-400 text-sm">
            <th class="py-3 font-medium">#</th>
            <th class="font-medium">{{ $t('name') }}</th>
            <th class="font-medium">{{ $t('age') }}</th>
            <th class="font-medium">{{ $t('operation') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in userStore.users"
            :key="user.id"
            class="border-b border-gray-800 last:border-0 hover:bg-white/5 transition-colors"
          >
            <td class="py-4 text-gray-400">{{ index + 1 }}</td>
            <td class="font-medium">{{ user.name }}</td>
            <td>{{ user.age }}</td>
            <td class="flex justify-center gap-2 py-4 flex-wrap">
              <EBtn color="success" @click="startEdit(user)">{{ $t('update') }}</EBtn>
              <EBtn color="error" @click="handleConfirm('delete', user.id)">{{
                $t('delete')
              }}</EBtn>
            </td>
          </tr>
          <tr v-if="userStore.users.length <= 0">
            <td class="align-center" :colspan="4">
              {{ $t('noData') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <EDialog ref="confirmDialog" @confirm="submitForm" :title="dialogTitle" />
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import EDialog from '@/components/EDialog.vue'
import type { MainUpdateUserInfoReq } from '~/api-client'

const { t, locales } = useI18n()

const userStore = useUserStore()

const { error } = await useAsyncData('users-list', async () => {
  await userStore.fetchUsers()
  return true
})

if (error.value) console.error('SSR Fetch Failed', error.value)

const { locale } = useI18n()
const confirmDialog = ref<InstanceType<typeof EDialog> | null>(null)
const isEditing = ref(false)

const formData = reactive({
  id: null as number | null,
  name: '',
  age: 0,
})

const errors = reactive({ name: '', age: '' })
// 驗證表單
const validate = () => {
  let isValid = true

  errors.name = formData.name.length < 2 ? t('error.name') : ''

  const ageRegex = /^[1-9]\d*$/
  if (!ageRegex.test(String(formData.age))) {
    errors.age = t('error.age')
  } else {
    errors.age = ''
  }
  if (errors.name || errors.age) isValid = false

  return isValid
}

// const dialogTitleMap = {
//   add: t('dialogTitle.add'),
//   update: t('dialogTitle.update'),
//   delete: t('dialogTitle.delete'),
// }
type actionType = 'add' | 'update' | 'delete'
const action = ref<actionType | null>(null)
const deleteId = ref<number | null>(null) // 用來存 delete 的 id
const dialogTitle = ref('')

// 點擊按鈕時開啟confirm dialog
const handleConfirm = (type: actionType, id?: number) => {
  action.value = type
  if ((type === 'add' || type === 'update') && !validate()) return

  if (type === 'delete' && id !== undefined) {
    deleteId.value = id
  }

  dialogTitle.value = t(`dialogTitle.${action.value}`)
  confirmDialog.value?.show()
}

// 提交表單
const submitForm = async () => {
  if (action.value === 'add') {
    await userStore.addUser({ name: formData.name, age: formData.age })
  } else if (action.value === 'update') {
    await userStore.updateUser({ ...formData } as any)
  } else if (action.value === 'delete' && deleteId.value !== null) {
    await userStore.deleteUser(deleteId.value)
  }

  // 重置表單
  resetForm()
  confirmDialog.value?.close()
  action.value = null
  deleteId.value = null
}

const resetForm = () => {
  isEditing.value = false
  formData.id = null
  formData.name = ''
  formData.age = 0
}

const startEdit = (user: MainUpdateUserInfoReq) => {
  isEditing.value = true
  Object.assign(formData, user)
}
</script>
