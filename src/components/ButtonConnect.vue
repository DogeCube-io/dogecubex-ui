<template>
    <button class="btn btn-sm link-dark connect-wallet" data-bs-toggle="modal"
            data-bs-target="#connect-wallet-modal">
        <icon-connect-wallet class="fs-5" :class="{'text-success': !!connectedAccount}" />
        <span class="d-none d-md-inline-block ms-1 fs-6">
            <span v-if="connectedAccount">&nbsp;{{ addressMedium(connectedAccount) }}</span>
            <span v-else> "Connect" Wallet</span>
        </span>
        <span class="d-md-none ms-1 fs-6">
            <span v-if="connectedAccount">&nbsp;{{ addressTiny(connectedAccount) }}</span>
            <span v-else> Connect</span>
        </span>
    </button>
</template>

<script lang="ts">
import { defineComponent, type UnwrapRef } from "vue";
import IconConnectWallet from "@/components/icons/IconConnectWallet.vue";
import { useActiveStateStore } from "@/stores/ActiveStateStore";
import Utils from "@/util/Utils";
import { useAccountInfoStore } from "@/stores/AccountInfoStore";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import type { TokenSwapDto } from "../../env";


export default defineComponent({
    components: {IconConnectWallet},
    data() {
        return {
            statusInterval: null as ReturnType<typeof setInterval> | null,
        };
    },
    mounted() {
        this.loadAccountInfo();
        this.ActiveStateStore.subscribeConnectedAccount(this.onAccountChange);
        this.SwapEventStore.subscribe(this.onNewSwap);

        this.statusInterval = setInterval(this.loadAccountInfo, 30000);
        window.addEventListener('focus', this.loadAccountInfo);
    },
    unmounted() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
            this.statusInterval = null;
        }
        window.removeEventListener('focus', this.loadAccountInfo);
    },
    computed: {
        ActiveStateStore(): ReturnType<typeof useActiveStateStore> {
            return useActiveStateStore();
        },
        AccountInfoStore() {
            return useAccountInfoStore();
        },
        SwapEventStore() {
            return useSwapEventStore();
        },

        connectedAccount(): string {
            return this.ActiveStateStore.connectedAccount as string;
        },
    },
    methods: {
        loadAccountInfo():void {
            this.AccountInfoStore.loadAccountInfo(this.connectedAccount);
        },
        onAccountChange(state: UnwrapRef<{ connectedAccount: string | null }>): void {
            this.AccountInfoStore.loadAccountInfo(state.connectedAccount || "");
        },
        onNewSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            const acc = this.connectedAccount;
            if (acc && state.lastSwap && state.lastSwap.user === acc) {
                this.loadAccountInfo();
            }
        },

        addressHuge(addr: string) {
            return Utils.addressHuge(addr);
        },
        addressMedium(addr: string) {
            return Utils.addressMedium(addr);
        },
        addressTiny(addr: string) {
            return Utils.addressTiny(addr);
        },
    }
});
</script>

<style>
.connect-wallet {
    border: 1px solid;
}

.connect-wallet:focus {
    box-shadow: none;
    color: white;
}
</style>
