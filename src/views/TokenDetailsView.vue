<template>
    <TheHeader active-page="Token" :show-images="true" />
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
                        </h5>
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
                    <div class="my-3 col-lg-4">
                        <info-column>
                            <template  v-slot:header>Total Supply</template>
                            <code class="">{{ displayCurrency(data.totalSupply) }}</code> <span> {{ data.symbol }}</span>
                        </info-column>
                        <info-column>
                            <template  v-slot:header>Fully Diluted Valuation</template>
                            <code class="">{{ displayCurrency0(data.analytics.valuation) }}</code> <span> XRD</span>
                        </info-column>
                        <info-column>
                            <template  v-slot:header>Pooled Liquidity</template>
                            <div class="row">
                                <span v-if="data.analytics.liquidityA" >
                                    <code class="">{{ displayCurrency0(data.analytics.liquidityA) }}</code> <span> {{ data.symbol }}</span>
                                </span>
                                <span>
                                    <code class="">{{ displayCurrency0(data.analytics.liquidityB) }}</code> <span> XRD</span>
                                </span>
                            </div>
                        </info-column>
                    </div>
                    <div class="my-3 col-lg-4">
                        <p class="d3x-text-gray align-middle">{{ data.description }}</p>
                    </div>
                    <div class="text-left my-3 col-lg-4">
                        <info-column>
                            <template  v-slot:header>
                                Trading Volume <sup>24h</sup>/<sub>7d</sub>
                            </template>
                            <code class="">{{ displayCurrency0(data.analytics.volume24h) }}</code> /
                            <code class="">{{ displayCurrency0(data.analytics.volume7d) }}</code>
                            <span> XRD</span>
                        </info-column>
                        <info-column>
                            <template  v-slot:header>
                                Price Change <sup>24h</sup>/<sub>7d</sub>
                            </template>
                            <price-change :value="data.analytics.priceChange24h" /> /
                            <price-change :value="data.analytics.priceChange7d" />
                        </info-column>
                        <info-column>
                            <template  v-slot:header>Price, XRD</template>
                            <code class="">{{ displayCurrency(data.analytics.price) }}</code>
                        </info-column>
                    </div>
                </div>
                <div v-if="symbol && symbol !== 'XRD'" class="row text-center shadow-sm py-2 mx-auto">
                    <div class="text-center my-3 col-lg-8">
                        <TVChartContainer :symbol="symbol" />
                    </div>
                    <div class="text-center col-lg-4" style="margin-bottom: auto;  margin-top: auto;">
                        Space Intentionally Left Blank
                    </div>
                </div>
                <div v-if="symbol" class="row text-center shadow-sm py-3     mx-auto">
                    <div class="h5">
                        Recent Swaps
                        <status-widget class="fs-6" :refresh-interval="15000" />
                    </div>
                    <analytics-swaps :symbol="symbol"/>
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

</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import type { TokenDetailsDto } from "../../env";
import Utils from "../util/Utils";
import IconHome from "@/components/icons/IconHome.vue";
import IconExternalLink from "@/components/icons/IconExternalLink.vue";
import PriceChange from "@/components/sub/PriceChange.vue";
import InfoColumn from "@/components/sub/InfoColumn.vue";
import AnalyticsSwaps from "@/components/AnalyticsSwaps.vue";
import StatusWidget from "@/components/StatusWidget.vue";
import TVChartContainer from "@/components/TVChartContainer.vue";
import API from "@/util/API";

export default {
    components: {
        TVChartContainer,
        StatusWidget, AnalyticsSwaps, InfoColumn, PriceChange, IconExternalLink, IconHome, TheHeader},
    data() {
        return {
            symbol: "",
            data: {} as TokenDetailsDto,

            statusInterval: null,
        }
    },
    props: {},
    async mounted() {
        this.symbol = this.$route.query.symbol;

        if (!this.symbol) {
            this.symbol = "DGC";
        }

        this.loadData();
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
        getQueryParams() {
            const qp = {};
            if (this.symbol) {
                qp.symbol = this.symbol;
            }
            return qp;
        },
        async loadData() {
            this.data = await API.get(`/api/token-details.json?symbol=${this.symbol}`);
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
    computed: {},
    watch: {
        symbol(newVal) {
            const queryParams = this.getQueryParams();
            if (newVal) {
                queryParams.symbol = newVal;
            }
            this.$router.replace({query: queryParams});
        },
        "$route.query": function (q) {
            this.symbol = q.symbol;
        },
    },
}
</script>
