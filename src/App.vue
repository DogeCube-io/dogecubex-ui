<script setup lang="ts">
import { RouterView } from "vue-router";
import TheFooter from "@/components/TheFooter.vue";
import ConfigLoader from "@/components/ConfigLoader.vue";
// empty line
</script>

<template>
    <RouterView />
    <ConfigLoader />
    <TheFooter />
</template>

<style>
@import "@/assets/base.css";
</style>
