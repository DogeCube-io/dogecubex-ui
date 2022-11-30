<template>
    <div class="col-12" style="max-width: 450px;">
        <!-- TODO: first time alert -->
        <div id="how-to-alert" class="alert alert-warning alert-dismissible fade hide" role="alert">
            First time here? Please see <a class="alert-link" target="_blank" href="/info">How To
            Swap</a><br>
            Also, yes, it's legit. See <a class="alert-link" target="_blank" href="/about">How It
            Works</a>
            <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="swap-panel">
            <div>
                <h5 class="start-0">
                    <span>Swap</span>
                    <button role="button" @click="showSettings = !showSettings"
                            class="btn btn-primary btn-sm float-end swap-settings">
                        <icon-sliders />
                    </button>
                </h5>
            </div>
            <slide-up-down class="settings-area" v-model="showSettings" :duration="800">
                <div class="row">
                    <div class="col text-start">
                        <label>Slippage tolerance:</label>
                    </div>
                    <div class="col">
                        <div class="input-group mb-3">
                            <input type="number" class="form-control" v-model="maxSlippage"
                                   @change="onSlippageChange" @keyup="onSlippageChange"
                                   min="0" aria-label="Slippage tolerance" step="0.1">
                            <span class="input-group-text"> %</span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-8 text-start">
                        <label for="message-length-range" class="form-label">Message length: </label>
                        <span class="float-end">{{
                                messageLengthRange === '1' ? 'Minimal' : (messageLengthRange === '2' ? 'Medium' : 'Full')
                            }}</span>
                    </div>
                    <div class="col-4">
                        <input type="range" v-model="messageLengthRange" class="form-range" min="1" max="3" step="1"
                               @input="onMessageLengthChange"
                               id="message-length-range"
                               :style="{backgroundSize: (Number(messageLengthRange) - 1) * 100 / 2 + '% 100%'}">
                    </div>
                </div>
            </slide-up-down>
            <div class="row">
                <div class="input-group mb-3">
                    <input id="amount-from" type="number" class="form-control" aria-label="Amount From"
                           :class="{'is-valid': inputFromValid !== null && inputFromValid,
                                            'is-invalid': inputFromValid !== null && !inputFromValid}"
                           v-model="amountFrom" @keyup="onInputChange" @change="onInputChange" step="0.1">
                    <button v-if="userAccBalance" class="btn btn-sm max-btn"
                            :class="amountFrom == maxAmountFrom ? 'btn-outline-info shadow-none' : 'btn-info'"
                            @click.stop="onMaxClick">Max
                    </button>
                    <span class="input-group-text token-name">{{ tokenFrom }}</span>
                </div>
            </div>
            <span class="arrow-down">
                                <icon-arrow-down />
                            </span>
            <button role="button" @click="changeDirection" class="btn btn-secondary btn-sm change-direction">
                <icon-change-direction />
            </button>

            <div class="row">
                <div class="input-group mb-3">
                    <input id="amount-to" type="number" class="form-control" aria-label="Amount To"
                           :class="{'is-valid': inputToValid !== null && inputToValid,
                                            'is-invalid': inputToValid !== null && !inputToValid}"
                           v-model="amountTo" @keyup="onInputChange" @change="onInputChange" step="0.1">
                    <span class="input-group-text token-name">{{ tokenTo }}</span>
                </div>
            </div>

            <div class="row price-row text-start">
                <span @click="showDetailsClick" style="cursor:pointer;">
                    <span>
                        <icon-info />&nbsp;
                    </span>
                    <span id="f-price" @click="priceModeClick">{{ fPrice }}</span>
                </span>
            </div>
            <slide-up-down v-model="expandDetails" :duration="800">
                <div class="row price-row text-start">
                    <span>
                        <span>Price Impact</span>
                        <span class="float-end">{{ priceImpact }}</span>
                    </span>
                    <span>
                        <span>Minimum Received</span>
                        <span class="float-end">{{ minimumReceived }}</span>
                    </span>
                </div>
            </slide-up-down>

            <div class="row message-row" :class="{hide: hideMessageRow}">
                <div class="alert alert-danger" :class="{hide: !error}" role="alert" v-html="error"></div>
                <div class="alert alert-danger" :class="{hide: !warning}" role="alert" v-html="warning"></div>
                <div v-if="!zeusConnected && !xidarConnected" id="swap-message-prompt" :class="{hide: error}">
                    <div>
                        To swap send
                    </div>
                    <div class="js-click-parent">
                        <copy-trigger class="badge bg-info">
                            <span>{{ quoteSendAmountNum }}</span> <span>{{ quoteSendToken }}</span>
                        </copy-trigger>
                        <button-copy clazz="black float-end" :value="quoteSendAmount" />
                        <br> to the pool account with <b>an optional</b> message:
                    </div>
                    <div class="js-click-parent">
                        <copy-trigger class="badge bg-primary">{{ walletMessage }}</copy-trigger>
                        <button-copy clazz="black float-end" :value="walletMessage" />
                    </div>
                </div>
                <div v-else :class="{hide: error}">
                    <div class="mt-1">
                        <button class="btn btn-sm btn-primary px-3" @click.stop="onClickSwap">Swap</button>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script lang="ts">
import type { AmmConfigDto, QuoteDto, SwapModel } from "../../env";
import ButtonCopy from "@/components/sub/ButtonCopy.vue";
import IconSliders from "@/components/icons/IconSliders.vue";
import IconArrowDown from "@/components/icons/IconArrowDown.vue";
import IconChangeDirection from "@/components/icons/IconChangeDirection.vue";
import IconInfo from "@/components/icons/IconInfo.vue";
import { useAmmConfigStore } from "@/stores/AmmConfigStore";
import API from "@/util/API";
import Models from "@/util/Models";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import CopyTrigger from "@/components/sub/CopyTrigger.vue";
import Utils from "@/util/Utils";
import { useAccountInfoStore } from "@/stores/AccountInfoStore";
import { useActiveStateStore } from "@/stores/ActiveStateStore";
import { useWalletConnectionStore } from "@/stores/WalletConnectionStore";
import { WalletAPI } from "../../wallets";

export default defineComponent({
    components: {CopyTrigger, IconInfo, IconChangeDirection, IconArrowDown, IconSliders, ButtonCopy},
    data() {
        return {

            maxSlippage: 0,
            messageLengthRange: "0",

            priceInXRD: true, // UI state too but need to remember


            // UI state
            showSettings: false,
            expandDetailsOnce: false,
            expandDetails: false,

            // form + internal state
            swapModel: null as never as SwapModel,

            amountFrom: null as string | number | null | undefined,
            amountTo: null as string | number | null | undefined,
            isInputBySource: true, // whether to use input-from or input-to as basis for getting a quote
            inputFromValid: null as null | boolean,
            inputToValid: null as null | boolean,
            hideMessageRow: true,
            maxTokenAmountFrom: "",


            error: "" as string | null,
            warning: "" as string | null,

            // result of quote calc in onChange()
            fPrice: "",
            priceImpact: "",
            minimumReceived: "",
            quoteSendAmountNum: 0,
            quoteSendAmount: "",
            quoteSendToken: "",
            walletMessage: "",

            // other component vars
            REQ_ID: 0,

            lastOnChange: 0,
            focusListener: null as (() => void) | null,
            statusInterval: null as ReturnType<typeof setInterval> | null,
        }
    },
    emits: ['onUpdateModel'],
    props: {
        params: {
            type: Object as PropType<SwapModel>,
            required: true,
        },
        symbol: {
            type: String,
            required: true,
        },
        poolAccount: {
            type: String,
            required: true,
        },
        tokenRri: {
            type: String,
            required: true,
        },
    },
    mounted() {
        this.maxSlippage = window.localStorage['maxSlippage'] || '0';
        this.messageLengthRange = window.localStorage['messageLength'] || '3';

        this.swapModel = this.params;
        this.onModelChanged();
        this.onChange(true);

        this.focusListener = () => {
            if (Date.now() - this.lastOnChange > 1000) { // do not auto update if user-updated within 1 second
                this.onChange(false);
            }
        }

        this.statusInterval = setInterval(this.focusListener, 3000);
        window.addEventListener('focus', this.focusListener);
    },
    unmounted() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
            this.statusInterval = null;
        }
        if (this.focusListener) {
            window.removeEventListener('focus', this.focusListener);
        }
    },
    methods: {

        onSlippageChange(evt: Event) {
            window.localStorage['maxSlippage'] = (evt.target as HTMLInputElement).value;
            this.onChange(false);
        },
        onMessageLengthChange(evt: Event) {
            window.localStorage['messageLength'] = '' + (evt.target as HTMLInputElement).value;
            this.onChange(false);
        },
        onInputChange(evt: Event) {
            this.onChange(false, (evt.target as Element).id);
        },
        priceModeClick(evt: Event) {
            this.priceInXRD = !this.priceInXRD;
            this.onChange(false);
            return false;
        },
        showDetailsClick(evt: Event) {
            if ((evt.target as Element).id === "f-price") {
                return;
            }
            this.expandDetails = !this.expandDetails;
        },
        async getMaxTokenSell(): Promise<string | null> {
            const response = await API.postRaw("/api/swap/quote.json", {
                from: this.tokenFrom,
                to: this.tokenTo,
                amountTo: this.userMaxOrder,
                maxSlippage: this.maxSlippage
            });

            if (!response.ok) {
                return null;
            }

            const resp = await response.json() as QuoteDto;
            const error = resp && resp.error;

            if (error) {
                return null;
            }

            return resp.minAmount || null;
        },
        async onMaxClick() {
            if (this.userMaxOrder && this.userAccBalance) {
                if (this.tokenFrom === "XRD") {
                    this.amountFrom = this.maxAmountFrom;
                    this.onChange(true, "amount-from");
                } else {
                    const maxTokenSell = await this.getMaxTokenSell();
                    if (maxTokenSell && Utils.compare(maxTokenSell, this.userAccBalance) >= 0) {
                        this.maxTokenAmountFrom = this.userAccBalance;
                        this.amountFrom = this.maxTokenAmountFrom;
                        this.onChange(true, "amount-from");
                    } else {
                        this.maxTokenAmountFrom = "";
                        this.amountTo = this.userMaxOrder;
                        this.onChange(true, "amount-to");
                    }
                }
            }
        },
        async onClickSwap() {
            if (!this.error && this.poolAccount && this.tokenRri) {
                let wallet: WalletAPI;
                if (this.zeusConnected) {
                    wallet = window.z3us;
                } else if (this.xidarConnected) {
                    wallet = window.xidar;
                } else {
                    return;
                }
                if (wallet && wallet.v1) {
                    const tx = {
                        actions: [
                            {
                                type: 'TransferTokens',
                                from_account: {
                                    address: this.connectedWallet,
                                },
                                to_account: {
                                    address: this.poolAccount,
                                },
                                amount: {
                                    token_identifier: {
                                        rri: this.tokenFrom === "XRD" ? Utils.XRD_TOKEN.rri : this.tokenRri,
                                    },
                                    value: Utils.toAttos(this.quoteSendAmount),
                                },
                            },
                        ],
                        message: this.walletMessage,
                        encryptMessage: false,
                    };
                    await wallet.v1.submitTransaction(tx);
                }
            }
        },
        updateSymbol(symbol: string) {
            this.maxTokenAmountFrom = "";
            if (this.swapModel.to) {
                this.changeModel({
                    to: symbol,
                });
            } else if (this.swapModel.from) {
                this.changeModel({
                    from: symbol,
                });
            }
            this.onModelChanged();
            this.onChange(true);
        },
        changeDirection() {
            if (this.swapModel.to) {
                this.changeModel({
                    to: undefined,
                    from: this.swapModel.to,
                });
            } else if (this.swapModel.from) {
                this.changeModel({
                    from: undefined,
                    to: this.swapModel.from,
                });
            }

            if (this.isInputBySource) {
                this.amountTo = this.amountFrom;
                this.amountFrom = "";
                this.onChange(true, "amount-to");
            } else {
                this.amountFrom = this.amountTo;
                this.amountTo = "";
                this.onChange(true, "amount-from");
            }
        },

        showErrorMessage(error: string | null, html?: boolean) {
            if (this.isInputBySource) {
                this.amountTo = null;
            } else {
                this.amountFrom = null;
            }
            this.minimumReceived = "";
            this.priceImpact = "";
            this.fPrice = "";
            this.hideMessageRow = false;
            if (error && !html) {
                const $div = document.createElement("div");
                $div.innerText = error;
                this.error = $div.innerHTML;
            } else {
                this.error = error;
            }
            this.warning = null;
        },
        onModelChanged() {
            if (this.mode === 'BUY') {
                if (this.swapModel.amount) {
                    this.amountTo = this.swapModel.amount;
                    this.isInputBySource = false;
                } else {
                    this.amountFrom = this.swapModel.xrd;
                    this.isInputBySource = true;
                }
            } else {
                if (this.swapModel.amount) {
                    this.amountFrom = this.swapModel.amount;
                    this.isInputBySource = true;
                } else {
                    this.amountTo = this.swapModel.xrd;
                    this.isInputBySource = false;
                }
            }

        },

        async onChange(reset: boolean, inputId?: string) {
            this.lastOnChange = Date.now();
            const reqInProgress = this.REQ_ID !== 0;
            const rand = Math.random();
            this.REQ_ID = rand;

            if (inputId) {
                if (inputId === "amount-from") {
                    this.isInputBySource = true;
                } else if (inputId === "amount-to") {
                    this.isInputBySource = false;
                }
            }

            let amountFrom = null;
            let amountTo = null;
            const from = this.tokenFrom;
            const to = this.tokenTo;
            if (this.isInputBySource) {
                amountFrom = this.amountFrom;
                if (!this.amountFrom || Number(this.amountFrom) <= 0) {
                    this.hideMessageRow = true;
                    return;
                }
                this.inputToValid = null;
            } else {
                amountTo = this.amountTo;
                if (!this.amountTo || Number(this.amountTo) <= 0) {
                    this.hideMessageRow = true;
                    return;
                }
                this.inputFromValid = null;
            }

            if (reset && !reqInProgress) {
                this.showErrorMessage(null);
            }


            try {
                const response = await API.postRaw("/api/swap/quote.json", {
                    from: from,
                    to: to,
                    amountFrom: amountFrom,
                    amountTo: amountTo,
                    maxSlippage: this.maxSlippage
                });
                if (this.REQ_ID !== rand) {
                    return;
                }
                this.REQ_ID = 0;
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const resp = (isJson ? await response.json() : null) as QuoteDto;
                const error = resp && resp.error;

                if (!response.ok || error) {
                    this.showErrorMessage("Error: " + (error || response.status));
                    return;
                }

                const receivedAmount = Number(this.isInputBySource ? resp.receivedAmount : amountTo);
                const minAmount = Number(this.isInputBySource ? resp.minAmount : amountTo);
                const minFromAmount = Number(this.isInputBySource ? amountFrom : resp.minAmount);
                const amountToSend = this.isInputBySource ? amountFrom : resp.sentAmount;

                const xrdValue = to === 'XRD' ? receivedAmount : minFromAmount;
                const price = to === 'XRD' ? receivedAmount / minFromAmount : minFromAmount / receivedAmount;
                const mainToken = to === 'XRD' ? to : from;
                const otherToken = to === 'XRD' ? from : to;

                let inputError = null;
                if (xrdValue < this.config.minOrderSize) {
                    inputError = `Amount should be higher than ${this.config.minOrderSize} XRD`;
                } else if (xrdValue > (this.config.stakerMaxOrderSize - 10)) {
                    inputError = `Amount should be lower than ${(this.config.stakerMaxOrderSize - 10)} XRD`;
                }

                if (inputError != null) {
                    if (this.isInputBySource) {
                        this.inputFromValid = false;
                    } else {
                        this.inputToValid = false;
                    }
                    this.walletMessage = "";
                    this.showErrorMessage(inputError);
                } else {
                    if (this.isInputBySource) {
                        this.inputFromValid = true;
                    } else {
                        this.inputToValid = true;
                    }
                    this.error = null;
                    this.hideMessageRow = false;
                    this.quoteSendAmount = String(amountToSend);
                    this.quoteSendAmountNum = Number(amountToSend);
                    this.quoteSendToken = this.tokenFrom;
                    if (this.userMaxOrder) {
                        this.warning = null;
                        if (xrdValue > this.userMaxOrder) {
                            this.showErrorMessage('Trade amount exceeds your limit (' + this.userMaxOrder
                                + ' XRD). Please see <a target="_blank" href="/stakers">Stakers Info</a> for details.', true);
                        }
                    } else {
                        if (xrdValue > (this.config.maxOrderSize - 10)) {
                            this.warning = ('Only <a target="_blank" href="/stakers">Stakers</a> enjoy >' + (this.config.maxOrderSize - 10)
                                + ' XRD trades.<br>The swap will fail if you exceed your limit.');
                        } else {
                            this.warning = null;
                        }
                    }


                    const msgLength = Number(this.messageLengthRange);

                    let sign = this.isInputBySource ? '>' : '=';
                    if (msgLength === 3) {
                        sign = sign.replace('>', 'at least ').replace('=', 'exactly ');
                    } else if (msgLength === 2) {
                        sign = sign + ' ';
                    }
                    const prefix = msgLength === 3 ? 'Swap for ' : (msgLength === 2 ? 'For ' : '');
                    const suffix = msgLength === 3 ? ` ${to}` : (msgLength === 2 ? ` ${to}` : '');

                    this.walletMessage = `${prefix}${sign}${minAmount}${suffix}`;
                }

                if (xrdValue < 0) {
                    this.fPrice = "N/A";
                } else if (this.priceInXRD) {
                    const p = this.toPrecision6(price);
                    this.fPrice = `1 ${otherToken} = ${p} ${mainToken}`;
                } else {
                    const p = this.toPrecision6(1 / price);
                    this.fPrice = `1 ${mainToken} = ${p} ${otherToken}`;
                }

                const priceImpact = xrdValue >= 0 ? resp.priceImpact : 0;
                this.priceImpact = `${priceImpact} %`;

                const minReceivedVal = minAmount > 0 ? minAmount : 0;
                this.minimumReceived = `${minReceivedVal} ${to}`;

                if (xrdValue < 0) {
                    if (this.isInputBySource) {
                        this.amountTo = 0;
                    } else {
                        this.amountFrom = 0;
                    }
                } else {
                    if (this.isInputBySource) {
                        this.amountTo = receivedAmount;
                    } else {
                        this.amountFrom = resp.minAmount;
                    }
                    if (!this.expandDetailsOnce) {
                        this.expandDetailsOnce = true;
                        this.expandDetails = true;
                    }
                }


            } catch (error) {
                if (this.REQ_ID === rand) {
                    this.REQ_ID = 0;
                    this.error = "ERROR: " + error;
                }
                return;
            }

        },
        changeModel(upd: Partial<SwapModel>) {
            const swapModel = Models.swapModel(this.swapModel);
            const rec = upd as Record<string, string>;
            for (const prop in rec) {
                const val = rec[prop] as string;
                if (val) {
                    (swapModel as Record<string, string>)[prop] = val;
                } else {
                    delete (swapModel as Record<string, string>)[prop];
                }
            }
            this.swapModel = swapModel;
            this.$emit('onUpdateModel', swapModel);
        },
        toPrecision6(num: number) {
            return Utils.displayCurrencyShort(num);
        },
    },
    computed: {
        tokenFrom() {
            return this.mode === 'SELL' ? this.symbol : "XRD";
        },
        tokenTo() {
            return this.mode === 'BUY' ? this.symbol : "XRD";
        },
        mode() {
            if (this.swapModel ? this.swapModel.from : this.params.from) {
                return "SELL";
            }
            if (this.swapModel ? this.swapModel.to : this.params.to) {
                return "BUY";
            }
            return "";
        },
        maxAmountFrom() {
            if (this.userMaxOrder) {
                if (this.tokenFrom === "XRD") {
                    if (Utils.compare(this.userAccBalance, "" + this.userMaxOrder) < 0) {
                        return String(Number(this.userAccBalance) - 0.1);
                    } else {
                        return this.userMaxOrder;
                    }
                } else {
                    return this.maxTokenAmountFrom || this.userAccBalance;
                }
            }
            return "";
        },
        userMaxOrder() {
            return this.AccountInfoStore.accountInfo?.maxOrderSize;
        },
        userAccBalance() {
            const balances = this.AccountInfoStore.accountInfo?.balances;
            if (!balances) {
                return "";
            }
            return balances[this.tokenFrom] || "";
        },

        AmmConfigStore() {
            return useAmmConfigStore();
        },
        AccountInfoStore() {
            return useAccountInfoStore();
        },
        ActiveStateStore() {
            return useActiveStateStore();
        },
        WalletConnectionStore() {
            return useWalletConnectionStore();
        },
        connectedWallet() {
            return this.ActiveStateStore.connectedAccount;
        },
        config(): AmmConfigDto {
            return this.AmmConfigStore.config || {};
        },
        zeusConnected() {
            return this.connectedWallet && this.connectedWallet === this.WalletConnectionStore.zeus;
        },
        xidarConnected() {
            return this.connectedWallet && this.connectedWallet === this.WalletConnectionStore.xidar;
        },
    },
    watch: {
        amountFrom(newVal, oldVal) {
            if (this.isInputBySource) {
                const t = typeof oldVal;
                if (t === 'number' || (t === 'string' && oldVal) || (!this.swapModel.xrd && !this.swapModel.amount)) {
                    if (this.mode === 'BUY') {
                        this.changeModel({
                            xrd: newVal,
                            amount: undefined,
                        });
                    } else {
                        this.changeModel({
                            amount: newVal,
                            xrd: undefined,
                        });
                    }
                }

            }
        },
        amountTo(newVal, oldVal) {
            if (!this.isInputBySource) {
                const t = typeof oldVal;
                if (t === 'number' || (t === 'string' && oldVal) || (!this.swapModel.xrd && !this.swapModel.amount)) {
                    if (this.mode === 'SELL') {
                        this.changeModel({
                            xrd: newVal,
                            amount: undefined,
                        });
                    } else {
                        this.changeModel({
                            amount: newVal,
                            xrd: undefined,
                        });
                    }
                }
            }
        },
        params(newVal) {
            if (!this.swapModel || (this.swapModel.to !== newVal.to) || (this.swapModel.from !== newVal.from)) {
                this.maxTokenAmountFrom = "";
                this.swapModel = newVal;
                this.onModelChanged();
                this.onChange(true);
            }
        },
        symbol(newVal) {
            this.updateSymbol(newVal);
        },
    },
});
</script>

<style>
.settings-area {
    overflow-x: hidden;
}

.max-btn.shadow-none:hover {
    background-color: transparent;
    color: #93c;
    cursor: default;
}
</style>
