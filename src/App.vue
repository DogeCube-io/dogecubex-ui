<script setup lang="ts">
import { RouterView } from "vue-router";
import TheFooter from "@/components/TheFooter.vue";
import ConfigLoader from "@/components/ConfigLoader.vue";
import { useGlobalErrorStore } from "@/stores/GlobalErrorStore";
import ErrorView from "@/views/ErrorView.vue";
import SwapNotification from "@/components/SwapNotification.vue";
import ConnectWalletModal from "@/components/modal/ConnectWalletModal.vue";
// empty line

</script>

<template>
    <ErrorView v-if="useGlobalErrorStore().error" />
    <RouterView v-else />
    <ConfigLoader />
    <swap-notification />
    <connect-wallet-modal />
    <TheFooter />
</template>

<style>
@import "@/assets/base.css";
@import "vue-select/dist/vue-select.css";
</style>
