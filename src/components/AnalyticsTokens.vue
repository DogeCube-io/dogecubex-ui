<template>
    <table id="tokens" class="table table-striped">
        <thead>
        <tr>
            <th scope="col">&nbsp;</th>
            <th-sort class="text-start" field="name" :sort-order="sortOrder" @updateSort="updateSort">Name</th-sort>
            <th-sort colspan="2" field="liquidity" :sort-order="sortOrder" @updateSort="updateSort">Liquidity</th-sort>
            <th-sort field="volume24h" :sort-order="sortOrder" @updateSort="updateSort">
                Volume (24h), {{ loadedCurrency }}
            </th-sort>
            <th-sort field="volume7d" :sort-order="sortOrder" @updateSort="updateSort">
                Volume (7d), {{ loadedCurrency }}
            </th-sort>
            <th scope="col">&nbsp;</th>
            <th-sort field="price" :sort-order="sortOrder" @updateSort="updateSort">
                Price, {{ loadedCurrency }}
            </th-sort>
            <th-sort field="priceChange24h" :sort-order="sortOrder" @updateSort="updateSort">
                <span>Δ</span><sub>Price</sub> (24h)
            </th-sort>
            <th-sort field="priceChange7d" :sort-order="sortOrder" @updateSort="updateSort">
                <span>Δ</span><sub>Price</sub> (7d)
            </th-sort>
            <th-sort field="valuation" :sort-order="sortOrder" @updateSort="updateSort"
            >FDV <span data-bs-toggle="tooltip" data-bs-placement="left" title="Fully Diluted Valuation"><icon-question /></span>,
                {{ loadedCurrency }}
            </th-sort>
            <th scope="col">
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(token, idx) in data" v-bind:key="token.token.symbol">
            <th scope="row">{{ idx + 1 }}</th>
            <td class="text-start">
                <RouterLink class="link-dark d3x-no-underline"
                            :to="{ path: '/info', query: {symbol: token.token.symbol} }">
                    <img class="me-1" style="width:24px;height:24px;" :alt="token.token.symbol"
                         :src="token.token.iconUrl">
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
import type { AnalyticsSort, TokenAnalyticsDto, TokenSwapDto } from "../../env";
import IconQuestion from "@/components/icons/IconQuestion.vue";
import Utils from "@/util/Utils";
import PriceChange from "@/components/sub/PriceChange.vue";
import Tooltip from "bootstrap/js/dist/tooltip";
import IconGraphUp from "@/components/icons/IconGraphUp.vue";
import API from "@/util/API";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import type { UnwrapRef } from "vue";
import { defineComponent } from "vue";
import { useSettingsStore } from "@/stores/SettingsStore";
import { useActiveStateStore } from "@/stores/ActiveStateStore";
import ThSort from "@/components/sub/ThSort.vue";

const initialSortAsc = {
    "name": true
} as Record<string, boolean | null>;

const defaultSort = {field: "volume7d", asc: false} as AnalyticsSort;

export default defineComponent({
    components: {ThSort, IconGraphUp, PriceChange, IconQuestion},
    data() {
        return {
            loadedCurrency: "XRD",
            data: [] as TokenAnalyticsDto[],
            sortOrder: defaultSort,

            statusInterval: null as ReturnType<typeof setInterval> | null,
        }
    },
    async mounted() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl);
        })

        this.sortOrder = this.ActiveStateStore.analyticsSortOrder || defaultSort;
        this.loadData();

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
        async loadData() {
            const currency = this.currency;
            const data = await API.get(`/api/analytics/tokens.json?currency=${currency}`) as (TokenAnalyticsDto & Record<string, number>)[] || [];
            if (this.sortOrder.field !== defaultSort.field || this.sortOrder.asc !== defaultSort.asc) {
                this.sortData(data);
            } else {
                this.data = data;
            }
            this.loadedCurrency = currency;
        },
        sortData(data: TokenAnalyticsDto[]) {
            const sortField = this.sortOrder.field === "liquidity" ? "liquidityB" : this.sortOrder.field
            const asc = this.sortOrder.asc;
            (data as (TokenAnalyticsDto & Record<string, number>)[]).sort((a, b) => {
                const val = sortField === "name"
                    ? (a.token.name > b.token.name ? 1 : -1)
                    : (a[sortField] as number - b[sortField] as number);
                return asc ? val : -val;
            });
            this.data = data;
        },
        displayCurrency(amount: string | number) {
            return Utils.displayCurrency(amount);
        },
        displayCurrency0(amount: string | number) {
            return Utils.displayCurrency0(amount);
        },
        onNewSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            this.loadData();
        },
        onCurrencyChange(state: UnwrapRef<{ analyticsCurrency: string }>) {
            this.loadData();
        },
        updateSort(field: string) {
            const sortOrder = {
                field: field,
                asc: this.sortOrder.field === field ? !this.sortOrder.asc : !!initialSortAsc[field]
            };
            this.ActiveStateStore.setAnalyticsSort(sortOrder);
            this.sortOrder = sortOrder;
            this.sortData(this.data);
        }
    },
    computed: {
        ActiveStateStore() {
            return useActiveStateStore();
        },
        SwapEventStore() {
            return useSwapEventStore();
        },
        SettingsStore() {
            return useSettingsStore();
        },
        currency(): string {
            return this.SettingsStore.analyticsCurrency;
        },
    }

});
</script>

<style>
#tokens th.sort:hover {
    cursor: pointer;
}
</style>
