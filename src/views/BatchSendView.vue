<template>
    <TheHeader active-page="BatchSend" :show-images="true" />
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
                                    3. Upload a csv file (see <a href="/other/example.csv">example.csv</a>)<br>
                                    4. If prompted, set the token RRI<br>
                                    5. Verify that everything was imported properly<br>
                                    5. (Optionally) set a message.<br>
                                    6. Click "Send" to send the TX to Z3US<br>
                                    7. Make sure to verify the last account/amount before clicking "Confirm".<br>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="text-center my-3 col-12">
                        <span class="me-4">
                            CSV file:
                        </span>
                        <span class="input-group d-inline">
                                <input type="file" id="csvFile" accept=".csv" @change="parseCSV" />
                            </span>
                    </div>
                </div>
                <div v-if="anyRriMissing" class="row">
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
                    <div v-if="actions.length" class="text-center my-3 col-12">
                        <table id="swaps" class="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">&nbsp;</th>
                                <th scope="col-2">Account To</th>
                                <th scope="col">Amount</th>
                                <th v-if="hasTokenRri" scope="col">Token RRI</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(action, idx) in actions" v-bind:key="`${action.account_to}-${idx}`">
                                <td>{{ idx + 1 }}</td>
                                <td>{{ action.account_to }}</td>
                                <td>{{ action.amount }}</td>
                                <td v-if="hasTokenRri" class="brake">{{ getRri(action) }}</td>
                            </tr>
                            </tbody>
                        </table>
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
                        <div class="input-group  mt-1">
                            <span v-if="zeusConnected || xidarConnected">{{ connectedWallet }}</span>
                            <span v-else class="text-info">{{ "Please connect Z3US or XIDAR wallet" }}</span>
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
import { WalletAPI } from "../../wallets";

declare type SendActionModel = {
    account_to: string;
    amount: string;
    rri?: string;
};

export default defineComponent({
    components: {
        TheHeader
    },
    data() {
        return {
            actions: [] as SendActionModel[],
            hasTokenRri: false,
            anyRriMissing: true,
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
                    this.doParseCSV(text as string, csvFile);
                };

                reader.readAsText(input);
            }
        },
        doParseCSV(text: string, csvFile: HTMLInputElement) {
            if (text) {
                const lines = text.split(new RegExp("\\r?\\n"));
                let line = "";
                try {
                    const actions = [];
                    let hasRri = false;
                    let anyRriMissing = false;
                    const hasHeader = !this.getElements(lines[0])[0].startsWith("rdx1");
                    const start = hasHeader ? 1 : 0;
                    for (let i = start; i < lines.length; i++) {
                        line = lines[i];
                        if (!line && i > 0) { // ignore empty lines in the end
                            break;
                        }
                        const elements = this.getElements(line);

                        const action: SendActionModel = {
                            account_to: elements[0].trim(),
                            amount: elements[1].trim().split(",").join("").split(" ").join("")
                        };
                        if (elements.length > 2 && elements[2].trim()) {
                            action.rri = elements[2].trim();
                            hasRri = true;
                        } else {
                            anyRriMissing = true;
                        }
                        actions.push(action);
                    }
                    this.actions = actions;
                    this.hasTokenRri = hasRri;
                    this.anyRriMissing = anyRriMissing;
                } catch (e) {
                    this.actions = [];
                    this.hasTokenRri = false;
                    this.anyRriMissing = true;
                    alert("Can't parse line: " + line);
                    alert(e);
                    csvFile.value = "";
                }
            } else {
                this.actions = [];
                this.hasTokenRri = false;
                this.anyRriMissing = true;
            }
        },
        getElements(line: string): string[] {
            // remove double quotes - either whole line can be enclosed, or each individual cell
            const parts = line.trim().split(",");
            let elems: string[] = [];
            let stack: string[] = [];
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i].trim();
                if (part.startsWith('"')) {
                    if (part.endsWith('"')) {
                        elems.push(part.substring(1, part.length - 1));
                    } else {
                        stack.push(part.substring(1));
                    }
                } else if (part.endsWith('"')) {
                    stack.push(part.substring(0, part.length - 1));
                    if (i === parts.length - 1 && elems.length === 0) {
                        elems = stack
                    } else {
                        elems.push(stack.join(","));
                        stack = [];
                    }
                } else if (stack.length > 0) {
                    stack.push(part);
                } else {
                    elems.push(part);
                }
            }
            return elems;
        },
        async onClickSend() {
            let wallet: WalletAPI;
            if (this.zeusConnected) {
                wallet = window.z3us;
            } else if (this.xidarConnected) {
                wallet = window.xidar;
            } else {
                return;
            }

            if (wallet && wallet.v1) {
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
                                rri: this.getRri(action)
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
                await wallet.v1.submitTransaction(tx);
            }
        },
        getRri(action: SendActionModel) {
            const rri = action.rri || this.tokenRri;
            return rri === "XRD" ? Utils.XRD_TOKEN.rri : rri;
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
        xidarConnected() {
            return this.connectedWallet && this.connectedWallet === this.WalletConnectionStore.xidar;
        },
    },
});
</script>
