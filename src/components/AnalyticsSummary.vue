<template>
    <div class="row">
        <div class="col">
            Swaps&nbsp;(24h): <code>{{ data.day ? data.day.count : '--' }}</code>
        </div>
        <div class="col">
            Volume&nbsp;(24h): <code>{{ data.day ? data.day.volume : '--' }}</code>&nbsp;XRD
        </div>
        <div class="col">
            Swaps&nbsp;(7d): <code>{{ data.week ? data.week.count : '--' }}</code>
        </div>
        <div class="col">
            Volume&nbsp;(7d): <code>{{ data.week ? data.week.volume : '--' }}</code>&nbsp;XRD
        </div>
    </div>
</template>

<script lang="ts">
import type { AnalyticsSummaryDto, TokenSwapDto } from "../../env";
import API from "@/util/API";
import type { UnwrapRef } from "vue";
import { defineComponent } from "vue";
import { useSwapEventStore } from "@/stores/SwapEventStore";

export default defineComponent({
    components: {},
    data() {
        return {
            data: {} as AnalyticsSummaryDto,

            statusInterval: null as ReturnType<typeof setInterval> | null,
        }
    },
    async mounted() {
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
            this.data = await API.get("/api/analytics/summary.json") as AnalyticsSummaryDto;
        },
        onNewSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            this.loadData();
        },
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
