<template>
    <div class="modal fade" id="connect-wallet-modal" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">"Connect" Wallet</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="connectedWallet" class="mb-1">
                        <h6>Currently "connected": </h6>
                        <span class="float-end" style="margin-top: -15px;">
                                <button class="btn btn-danger" @click.stop="disconnect(connectedWallet)">
                                    Disconnect
                                </button>
                            </span>
                        <div class="mb-2 js-click-parent">
                            <copy-trigger class="text-success">
                                {{ addressHugeOrMedium(connectedWallet) }}
                            </copy-trigger>
                            <span class="ms-1">
                                <button-copy clazz="white" :value="connectedWallet" />
                            </span>
                        </div>
                        <hr>
                    </div>
                    <div>
                        Add Account:
                        <div class="row pt-1">
                            <div class="col-lg-2"></div>
                            <div class="col-6 col-lg-5">
                                <button class="btn link-dark pick-wallet-btn" :class="{deselect: mode === 'OTHER'}"
                                        @click.stop="onSelectZeus">
                                    <img src="https://dogecubex.b-cdn.net/icons/Z3US_64x64.png" alt="Z3US Wallet">
                                    <span class="ms-2 d-inline-block">Z3US Wallet</span>
                                    <span v-if="zeusConnected" class="ms-2 text-success">Connected</span>
                                </button>
                            </div>
                            <div class="col-6 col-lg-5">
                                <button class="btn link-dark pick-wallet-btn" :class="{deselect: mode === 'Z3US'}"
                                        @click.stop="mode = 'OTHER'">
                                    <img src="https://dogecubex.b-cdn.net/icons/Radix_g_64x64.png" alt="Other Wallet">
                                    <span class="ms-2 d-inline-block">Other Wallet</span>
                                </button>

                            </div>
                        </div>
                        <div class="mt-2">
                            <div v-if="mode === 'Z3US'">
                                <div v-if="!zeusDetected">Please install
                                    <a href="https://z3us.com/" target="_blank">Z3US extension</a>
                                    and create/import a wallet.
                                </div>
                                <div v-else-if="!zeusConnected">
                                    Awaiting confirmation from Z3US extension...
                                </div>
                            </div>
                            <div v-if="mode === 'OTHER'">
                                <div>Copy your Account Address from the Wallet you are using, and paste it here:</div>
                                <div class="row mt-1">
                                    <div class="col-8 col-sm-9 col-lg-10">
                                        <div class="input-group">
                                            <input type="text" class="form-control" placeholder="Account Address"
                                                   v-model="addedAccount" :pattern="addrRegexp">
                                        </div>
                                    </div>
                                    <div class="col-2">
                                        <button class="btn btn-primary" @click.stop="connectWallet(addedAccount)">
                                            Connect
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div v-if="wallets && wallets.length">
                        <hr>
                        <h6>Previously "connected" wallets</h6>
                        <div v-for="(wallet, idx) in wallets" class="prev-wallet js-click-parent" v-bind:key="wallet">
                            <span class="me-3">{{ idx + 1 }}</span>
                            <copy-trigger class="d-inline-block js-prev-addr"
                                          :style="maxWidth ? 'min-width: ' + maxWidth + 'px;' : ''">
                                {{ shortPrevAddress(wallet) }}
                            </copy-trigger>
                            <span>
                                <span class="ms-1">
                                    <button-copy clazz="white" :value="wallet" />
                                </span>
                                <span class="float-end ms-1">
                                    <button class="btn btn-sm btn-danger" @click.stop="deleteWallet(wallet)">
                                        <icon-delete />
                                    </button>
                                </span>
                                <span class="float-end ms-1">
                                    <button class="btn btn-sm btn-primary" @click.stop="connectWallet(wallet)">
                                        Connect
                                    </button>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useActiveStateStore } from "@/stores/ActiveStateStore";
import Utils from "@/util/Utils";
import CopyTrigger from "@/components/sub/CopyTrigger.vue";
import ButtonCopy from "@/components/sub/ButtonCopy.vue";
import IconDelete from "@/components/icons/IconDelete.vue";
import { useWalletConnectionStore } from "@/stores/WalletConnectionStore";

export default defineComponent({
    components: {IconDelete, ButtonCopy, CopyTrigger},
    data: () => {
        return {
            mode: "",
            addedAccount: "",

            maxWidth: 0,

            canvas: document.createElement("canvas"),
            addrRegexp: "^rdx1[02-9AC-HJ-NP-Zac-hj-np-z]{54}[cgqsCGQS]{1}[02-9AC-HJ-NP-Zac-hj-np-z]{6}$",
        };
    },
    mounted(): void {
        this.updateZeusStatus();
    },
    computed: {
        ActiveStateStore(): ReturnType<typeof useActiveStateStore> {
            return useActiveStateStore();
        },
        WalletConnectionStore(): ReturnType<typeof useWalletConnectionStore> {
            return useWalletConnectionStore();
        },
        connectedWallet(): string {
            return this.ActiveStateStore.connectedAccount as string;
        },
        wallets() {
            let accounts = this.ActiveStateStore.accountsArr as string[];
            const connected = this.connectedWallet as string;
            if (connected) {
                accounts = accounts.filter(e => e !== connected);
            }
            return accounts;
        },

        zeusDetected() {
            return window.z3us && window.z3us.v1;
        },
        zeusConnected() {
            return this.connectedWallet && this.connectedWallet === this.WalletConnectionStore.zeus;
        },

    },
    methods: {
        connectWallet(account: string): void {
            this.ActiveStateStore.connectAccount(account);
            this.updateZeusStatus();
        },
        disconnect(account: string): void {
            if (this.connectedWallet === account) {
                this.ActiveStateStore.connectAccount("");
                this.updateZeusStatus();
            }
        },
        deleteWallet(account: string) {
            this.ActiveStateStore.removeAccount(account);
        },
        async onSelectZeus() {
            this.mode = "Z3US";
            if (window.z3us && window.z3us.v1) {
                const hasWallet = await window.z3us.v1.hasWallet();
                if (!hasWallet) {
                    return;
                }
                const selectedAddress = await window.z3us.v1.connect();
                this.WalletConnectionStore.setZeus(selectedAddress);
                if (selectedAddress) {
                    this.connectWallet(selectedAddress);
                }
            }
        },
        async updateZeusStatus(): Promise<void> {
            if (window.z3us && window.z3us.v1) {
                const hasWallet = await window.z3us.v1.hasWallet();
                if (hasWallet) {
                    if (await window.z3us.v1.isConnected()) {
                        const selectedAddress = await window.z3us.v1.connect();
                        this.WalletConnectionStore.setZeus(selectedAddress || "");
                    } else {
                        this.WalletConnectionStore.setZeus("");
                    }
                } else {
                    this.WalletConnectionStore.setZeus("");
                }
            }
        },
        updateMaxWalletWidth(shortAddr: string): void {
            try {
                const context = this.canvas.getContext("2d");
                if (context) {
                    context.font = "16px Roboto";
                    const width = Math.ceil(context.measureText(shortAddr).width);
                    if (width > this.maxWidth) {
                        this.maxWidth = width;
                    }
                }
            } catch (e) {
                // ignore
            }
        },

        shortPrevAddress(addr: string): string {
            const shortAddr = Utils.shortAddress(addr);
            this.updateMaxWalletWidth(shortAddr);
            setTimeout(() => {
                this.updateMaxWalletWidth(shortAddr);
            }, 50);
            return shortAddr;
        },
        addressHugeOrMedium(addr: string) {
            const w = window.innerWidth;
            return w > 440 ? Utils.addressHuge(addr) : Utils.addressMedium(addr);
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
.pick-wallet-btn {
    border: 1px solid;
}

.pick-wallet-btn:focus {
    box-shadow: none;
    color: white;
}

.pick-wallet-btn.deselect {
    color: dimgray;
    border: none;
}

#connect-wallet-modal .prev-wallet {
    min-height: 35px;
}

#connect-wallet-modal input:invalid {
    box-shadow: 0 0 0 0.25rem rgb(139 0 0 / 75%);
}

#connect-wallet-modal input:not(:placeholder-shown):valid {
    box-shadow: 0 0 0 0.25rem rgb(0 139 0 / 75%);
}
</style>

