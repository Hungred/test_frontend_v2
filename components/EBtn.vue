<template>
  <button class="e-btn" :class="[`e-btn-${color}`]" type="button">
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string // 若有輸入時以此為主，若沒有就顯示 slot
  color?: 'success' | 'error' | 'warn' // 預設為 success
}

const props = withDefaults(defineProps<Props>(), {
  color: 'success',
})
</script>

<style scoped lang="scss">
.e-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  color: #ffffff;
  min-width: 60px;
  // success 綠
  &-success {
    background-color: #2e7d32;
  }

  // error 紅
  &-error {
    background-color: #d32f2f;
  }

  // warn 黃
  &-warn {
    background-color: #f9a825;
    color: #000000;
  }

  &:hover {
    filter: brightness(0.9);
  }

  &:active {
    transform: scale(0.95);
  }
  // 響應式優化：在極小螢幕 (320px) 下稍微縮小內距
  @media (max-width: 320px) {
    .e-btn {
      padding: 4px 10px;
      font-size: 12px;
    }
  }
}
</style>
