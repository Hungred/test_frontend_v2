<template>
  <dialog ref="dialogRef" class="e-dialog">
    <div class="e-dialog__content flex flex-col h-full">
      <div class="text-lg mb-4 text-center">{{ title || $t('dialogTitle.add') }}</div>
      <div class="bg-black/40 p-4 rounded-md mb-4 flex-1 overflow-auto">
        <div class="text-md my-2">{{ $t('dialogContent') }}</div>
      </div>
      <div class="flex justify-center gap-4 flex-wrap">
        <EBtn color="success" class="flex-1 min-w-[100px]" @click="$emit('confirm')">
          {{ $t('confirm') }}
        </EBtn>
        <EBtn color="error" class="flex-1 min-w-[100px]" @click="close">
          {{ $t('cancel') }}
        </EBtn>
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
  width: min(70%, 400px);
  max-width: 400px;
  min-width: 270px;
  max-height: 90vh;
  &::backdrop {
    background: rgba(0, 0, 0, 0.7);
  }
}

@media (max-width: 320px) {
  .e-dialog {
    padding: 1rem;
    font-size: 14px;
  }

  .e-dialog__content button {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
