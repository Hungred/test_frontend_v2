<template>
  <dialog ref="dialogRef" class="e-dialog">
    <div class="e-dialog__content">
      <h3 class="text-lg mb-4">{{ title || $t('dialogTitle.add') }}</h3>
      <div class="flex justify-end gap-3">
        <EBtn color="success" @click="$emit('confirm')">{{ $t('confirm') }}</EBtn>
        <EBtn color="error" @click="close">{{ $t('cancel') }}</EBtn>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ title?: string }>()
const emit = defineEmits(['confirm'])

const dialogRef = ref<HTMLDialogElement | null>(null)

const show = () => dialogRef.value?.showModal()
const close = () => dialogRef.value?.close()

defineExpose({ show, close })
</script>

<style scoped lang="scss">
.e-dialog {
  background: #333;
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #555;
  &::backdrop {
    background: rgba(0, 0, 0, 0.7);
  }
}
</style>
