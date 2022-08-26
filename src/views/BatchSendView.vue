<template>
    <TheHeader active-page="Batch-Send" :show-images="true" />
    <main>
        <div class="px-4 my-3">
            <br>
            <div class="mx-auto container d3x-text-white">
                <div class="row">
                    <div class="text-center my-3 col-12">
                        <h4 style="display: inline;">
                            <span class="ms-2">Batch Send Tool</span>
                        </h4>
                        <p class="d3x-text-gray mt-3 align-middle">To send a transaction:</p>
                        <div class="row">
                            <div class="col-lg-4"></div>
                            <div class="col-lg-4">
                                <p class="d3x-text-gray mt-3 text-start">
                                    1. Choose the account you want to use in Z3US<br>
                                    2. Connect Z3US wallet (in the header)<br>
                                    3. Upload a csv file and press "Parse"<br>
                                    4. Verify that it was imported properly<br>
                                    5. Set the token RRI and (optional) message.<br>
                                    6. Click "Send" and confirm in Z3US wallet.<br>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="text-center my-3 col-12">
                        <span>
                            <span class="input-group d-inline">
                                <input type="file" id="csvFile" accept=".csv" />
                            </span>
                            <button class="btn btn-success ms-3" @click.stop="parseCSV">
                                Parse
                            </button>
                        </span>
                    </div>
                </div>
                <div class="row">
                    <div v-if="actions.length" class="text-center my-3 col-12">
                        <table id="swaps" class="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">&nbsp;</th>
                                <th scope="col">Account To</th>
                                <th scope="col">Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(action, idx) in actions" v-bind:key="`${action.account_to}-${idx}`">
                                <td>{{ idx + 1 }}</td>
                                <td>{{ action.account_to }}</td>
                                <td>{{ action.amount }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4"></div>
                    <div class="col-lg-4 text-center">
                        Token RRI:
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Token RRI"
                                   v-model="tokenRri">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4"></div>
                    <div class="col-lg-4 text-center">
                        Message (optional):
                        <div class="input-group">
                            <input type="text" class="form-control" v-model="message">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4"></div>
                    <div class="col-lg-4 text-center">
                        From account:
                        <div class="input-group">
                            <span>{{ zeusConnected ? connectedWallet : "Please connect Z3US first" }}</span>
                        </div>
                        &nbsp;
                        <button class="btn btn-primary mt-2" @click.stop="onClickSend">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style>


</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import Utils from "../util/Utils";
import { useActiveStateStore } from "@/stores/ActiveStateStore";
import { defineComponent } from "vue";
import { useWalletConnectionStore } from "@/stores/WalletConnectionStore";

declare type SendActionModel = {
    account_to: string;
    amount: string;
};

export default defineComponent({
    components: {
        TheHeader
    },
    data() {
        return {
            actions: [] as SendActionModel[],
            tokenRri: "xrd_rr1qy5wfsfh",
            message: "",
        }
    },
    methods: {
        parseCSV() {
            const csvFile = document.getElementById("csvFile") as HTMLInputElement;

            if (csvFile && csvFile.files) {
                const input = csvFile.files[0];
                const reader = new FileReader();

                reader.onload = (e) => {
                    const text = e?.target?.result;
                    this.doParseCSV(text as string);
                };

                reader.readAsText(input);
            }
        },
        doParseCSV(text: string) {
            console.log(text);
            if (text) {
                const lines = text.split(new RegExp("\\r?\\n"));
                try {
                    const actions = [];
                    const hasHeader = !lines[0].trim().startsWith("rdx1");
                    const start = hasHeader ? 1 : 0;
                    for (let i = start; i < lines.length; i++) {
                        const parts = lines[i].trim().split(",");
                        actions.push({
                            account_to: parts[0].trim(),
                            amount: parts[1].trim()
                        });
                    }
                    this.actions = actions;
                } catch (e) {
                    this.actions = [];
                    alert(e);
                }
            } else {
                this.actions = [];
            }
        },
        async onClickSend() {
            if (this.zeusConnected) {
                if (window.z3us && window.z3us.v1) {
                    const actions = [];
                    for (let i = 0; i < this.actions.length; i++) {
                        const action = this.actions[i];
                        actions.push({
                            type: 'TransferTokens',
                            from_account: {
                                address: this.connectedWallet,
                            },
                            to_account: {
                                address: action.account_to,
                            },
                            amount: {
                                token_identifier: {
                                    rri: this.tokenRri === "XRD" ? Utils.XRD_TOKEN.rri : this.tokenRri,
                                },
                                value: Utils.toAttos(action.amount),
                            },
                        });
                    }

                    const tx = {
                        actions: actions,
                    };
                    if (this.message) {
                        (tx as any).message = this.message;
                    }
                    await window.z3us.v1.submitTransaction(tx);
                }
            }
        },

    },
    computed: {
        ActiveStateStore() {
            return useActiveStateStore();
        },
        WalletConnectionStore() {
            return useWalletConnectionStore();
        },
        connectedWallet() {
            return (this as any).ActiveStateStore.connectedAccount as string;
        },
        zeusConnected() {
            return this.connectedWallet && this.connectedWallet === this.WalletConnectionStore.zeus;
        },
    },
});
</script>
