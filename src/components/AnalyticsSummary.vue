<template>
    <div class="row">
        <div class="col">
            Swaps&nbsp;(24h): <code>{{ data.day ? data.day.count : '--' }}</code>
        </div>
        <div class="col">
            Volume&nbsp;(24h): <code>{{ data.day ? data.day.volume : '--' }}</code>&nbsp;{{ loadedCurrency }}
        </div>
        <div class="col">
            Swaps&nbsp;(7d): <code>{{ data.week ? data.week.count : '--' }}</code>
        </div>
        <div class="col">
            Volume&nbsp;(7d): <code>{{ data.week ? data.week.volume : '--' }}</code>&nbsp;{{ loadedCurrency }}
        </div>
    </div>
</template>

<script lang="ts">
import type { AnalyticsSummaryDto, TokenSwapDto } from "../../env";
import API from "@/util/API";
import type { UnwrapRef } from "vue";
import { defineComponent } from "vue";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import { useSettingsStore } from "@/stores/SettingsStore";

export default defineComponent({
    components: {},
    data() {
        return {
            loadedCurrency: "XRD",
            data: {} as AnalyticsSummaryDto,

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
            this.data = await API.get(`/api/analytics/summary.json?currency=${currency}`) as AnalyticsSummaryDto;
            this.loadedCurrency = currency;
        },
        onNewSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            this.loadData();
        },
        onCurrencyChange(state: UnwrapRef<{ analyticsCurrency: string }>) {
            this.loadData();
        },
    },
    computed: {
        SwapEventStore() {
            return useSwapEventStore();
        },
        SettingsStore() {
            return useSettingsStore();
        },
        currency() {
            return this.SettingsStore.analyticsCurrency;
        }
    }

});
</script>

<style>

</style>
