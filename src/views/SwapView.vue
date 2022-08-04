<template>
    <TheHeader active-page="Swap" :show-images="true" />
    <main>
        <div class="px-4 my-5 text-center">
            <img class="d-block mx-auto mb-4 hero-image" style="height: 128px;" :src="heroImageFullUrl" alt="">
            <div class="col-lg-6 mx-auto container d3x-text-white">
                <div class="row">
                    <div id="pool-select-parent" class="col-12">
                        <pool-selector v-model="selectedPool"
                                       :initial-selection="selectedPoolSymbol" @onPoolSelected="poolChanged" />
                    </div>
                </div>
                <div class="row justify-content-center py-2 g-5" v-show="selectedPool && selectedPool.account" >
                    <div v-if="selectedPool" class="col-12" style="max-width: 450px;">
                        <span class="float-start">Pool account: </span>
                        <span class="d-inline-block float-end">
                            <span class="badge bg-info ms-1">{{util.shortAddress(selectedPool.account)}}</span>
                            &nbsp;<button-copy clazz="white float-end" :value="selectedPool.account" />
                        </span>
                    </div>
                </div>
                <div class="row justify-content-center pb-2 g-5">
                    <div class="col-12" style="max-width: 450px;">
                        <span class="float-start">Trading Engine: </span>
                        <status-widget :symbol="selectedPoolSymbol" :refresh-interval="3000" />
                        <RouterLink class="btn btn-primary btn-sm ms-2 float-end" :to="{ path: '/chart', query: {symbol: selectedPoolSymbol} }">
                            <icon-graph-up/>
                        </RouterLink>
                        <RouterLink class="btn btn-primary btn-sm float-end" :to="{ path: '/token', query: {symbol: selectedPoolSymbol} }">
                            <icon-details/> Info
                        </RouterLink>
                    </div>
                </div>
                <div class="row justify-content-center pb-2">
                    <div class="col-12 " >

                    </div>
                </div>
            </div>
            <div class="col-lg-6 mx-auto container ">
                <div class="row justify-content-center g-5">
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
                                    <button role="button" @click="showSettings = !showSettings" class="btn btn-primary btn-sm float-end swap-settings">
                                        <icon-sliders/>
                                    </button>
                                </h5>
                            </div>
                            <slide-up-down v-model="showSettings" :duration="800">
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
                                        <span class="float-end">{{ messageLengthRange === '1' ? 'Minimal' : (messageLengthRange === '2' ? 'Medium' : 'Full') }}</span>
                                    </div>
                                    <div class="col-4">
                                        <input type="range" v-model="messageLengthRange" class="form-range" min="1" max="3" step="1"
                                               @input="onMessageLengthChange"
                                               id="message-length-range" :style="{backgroundSize: (messageLengthRange - 1) * 100 / 2 + '% 100%'}" >
                                    </div>
                                </div>
                            </slide-up-down>
                            <div class="row">
                                <div class="input-group mb-3">
                                    <input id="amount-from" type="number" class="form-control" aria-label="Amount From"
                                           :class="{'is-valid': inputFromValid !== null && inputFromValid,
                                            'is-invalid': inputFromValid !== null && !inputFromValid}"
                                          v-model="amountFrom" @keyup="onInputChange" @change="onInputChange" step="0.1">
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
                                           v-model="amountTo"  @keyup="onInputChange" @change="onInputChange" step="0.1">
                                    <span class="input-group-text token-name">{{ tokenTo }}</span>
                                </div>
                            </div>

                            <div class="row price-row text-start">
                                <span @click="showDetailsClick"  style="cursor:pointer;">
                                    <span>
                                        <icon-info />&nbsp;
                                    </span>
                                    <span id="f-price" @click="priceModeClick" >{{ fPrice }}</span>
                                </span>
                            </div>
                            <slide-up-down v-model="expandDetails" :duration="800">
                                <div class="row price-row text-start" >
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

                            <div class="row message-row" :class="{hide: hideMessageRow}" >
                                <div class="alert alert-danger" :class="{hide: !error}"  role="alert">{{error}}</div>
                                <div class="alert alert-danger" :class="{hide: !warning}" role="alert" v-html="warning"></div>
                                <div id="swap-message-prompt" :class="{hide: error}" >
                                    <div>
                                        To swap send
                                    </div>
                                    <div>
                                <span class="badge bg-info"> <span>{{quoteSendAmount}}</span> <span
                                    >{{tokenFrom}}</span></span>
                                        <button-copy clazz="black float-end" :value="String(quoteSendAmount)" />
                                        <br> to the pool account with <b>an optional</b> message:
                                    </div>
                                    <div>
                                        <span class="badge bg-primary">{{walletMessage}}</span>
                                        <button-copy clazz="black float-end" :value="walletMessage" />
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style>
.swap-panel {
    background-color: #dedede;
    border-radius: 5px;
    color: black;
    padding: 10px;
}

.swap-panel h5 {
    color: black;
    margin-bottom: 20px;
}

.arrow-down {
    display: inline;
    margin-top: -21px;
    margin-left: -20px;
    position: absolute;
}

.change-direction {
    display: inline;
    margin-top: -20px;
    margin-left: 70px;
    position: absolute;
    z-index: 10;
    padding: 0 3px 2px 3px;
    border: black 1px solid;
}

.change-direction:focus {
    box-shadow: none;
}

.swap-settings {
    display: inline;
    /*margin-top: -20px;*/
    /*margin-left: 70px;*/
    /*position: absolute;*/
    z-index: 10;
    padding: 0 3px 2px 3px;
    border: black 1px solid;
}

.swap-settings:focus {
    box-shadow: none;
}

.price-row {
    background-color: #fefefe;
    border-radius: 3px;
    padding: 5px 0 5px;
    margin: 0 0 5px;
}

.message-row .alert {
    margin-left: 12px;
    width: calc(100% - 24px);
}

.input-group-text.token-name {
    min-width: 70px;
}

input[type="range"] {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    background-image: linear-gradient(#0095ff, #0095ff);
    background-size: 0 100%;
    background-repeat: no-repeat;
    height: 10px;
}

input[type=range]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
}

input[type=range]::-moz-range-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
}

input[type="range"]::-ms-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
}

#pool-select-parent {
    min-height: 57px;
}

#swap-message-prompt div:first-child {
    padding-right: 27px;
}

</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import type { PoolInfoDto, QuoteDto } from "../../env";
import Utils from "../util/Utils";
import ButtonCopy from "@/components/sub/ButtonCopy.vue";
import IconSliders from "@/components/icons/IconSliders.vue";
import IconArrowDown from "@/components/icons/IconArrowDown.vue";
import IconChangeDirection from "@/components/icons/IconChangeDirection.vue";
import IconInfo from "@/components/icons/IconInfo.vue";
import { useAmmConfigStore } from "@/stores/AmmConfigStore";
import type { AmmConfigDto } from "../../env";
import PoolSelector from "@/components/PoolSelector.vue";
import StatusWidget from "@/components/StatusWidget.vue";
import IconDetails from "@/components/icons/IconDetails.vue";
import IconGraphUp from "@/components/icons/IconGraphUp.vue";

export default {
    components: {
        IconGraphUp,
        IconDetails,
        StatusWidget,
        PoolSelector, IconInfo, IconChangeDirection, IconArrowDown, IconSliders, ButtonCopy, TheHeader},
    data() {
        return {
            selectedPool: <PoolInfoDto><any>null,

            amountFrom: null,
            amountTo: null,

            from: null,
            to: null,
            amount: null,
            xrd: null,

            REQ_ID: 0,
            priceInXRD: true,
            isInputBySource: true, // whether to use input-from or input-to as basis for getting a quote
            expandDetailsOnce: false,
            expandDetails: false,
            showSettings: false,

            maxSlippage: 0,
            messageLengthRange: "0",

            fPrice: "",
            priceImpact: "",
            minimumReceived: "",
            quoteSendAmount: 0,
            hideMessageRow: true,
            inputFromValid: null,
            inputToValid: null,
            walletMessage: "",
            error: "",
            warning: "",

            lastOnChange: 0,
            statusInterval: null,
            focusListener: null
        };
    },
    props: {},
    mounted() {
        this.maxSlippage = window.localStorage['maxSlippage'] || '0';
        this.messageLengthRange = window.localStorage['messageLength'] || '3';

        this.from = this.$route.query.from;
        this.to = this.$route.query.to;
        this.amount = this.$route.query.amount;
        this.xrd = this.$route.query.xrd;

        if (!this.to && !this.from) {
            this.to = "DGC";
        }
        if (!this.amount && !this.xrd) {
            this.xrd = "100";
        }
        if (this.mode === 'BUY') {
            if (this.amount) {
                this.amountTo = this.amount;
                // this.onChange(false,"amount-to");
            } else {
                this.amountFrom = this.xrd;
                // this.onChange(false,"amount-from");
            }
        } else {
            if (this.amount) {
                this.amountFrom = this.amount;
                // this.onChange(false, "amount-from");
            } else {
                this.amountTo = this.xrd;
                // this.onChange(false, "amount-to");
            }
        }

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
        shortRri(rri: string) {
            return Utils.shortRri(rri);
        },
        displayCurrency(amount: string) {
            return Utils.displayCurrency(amount);
        },
        changeDirection() {
            if (this.to) {
                const temp = this.to;
                this.to = null;
                this.from = temp;
            } else if (this.from) {
                const temp = this.from;
                this.from = null;
                this.to = temp;
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
        onInputChange(evt: Event) {
            this.onChange(false, evt.target.id);
        },
        onSlippageChange(evt: Event) {
            window.localStorage['maxSlippage'] = evt.target.value;
            this.onChange(false);
        },
        onMessageLengthChange(evt: Event) {
            window.localStorage['messageLength'] = '' + evt.target.value;
            this.onChange(false);
        },
        showErrorMessage(error: string) {
            if (this.isInputBySource) {
                this.amountTo = null;
            } else {
                this.amountFrom = null;
            }
            this.minimumReceived = "";
            this.priceImpact = "";
            this.fPrice = "";
            this.hideMessageRow = false;
            this.error = error;
            this.warning = null;
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
            let from = this.tokenFrom;
            let to = this.tokenTo;
            if (this.isInputBySource) {
                amountFrom = this.amountFrom;
                if (!this.amountFrom || this.amountFrom <= 0) {
                    this.hideMessageRow = true;
                    return;
                }
                this.inputToValid = null;
            } else {
                amountTo = this.amountTo;
                if (!this.amountTo || this.amountTo <= 0) {
                    this.hideMessageRow = true;
                    return;
                }
                this.inputFromValid = null;
            }

            if (reset && !reqInProgress) {
                this.showErrorMessage(null);
            }


            try {
                const response = await fetch(`/api/swap/quote.json`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    cache: "no-store",
                    body: JSON.stringify({
                        from: from,
                        to: to,
                        amountFrom: amountFrom,
                        amountTo: amountTo,
                        maxSlippage: this.maxSlippage
                    })
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

                let receivedAmount = this.isInputBySource ? resp.receivedAmount : amountTo;
                let minAmount = this.isInputBySource ? resp.minAmount : amountTo;
                let minFromAmount = this.isInputBySource ? amountFrom : resp.minAmount;
                let amountToSend = this.isInputBySource ? amountFrom : resp.sentAmount;

                let xrdValue = to === 'XRD' ? receivedAmount : minFromAmount;
                let price = to === 'XRD' ? receivedAmount / minFromAmount : minFromAmount / receivedAmount;
                let mainToken = to === 'XRD' ? to : from;
                let otherToken = to === 'XRD' ? from : to;

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
                    this.quoteSendAmount = amountToSend;
                    if (xrdValue > (this.config.maxOrderSize - 10)) {
                        // showWarning('Maximum order size is ' + (CONFIG.maxOrderSize - 10)
                        //     + ' XRD.<br><a target="_blank" href="/stakers">Stakers</a> can enjoy increased limits.');
                        this.warning = ('Only <a target="_blank" href="/stakers">Stakers</a> enjoy >' + (this.config.maxOrderSize - 10)
                            + ' XRD trades.<br>The swap will fail if you exceed your limit.');
                    } else {
                        this.warning = null;
                    }

                    let msgLength = Number(this.messageLengthRange);

                    let sign = this.isInputBySource ? '>' : '=';
                    if (msgLength === 3) {
                        sign = sign.replace('>', 'at least ').replace('=', 'exactly ');
                    } else if (msgLength === 2) {
                        sign = sign + ' ';
                    }
                    let prefix = msgLength === 3 ? 'Swap for ' : (msgLength === 2 ? 'For ' : '');
                    let suffix = msgLength === 3 ? ` ${to}` : (msgLength === 2 ? ` ${to}` : '');

                    this.walletMessage = `${prefix}${sign}${minAmount}${suffix}`;
                }

                if (xrdValue < 0) {
                    this.fPrice = "N/A";
                } else if (this.priceInXRD) {
                    let p = Number(price.toPrecision(6)).toFixed(12).replace(/\.?0+$/, "");
                    this.fPrice = `1 ${otherToken} = ${p} ${mainToken}`;
                } else {
                    let p = Number((1 / price).toPrecision(6)).toFixed(12).replace(/\.?0+$/, "");
                    this.fPrice = `1 ${mainToken} = ${p} ${otherToken}`;
                }

                let priceImpact = xrdValue >= 0 ? resp.priceImpact : 0;
                this.priceImpact = `${priceImpact} %`;

                let minReceivedVal = minAmount > 0 ? minAmount : 0;
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
        priceModeClick(evt) {
            this.priceInXRD = !this.priceInXRD;
            this.onChange(false);
            return false;
        },
        showDetailsClick(evt) {
            if (evt.target.id === "f-price") {
                return;
            }
            this.expandDetails = !this.expandDetails;
        },
        poolChanged() {
            if (this.to) {
                this.to = this.selectedPool.token.symbol;
            } else if (this.from) {
                this.from = this.selectedPool.token.symbol;
            }

            this.onChange(true);
        },
        getQueryParams() {
            const qp = {};
            if (this.from) {
                qp.from = this.from;
            }
            if (this.to) {
                qp.to = this.to;
            }
            if (this.amount) {
                qp.amount = this.amount;
            }
            if (this.xrd) {
                qp.xrd = this.xrd;
            }

            return qp;
        },
    },
    computed: {
        selectedPoolSymbol(): string {
            if (!this.selectedPool) {
                if (this.from) {
                    return this.from;
                }
                if (this.to) {
                    return this.to;
                }
                return "DGC";
            }
            return this.selectedPool.token.symbol;
        },
        heroImageFullUrl(): string {
            if (!this.selectedPool) {
                return "";
            }
            const heroImg = this.selectedPool.heroImageUrl;
            return heroImg.startsWith("http") ? heroImg : "https://dogecubex.b-cdn.net" + heroImg;
        },
        util() {
            return Utils;
        },

        mode() {
            if (this.from) {
                return "SELL";
            }
            if (this.to) {
                return "BUY";
            }
            return "";
        },
        tokenFrom() {
            return this.mode === 'SELL' ? this.selectedPoolSymbol : "XRD";
        },
        tokenTo() {
            return this.mode === 'BUY' ? this.selectedPoolSymbol : "XRD";
        },
        AmmConfigStore() {
            return useAmmConfigStore();
        },
        config(): AmmConfigDto {
            return this.AmmConfigStore.config || {};
        },
    },
    watch: {
        amountFrom(newVal) {
            if (this.isInputBySource) {
                if (this.mode === 'BUY') {
                    this.xrd = newVal;
                    this.amount = null;
                } else {
                    this.amount = newVal;
                    this.xrd = null;
                }
            }
        },
        amountTo(newVal) {
            if (!this.isInputBySource) {
                if (this.mode === 'SELL') {
                    this.xrd = newVal;
                    this.amount = null;
                } else {
                    this.amount = newVal;
                    this.xrd = null;
                }
            }
        },


        from(newVal) {
            const queryParams = this.getQueryParams();
            if (newVal) {
                queryParams.from = newVal;
            }
            this.$router.replace({ query: queryParams });
        },
        to(newVal) {
            const queryParams = this.getQueryParams();
            if (newVal) {
                queryParams.to = newVal;
            }
            this.$router.replace({ query: queryParams });
        },
        amount(newVal) {
            const queryParams = this.getQueryParams();
            if (newVal) {
                queryParams.amount = newVal;
            }
            this.$router.replace({ query: queryParams });
        },
        xrd(newVal) {
            const queryParams = this.getQueryParams();
            if (newVal) {
                queryParams.xrd = newVal;
            }
            this.$router.replace({ query: queryParams });
        },
        "$route.query": function(q) {
            this.from = q.from;
            this.to = q.to;
            this.amount = q.amount;
            this.xrd = q.xrd;
        },
    }
}
</script>
