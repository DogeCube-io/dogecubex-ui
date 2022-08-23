<template>
    <div v-if="!longAnalytics" class="row va-mid">
        <div class="col">
            Swaps&nbsp;(24h): <code>{{ data.day ? displayCurrencyShort(data.day.count) : '--' }}</code>
        </div>
        <div class="col">
            Volume&nbsp;(24h): <code>{{ data.day ? displayCurrencyShort(data.day.volume) : '--' }}</code>&nbsp;{{ loadedCurrency }}
        </div>
        <div class="col">
            Swaps&nbsp;(7d): <code>{{ data.week ? displayCurrencyShort(data.week.count) : '--' }}</code>
        </div>
        <div class="col">
            Volume&nbsp;(7d): <code>{{ data.week ? displayCurrencyShort(data.week.volume) : '--' }}</code>&nbsp;{{ loadedCurrency }}
        </div>
    </div>
    <div v-else class="row va-mid">
        <div class="col">
            Swaps&nbsp;(24h): <code>{{ data.day ? displayCurrencyShort(data.day.count) : '--' }}</code>
        </div>
        <div class="col">
            Volume&nbsp;(24h): <code>{{ data.day ? displayCurrencyShort(data.day.volume) : '--' }}</code>&nbsp;{{ loadedCurrency }}
        </div>
        <div class="col">
            Swaps&nbsp;(Total): <code>{{ data.total ? displayCurrencyShort(data.total.count) : '--' }}</code>
        </div>
        <div class="col">
            Volume&nbsp;(Total): <code>{{ data.total ? displayCurrencyShort(data.total.volume) : '--' }}</code>&nbsp;{{ loadedCurrency }}
        </div>
    </div>
    <div class="row va-mid mt-2">
        <div class="col-12">
            Total Liquidity: &nbsp;<code>{{ data.liquidity ? displayCurrencyShort(data.liquidity) : '--' }}</code> {{ loadedCurrency }}
        </div>
    </div>
</template>

<script lang="ts">
import type { AnalyticsSummaryV2Dto, TokenSwapDto } from "../../env";
import API from "@/util/API";
import type { UnwrapRef } from "vue";
import { defineComponent } from "vue";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import { useSettingsStore } from "@/stores/SettingsStore";
import Utils from "@/util/Utils";

export default defineComponent({
    components: {},
    data() {
        return {
            loadedCurrency: "XRD",
            data: {} as AnalyticsSummaryV2Dto,
            longAnalytics: false,

            statusInterval: null as ReturnType<typeof setInterval> | null,
        }
    },
    async mounted() {
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
            this.data = await API.get(`/api/analytics/summary-v2.json?currency=${currency}`) as AnalyticsSummaryV2Dto;
            this.loadedCurrency = currency;
            this.longAnalytics = Math.round(Date.now() / 30000) % 2 === 0;
        },
        onNewSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            this.loadData();
        },
        onCurrencyChange(state: UnwrapRef<{ analyticsCurrency: string }>) {
            this.loadData();
        },
        displayCurrencyShort(num: number) {
            return Utils.displayCurrencyShort(num);
        },
    },
    computed: {
        SwapEventStore() {
            return useSwapEventStore();
        },
        SettingsStore() {
            return useSettingsStore();
        },
        currency(): string {
            return this.SettingsStore.analyticsCurrency;
        },
    },
    watch: {},
});
</script>

<style>

</style>
