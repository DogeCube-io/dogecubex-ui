<template>
    <table id="tokens" class="table table-striped">
        <thead>
        <tr>
            <th scope="col">&nbsp;</th>
            <th scope="col" class="text-start">Name</th>
            <th scope="col" colspan="2">Liquidity</th>
            <th scope="col">Volume (24h), XRD</th>
            <th scope="col">
                <icon-arrow-down />
                Volume (7d), XRD
            </th>
            <th scope="col">&nbsp;</th>
            <th scope="col">Price, XRD</th>
            <th scope="col"><span>Δ</span><sub>Price</sub> (24h)</th>
            <th scope="col"><span>Δ</span><sub>Price</sub> (7d)</th>
            <th scope="col">FDV <span data-bs-toggle="tooltip" data-bs-placement="left" title="Fully Diluted Valuation"><icon-question /></span>,
                XRD
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(token, idx) in data" v-bind:key="token.token.symbol">
            <th scope="row">{{ idx + 1 }}</th>
            <td class="text-start">
                <RouterLink class="link-dark d3x-no-underline"
                            :to="{ path: '/info', query: {symbol: token.token.symbol} }">
                    <img class="me-1" style="width:24px;height:24px;" :alt="token.token.symbol" :src="token.token.iconUrl">
                    <span>{{ token.token.name }}</span>
                </RouterLink>
            </td>
            <td>{{ displayCurrency0(token.liquidityA) + ' ' + token.token.symbol }}</td>
            <td>{{ displayCurrency0(token.liquidityB) + ' XRD' }}</td>
            <td>{{ displayCurrency0(token.volume24h) }}</td>
            <td>{{ displayCurrency0(token.volume7d) }}</td>
            <td class="tiny">
                <RouterLink class="btn btn-outline-secondary link-dark btn-sm d3x-fs-7"
                            :to="{ path: '/chart', query: {symbol: token.token.symbol} }">
                    <icon-graph-up />
                </RouterLink>
            </td>
            <td>
                <RouterLink class="text-decoration-none" :to="{ path: '/swap', query: {to: token.token.symbol} }">
                    {{ displayCurrency(token.price) }}
                </RouterLink>
            </td>
            <td>
                <price-change :value="token.priceChange24h" />
            </td>
            <td>
                <price-change :value="token.priceChange7d" />
            </td>

            <td>{{ displayCurrency0(token.valuation) }}</td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import type { TokenAnalyticsDto, TokenSwapDto } from "../../env";
import IconArrowDown from "@/components/icons/IconArrowDown.vue";
import IconQuestion from "@/components/icons/IconQuestion.vue";
import Utils from "@/util/Utils";
import PriceChange from "@/components/sub/PriceChange.vue";
import Tooltip from "bootstrap/js/dist/tooltip";
import IconGraphUp from "@/components/icons/IconGraphUp.vue";
import API from "@/util/API";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import type { UnwrapRef } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
    components: {IconGraphUp, PriceChange, IconQuestion, IconArrowDown},
    data() {
        return {
            data: [] as TokenAnalyticsDto[],

            statusInterval: null as ReturnType<typeof setInterval> | null,
        }
    },
    async mounted() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl);
        })
        this.loadData();

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
        async loadData() {
            this.data = await API.get("/api/analytics/tokens.json") as TokenAnalyticsDto[] || [];
        },
        displayCurrency(amount: string | number) {
            return Utils.displayCurrency(amount);
        },
        displayCurrency0(amount: string | number) {
            return Utils.displayCurrency0(amount);
        },
        onNewSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            this.loadData();
        }
    },
    computed: {
        SwapEventStore() {
            return useSwapEventStore();
        },
    }

});
</script>

<style>

</style>
