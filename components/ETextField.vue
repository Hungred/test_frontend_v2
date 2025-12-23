<template>
  <div class="e-textfield">
    <label :for="uuid" class="e-textfield__label">
      {{ label }}
    </label>
    <input :id="uuid" v-model="inputValue" :placeholder="placeholder" class="e-textfield__input" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id?: string // 若使用者有輸入，以使用者輸入的為主，若沒有請產出一個唯一 ID
  label?: string
  value: string | number
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
})

const emit = defineEmits<{
  (e: 'update:value', val: string | number): void
}>()

const inputValue = computed({
  get() {
    return props.value
  },
  set(newValue) {
    emit('update:value', newValue)
  },
})

const uuid = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 9)}`)
</script>

<style scoped lang="scss">
.e-textfield {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 6px;
  box-sizing: border-box;

  &__label {
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    padding-left: 2px;
  }

  &__input {
    width: 100%;
    padding: 10px 12px;
    background-color: transparent;
    border: 1px solid #666;
    border-radius: 8px;
    color: #ffffff;
    font-size: 16px;
    outline: none;
    box-sizing: border-box;
    transition: all 0.2s;

    &:focus {
      border-color: #f9a825;
      box-shadow: 0 0 0 1px #f9a825;
    }
  }
}

@media (max-width: 375px) {
  .e-textfield {
    &__input {
      padding: 8px 10px;
      font-size: 14px;
    }
    &__label {
      font-size: 13px;
    }
  }
}
</style>
