<script setup lang="ts">
import { RouterView } from 'vue-router'
import PageHeader from './components/PageHeader.vue'
</script>

<template>
  <div class="min-h-screen max-h-screen flex flex-col">
    <PageHeader />
    <RouterView class="flex-grow overflow-y-auto" />
  </div>
</template>
