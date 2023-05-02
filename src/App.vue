<script setup lang="ts">
import { RouterView } from 'vue-router'
import PageHeader from './components/PageHeader.vue'
</script>

<template>
  <div class="min-h-screen max-h-screen flex flex-col">
    <PageHeader />
    <RouterView class="flex-grow overflow-y-auto" />
    <notifications
      position="bottom right"
      pauseOnHover="true"
      max="10"
      classes="vue-notification rounded-md p-2 text-black"
      width="400"
    />
  </div>
</template>

<style>
.vue-notification {
  margin: 0 5px 5px;
  padding: 10px;
  font-size: 13px;
  color: #ffffff;

  background: #44a4fc;
  border-left: 5px solid #187fe7;
}

vue-notification.success {
  background: #68cd86;
  border-left-color: #42a85f;
}

vue-notification.warn {
  background: #ffb648;
  border-left-color: #f48a06;
}

vue-notification.error {
  background: #e54d42;
  border-left-color: #b82e24;
}
</style>
