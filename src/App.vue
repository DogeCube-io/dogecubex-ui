<script setup lang="ts">
import { RouterView } from "vue-router";
import TheFooter from "@/components/TheFooter.vue";
import ConfigLoader from "@/components/ConfigLoader.vue";
import { useGlobalErrorStore } from "@/stores/GlobalErrorStore";
import ErrorView from "@/views/ErrorView.vue";
// empty line

</script>

<template>
    <ErrorView v-if="useGlobalErrorStore().error" />
    <RouterView v-else />
    <ConfigLoader />
    <TheFooter />
</template>

<style>
@import "@/assets/base.css";
@import "vue-select/dist/vue-select.css";
</style>
