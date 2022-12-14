<template>
    <TheHeader active-page="Info" :show-images="true" />
    <main>
        <div class="px-4 my-3">
            <br>
            <div class="mx-auto container d3x-text-white">
                <div class="row" v-if="data.symbol">
                    <div class="text-center my-3 col-lg-4">&nbsp;</div>
                    <div class="text-center my-3 col-lg-4">
                        <h4 style="display: inline;">
                            <img style="max-width:64px;max-height:64px;"
                                 :src="data.analytics.token.iconUrl" :alt="data.analytics.token.name">
                            <span class="ms-2">{{ data.analytics.token.name }}</span>
                        </h4>
                        <h5 class="d3x-text-gray ms-2" style="display: inline;  vertical-align: super;">
                            ({{ data.symbol }})
                            <span v-if="symbol && symbol !== 'XRD' && SettingsStore.notificationMode === '3'">
                                <button v-if="!notificationsEnabled" class="bell-icon-off link-dark" @click="onNotificationClick(true)" type="button">
                                    <icon-bell-off />
                                </button>
                                <button v-if="notificationsEnabled" class="bell-icon-on link-dark" @click="onNotificationClick(false)" type="button">
                                    <icon-bell-on />
                                </button>
                            </span>
                        </h5>
                        <p class="d3x-text-gray mt-3 align-middle">{{ data.description }}</p>
                        <p class="d-sm-none fs-4 ms-2" style="display: inline;  vertical-align: super;">
                            <span class="ms-2">
                                <a class="link-dark" target="_blank" :href="data.tokenInfoUrl"><icon-home /></a>
                            </span>
                            <span class="ms-3">
                                <a class="link-dark " target="_blank"
                                   :href="`https://explorer.radixdlt.com//#/tokens/${data.analytics.token.rri}`"><icon-external-link /></a>
                            </span>
                        </p>
                    </div>
                    <div class="text-center my-3 col-lg-4">
                        <span id="pool-select-parent" class="col-12">
                            <pool-selector v-model="selectedPool" :simple-view="true" :show-xrd="true"
                                           :initial-selection="symbol" @onPoolSelected="poolChanged" />
                        </span>
                        <h5 class="d-none d-sm-block ms-2 float-end" style="display: inline;  vertical-align: super;">
                            <span class="row mb-1">
                                <a class="float-end link-dark" target="_blank" :href="data.tokenInfoUrl"><icon-home /></a>
                            </span>
                            <span class="row mb-1">
                                <a class="float-end link-dark " target="_blank"
                                   :href="`https://explorer.radixdlt.com//#/tokens/${data.analytics.token.rri}`"><icon-external-link /></a>
                            </span>
                            <span style="width: 0; margin-left: -150%;" class="row mt-1 float-start">
                                <currency-switcher class="float-start" />
                            </span>
                        </h5>
                        <span style="" class="row mt-2 d-sm-none float-end">
                            <currency-switcher class="float-end" />
                        </span>
                    </div>
                </div>
                <div class="row text-center" v-if="data.symbol">
                    <div class="my-2 col-lg-4">
                        <info-column>
                            <template v-slot:header>Total Supply</template>
                            <code class="">{{ displayCurrency(data.totalSupply) }}</code> <span> {{
                                data.symbol
                            }}</span>
                        </info-column>
                        <info-column>
                            <template v-slot:header>Fully Diluted Valuation</template>
                            <code class="">{{ displayCurrency0(data.analytics.valuation) }}</code>&nbsp;<span>{{data.analytics.currency}}</span>
                        </info-column>
                        <info-column v-if="data.analytics.currency === 'USD'">
                            <template v-slot:header>Total Liquidity</template>
                            <div class="row">
                                <span v-if="data.analytics.liquidityA">
                                    <code class="">{{
                                            displayCurrencySmart(data.analytics.liquidityA * data.analytics.price * 2)
                                        }}</code> <span> USD</span>
                                </span>
                                <span v-else-if="data.symbol === 'XRD'">
                                    <code class="">{{
                                            displayCurrency0(data.analytics.liquidityB * data.analytics.price * 2)
                                        }}</code> <span> USD</span>
                                </span>
                            </div>
                        </info-column>
                        <info-column v-else>
                            <template v-slot:header>Pooled Liquidity</template>
                            <div class="row">
                                <span v-if="data.analytics.liquidityA">
                                    <code class="">{{
                                            displayCurrencySmart(data.analytics.liquidityA)
                                        }}</code> <span> {{ data.symbol }}</span>
                                </span>
                                <span>
                                    <code class="">{{
                                            displayCurrency0(data.analytics.liquidityB)
                                        }}</code> <span> XRD</span>
                                </span>
                            </div>
                        </info-column>
                    </div>
                    <div class="my-2 col-lg-4">

                    </div>
                    <div class="my-2 col-lg-4">
                        <info-column>
                            <template v-slot:header>
                                Trading Volume <sup>24h</sup>/<sub>7d</sub>
                            </template>
                            <code class="">{{ displayCurrency0(data.analytics.volume24h) }}</code> /
                            <code class="">{{ displayCurrency0(data.analytics.volume7d) }}</code>
                            &nbsp;<span>{{data.analytics.currency}}</span>
                        </info-column>
                        <info-column>
                            <template v-slot:header>
                                Price Change <sup>24h</sup>/<sub>7d</sub>
                            </template>
                            <price-change :value="data.analytics.priceChange24h" />
                            /
                            <price-change :value="data.analytics.priceChange7d" />
                        </info-column>
                        <info-column>
                            <template v-slot:header>Price, {{data.analytics.currency}}</template>
                            <code class="">{{ displayCurrency(data.analytics.price) }}</code>
                        </info-column>
                    </div>
                </div>
                <div v-if="symbol" class="row text-center shadow-sm py-2 mx-auto">
                    <div class="text-center tv-chart-parent my-3" :class="{'col-xl-8': symbol !== 'XRD'}">
                        <TVChartContainer :symbol="symbol" />
                    </div>
                    <div v-if="symbol !== 'XRD'" class="text-center col-xl-4" style="">
                        <div class="d3x-text-white">
                            <div class="row justify-content-center pt-3 pb-2 g-5">
                                <div class="col-12" style="max-width: 450px;">
                                    <span>Trading Engine: </span>
                                    <status-widget :symbol="symbol" :refresh-interval="3000" />
                                </div>
                            </div>
                            <div class="row justify-content-center pb-2 g-5">
                                <div class="col-12" style="max-width: 450px;">
                                    <span class="float-start">Pool account: </span>
                                    <span v-if="data.poolAccount" class="d-inline-block float-end js-click-parent">
                                        <copy-trigger class="badge bg-info ms-1">
                                            {{ util.shortAddress(data.poolAccount) }}
                                        </copy-trigger>
                                        &nbsp;<button-copy clazz="white float-end" :value="data.poolAccount" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center g-5">
                            <swap-widget v-if="swapModel" :params="swapModel" :symbol="symbol"
                                         @on-update-model="onParamsUpdate" :pool-account="data.poolAccount || ''"
                                         :token-rri="data.analytics && data.analytics.token.rri || ''" />
                        </div>
                    </div>
                </div>
                <div v-if="symbol" class="row text-center shadow-sm py-3     mx-auto">
                    <div class="h5">
                        Recent Swaps
                        <status-widget v-if="symbol === 'XRD'" class="fs-6" :refresh-interval="15000" />
                    </div>
                    <analytics-swaps :symbol="symbol" />
                </div>
            </div>
        </div>
    </main>
</template>

<style>
.TVChartContainer {
    min-height: 300px;
    height: calc(100vh - 240px);
}

@media (max-width: 575px) {
    .tv-chart-parent {
        padding-right: 0;
        padding-left: 0;
    }
}

.bell-icon-off,
.bell-icon-on {
    background-color: transparent;
    border: none;
}
.bell-icon-on {
    color: darkgreen;
}
.bell-icon-on:hover {
    color: darkred;
}

</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import type { SwapModel, TokenDetailsDto, TokenInfoModel } from "../../env";
import Utils from "../util/Utils";
import IconHome from "@/components/icons/IconHome.vue";
import IconExternalLink from "@/components/icons/IconExternalLink.vue";
import PriceChange from "@/components/sub/PriceChange.vue";
import InfoColumn from "@/components/sub/InfoColumn.vue";
import AnalyticsSwaps from "@/components/AnalyticsSwaps.vue";
import StatusWidget from "@/components/StatusWidget.vue";
import TVChartContainer from "@/components/TVChartContainer.vue";
import API from "@/util/API";
import SwapWidget from "@/components/SwapWidget.vue";
import ButtonCopy from "@/components/sub/ButtonCopy.vue";
import { useActiveStateStore } from "@/stores/ActiveStateStore";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import { defineComponent } from "vue";
import type { UnwrapRef } from "vue";
import type { TokenSwapDto } from "../../env";
import IconBellOff from "@/components/icons/IconBellOff.vue";
import { useSettingsStore } from "@/stores/SettingsStore";
import IconBellOn from "@/components/icons/IconBellOn.vue";
import type { PoolInfoDto } from "../../env";
import PoolSelector from "@/components/PoolSelector.vue";
import CopyTrigger from "@/components/sub/CopyTrigger.vue";
import CurrencySwitcher from "@/components/sub/CurrencySwitcher.vue";

export default  defineComponent({
    components: {
        CurrencySwitcher,
        CopyTrigger,
        PoolSelector,
        IconBellOn,
        IconBellOff,
        ButtonCopy,
        SwapWidget,
        TVChartContainer,
        StatusWidget, AnalyticsSwaps, InfoColumn, PriceChange, IconExternalLink, IconHome, TheHeader
    },
    data() {
        return {
            symbol: "",
            currency: "",
            data: {} as TokenDetailsDto,
            notificationsEnabled: false,

            selectedPool: null as never as PoolInfoDto,

            swapModel: null as never as SwapModel,

            statusInterval: null as ReturnType<typeof setInterval> | null,
        }
    },
    props: {},
    async mounted() {
        this.currency = this.SettingsStore.analyticsCurrency;
        this.initState(this.$route.query.symbol as string);
        this.SwapEventStore.subscribe(this.onNewSwap);
        this.SettingsStore.subscribeAnalyticsCurrencyChange(this.onCurrencyChange);
        this.statusInterval = setInterval(this.loadData, 30000);
        window.addEventListener('focus', this.loadData);
    },
    unmounted() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
            this.statusInterval = null;
        }
        window.removeEventListener('focus', this.loadData);
    },
    methods: {
        initState(symbol?: string) {
            this.symbol = symbol || "";

            if (!this.symbol) {
                this.symbol = this.ActiveStateStore.lastSymbol || "DGC";
            } else {
                this.ActiveStateStore.setSymbol(this.symbol);
            }

            const swapModel: SwapModel = {};

            const mode = this.ActiveStateStore.mode;
            if (mode === "SELL") {
                swapModel.from = this.symbol;
            } else {
                swapModel.to = this.symbol;
            }

            const lastInput = this.ActiveStateStore.lastInputs[this.symbol];
            if (lastInput && lastInput.amount) {
                swapModel.amount = String(lastInput.amount);
            } else {
                swapModel.xrd = this.ActiveStateStore.xrd || "100";
            }

            this.swapModel = swapModel;

            this.notificationsEnabled = this.SettingsStore.chosenSymbols.indexOf(this.symbol) > -1;

            this.loadData();
        },
        onNotificationClick(enable: boolean) {
            this.notificationsEnabled = enable;
            if (enable) {
                this.SettingsStore.addChosenSymbol(this.symbol);
            } else {
                this.SettingsStore.removeChosenSymbol(this.symbol);
            }
        },
        poolChanged() {
            if (this.selectedPool) {
                this.symbol = this.selectedPool.token.symbol;
                this.initState(this.symbol);
            }
        },
        getQueryParams(): TokenInfoModel {
            const qp: TokenInfoModel = {};
            if (this.symbol) {
                qp.symbol = this.symbol;
            }
            return qp;
        },
        async loadData() {
            this.data = await API.get(`/api/token-details.json?symbol=${this.symbol}&currency=${this.currency}`);
        },
        onNewSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            const swap: TokenSwapDto = state.lastSwap;
            if (swap.tokenFrom === this.symbol || swap.tokenTo === this.symbol) {
                this.loadData();
            }
        },
        onCurrencyChange(state: UnwrapRef<{ analyticsCurrency: string }>) {
            if (this.currency !== state.analyticsCurrency) {
                this.currency = state.analyticsCurrency;
                this.loadData();
            }
        },
        onParamsUpdate(params: SwapModel) {
            const symbol = params.from || params.to || "";
            this.ActiveStateStore.setState(symbol, params.from ? "SELL" : "BUY");
            this.ActiveStateStore.setAmount(symbol, params.amount, params.xrd);
        },
        shortRri(rri: string) {
            return Utils.shortRri(rri);
        },
        displayCurrency(amount: string | number) {
            return Utils.displayCurrency(amount);
        },
        displayCurrency0(amount: string | number) {
            return Utils.displayCurrency0(amount);
        },
        displayCurrencySmart(amount: string | number) {
            return Utils.displayCurrencySmart(amount);
        },

    },
    computed: {
        util() {
            return Utils;
        },
        ActiveStateStore() {
            return useActiveStateStore();
        },
        SwapEventStore() {
            return useSwapEventStore();
        },
        SettingsStore() {
            return useSettingsStore();
        },
    },
    watch: {
        symbol(newVal) {
            const queryParams = this.getQueryParams();
            if (newVal) {
                queryParams.symbol = newVal;
            }
            this.$router.replace({query: queryParams});
        },
        "$route.query": function (q) {
            if (this.symbol !== q.symbol) {
                this.initState(q.symbol);
            }
        },
    },
});
</script>
