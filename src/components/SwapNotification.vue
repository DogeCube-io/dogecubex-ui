<template>
    <span></span>
</template>

<script lang="ts">
import type { TokenSwapDto } from "../../env";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import { useActiveStateStore } from "@/stores/ActiveStateStore";
import type { UnwrapRef } from "vue";
import { useToast } from "vue-toastification";
import type { ToastInterface } from "vue-toastification/src/ts/interface";
import NotificationToast from "@/components/sub/NotificationToast.vue";
import { useRouter } from "vue-router";
import Router from "@/router";

export default {
    components: {},
    data() {
        return {
            toast: null as never as ToastInterface,
            router: Router,
        }
    },
    mounted() {
        this.router = useRouter();
        this.toast = useToast();
        this.SwapEventStore.subscribe(this.processSwap);
    },
    unmounted() {
    },
    computed: {
        SwapEventStore() {
            return useSwapEventStore();
        },
        ActiveStateStore() {
            return useActiveStateStore();
        },
        symbol() {
            return this.ActiveStateStore.activeSymbol;
        },
        showNotifications() {
            return window.location.pathname !== "/";
        },
    },
    methods: {
        viewClick(symbol: string) {
            this.router.push({path: '/info', query: {symbol: symbol}, hash: "#swaps"});
        },
        isNotificationRelevant(swap: TokenSwapDto) {
            // return !this.symbol || swap.tokenFrom === this.symbol || swap.tokenTo === this.symbol;
            return true;
        },
        processSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            if (!this.showNotifications) {
                return;
            }
            const swap: TokenSwapDto = state.lastSwap;
            if (this.isNotificationRelevant(swap)) {
                this.toast.info({
                    component: NotificationToast,
                    props: {
                        swap: swap
                    },
                    listeners: {
                        viewClick: this.viewClick
                    }
                }, {
                    position: "top-left",
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
            }
        },
    },
    watch: {}
}
</script>
<style>

</style>
