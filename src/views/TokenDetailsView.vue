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
                            <span v-if="SettingsStore.notificationMode === '3'">
                                <button v-if="!notificationsEnabled" class="bell-icon-off link-dark" @click="onNotificationClick(true)" type="button">
                                    <icon-bell-off />
                                </button>
                                <button v-if="notificationsEnabled" class="bell-icon-on link-dark" @click="onNotificationClick(false)" type="button">
                                    <icon-bell-on />
                                </button>
                            </span>
                        </h5>
                        <p class="d3x-text-gray mt-3 align-middle">{{ data.description }}</p>
                    </div>
                    <div class="text-center my-3 col-lg-4">
                        <h5 class="ms-2 float-end" style="display: inline;  vertical-align: super;">
                            <span class="row  mb-1">
                                <a class="float-end link-dark" target="_blank" :href="data.tokenInfoUrl"><icon-home /></a>
                            </span>
                            <span class="row mb-1">
                                <a class="float-end link-dark " target="_blank"
                                   :href="`https://explorer.radixdlt.com//#/tokens/${data.analytics.token.rri}`"><icon-external-link /></a>
                            </span>
                        </h5>
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
                            <code class="">{{ displayCurrency0(data.analytics.valuation) }}</code> <span> XRD</span>
                        </info-column>
                        <info-column>
                            <template v-slot:header>Pooled Liquidity</template>
                            <div class="row">
                                <span v-if="data.analytics.liquidityA">
                                    <code class="">{{
                                            displayCurrency0(data.analytics.liquidityA)
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
                            <span> XRD</span>
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
                            <template v-slot:header>Price, XRD</template>
                            <code class="">{{ displayCurrency(data.analytics.price) }}</code>
                        </info-column>
                    </div>
                </div>
                <div v-if="symbol && symbol !== 'XRD'" class="row text-center shadow-sm py-2 mx-auto">
                    <div class="text-center my-3 col-xl-8">
                        <TVChartContainer :symbol="symbol" />
                    </div>
                    <div class="text-center col-xl-4" style="">
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
                                    <span v-if="data.poolAccount" class="d-inline-block float-end">
                                        <span class="badge bg-info ms-1">{{ util.shortAddress(data.poolAccount) }}</span>
                                        &nbsp;<button-copy clazz="white float-end" :value="data.poolAccount" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center g-5">
                            <swap-widget v-if="swapModel" :params="swapModel" :symbol="symbol"
                                         @on-update-model="onParamsUpdate" />
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

.bell-icon-off {
    background-color: transparent;
}
.bell-icon-on {
    background-color: transparent;
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

export default  defineComponent({
    components: {
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
            data: {} as TokenDetailsDto,
            notificationsEnabled: false,

            swapModel: null as never as SwapModel,

            statusInterval: null as ReturnType<typeof setInterval> | null,
        }
    },
    props: {},
    async mounted() {
        this.initState(this.$route.query.symbol as string);
        this.SwapEventStore.subscribe(this.onNewSwap);
        this.statusInterval = setInterval(this.loadData, 15000);
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
        getQueryParams(): TokenInfoModel {
            const qp: TokenInfoModel = {};
            if (this.symbol) {
                qp.symbol = this.symbol;
            }
            return qp;
        },
        async loadData() {
            this.data = await API.get(`/api/token-details.json?symbol=${this.symbol}`);
        },
        onNewSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            const swap: TokenSwapDto = state.lastSwap;
            if (swap.tokenFrom === this.symbol || swap.tokenTo === this.symbol) {
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
