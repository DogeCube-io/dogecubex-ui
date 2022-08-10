<template>
    <span></span>
</template>

<script lang="ts">
import type { TokenSwapDto } from "../../env";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import { useActiveStateStore } from "@/stores/ActiveStateStore";
import type { UnwrapRef } from "vue";
import { defineComponent } from "vue";
import type { POSITION } from "vue-toastification";
import { useToast } from "vue-toastification";
import type { ToastInterface } from "vue-toastification/src/ts/interface";
import NotificationToast from "@/components/sub/NotificationToast.vue";
import type { Router } from "vue-router";
import { useRouter } from "vue-router";
import { useSettingsStore } from "@/stores/SettingsStore";

export default defineComponent({
    components: {},
    data() {
        return {
            toast: null as never as ToastInterface,
            router: null as never as Router,
        }
    },
    mounted() {
        (this as any).router = useRouter();
        this.toast = useToast();
        this.SwapEventStore.subscribe(this.processSwap);
    },
    computed: {
        SwapEventStore() {
            return useSwapEventStore();
        },
        ActiveStateStore() {
            return useActiveStateStore();
        },
        SettingsStore() {
            return useSettingsStore();
        },
        showNotifications() {
            return window.location.pathname !== "/";
        },
    },
    methods: {
        viewClick(symbol: string) {
            this.router.push({path: '/info', query: {symbol: symbol}, hash: "#swaps"});
        },
        isNotifyForChosenSymbol(swap: TokenSwapDto) {
            const symbols = `-${this.SettingsStore.chosenSymbols}-`;
            return symbols.indexOf(`-${swap.tokenFrom}-`) > -1 || symbols.indexOf(`-${swap.tokenTo}-`) > -1;
        },
        isNotifyForActiveSymbol(swap: TokenSwapDto) {
            const symbol = this.ActiveStateStore.activeSymbol;
            return symbol && (swap.tokenFrom === symbol || swap.tokenTo === symbol);
        },
        isNotificationRelevant(swap: TokenSwapDto) {
            switch (this.SettingsStore.notificationMode) {
            case "4":
                return true;
            case "3":
                return this.isNotifyForChosenSymbol(swap);
            case "2":
                return this.isNotifyForActiveSymbol(swap);
            case "1":
            default:
                return false;
            }
        },
        processSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            if (!this.showNotifications) {
                return;
            }
            const swap: TokenSwapDto = state.lastSwap;
            if (this.isNotificationRelevant(swap)) {
                const toastId = `t-${swap.user.substring(44)}-${swap.dateAdded}-${swap.tokenFrom}-${swap.tokenTo}`;
                this.toast.info({
                    component: NotificationToast,
                    props: {
                        swap: {...swap},
                        elementId: toastId
                    },
                    listeners: {
                        viewClick: this.viewClick
                    }
                }, {
                    id: toastId,
                    position: "top-left" as POSITION,
                    timeout: 5000,
                    closeOnClick: false,
                    pauseOnFocusLoss: true,
                    pauseOnHover: true,
                    draggable: true,
                    draggablePercent: 0.6,
                    showCloseButtonOnHover: false,
                    hideProgressBar: false,
                    closeButton: "button",
                    icon: false,
                    rtl: false
                });
                if (this.SettingsStore.notificationSounds === "1") {
                    new Audio('swap.mp3').play();
                }
                // toast's progress works only when the tab is active.
                // Clear old irrelevant notifications after 1 minute.
                setTimeout(() => {
                    const $el = document.getElementById(toastId);
                    if ($el && $el.offsetHeight) {
                        this.toast.dismiss(toastId);
                    }
                }, 60000);
            }
        },
    },
    watch: {}
});
</script>
<style>

</style>
