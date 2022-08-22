<template>
    <button class="btn btn-sm link-dark connect-wallet" @click.stop="connectWalletClick" data-bs-toggle="modal"
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
import { defineComponent } from "vue";
import IconConnectWallet from "@/components/icons/IconConnectWallet.vue";
import { useActiveStateStore } from "@/stores/ActiveStateStore";
import Utils from "@/util/Utils";


export default defineComponent({
    components: {IconConnectWallet},
    data() {
        return {};
    },
    props: {},
    computed: {
        ActiveStateStore() {
            return useActiveStateStore();
        },

        connectedAccount() {
            return this.ActiveStateStore.connectedAccount;
        }
    },
    methods: {
        connectWalletClick() {
            // noop
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
