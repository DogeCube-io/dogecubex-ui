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
import type { AnalyticsSummaryDto } from "../../env";

export default {
    components: {},
    data() {
        return {
            data: {} as AnalyticsSummaryDto,

            statusInterval: null,
        }
    },
    async mounted() {
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
        async loadData() {
            this.data = await (await fetch(`/api/analytics/summary.json`, {cache: "no-store"})).json() as AnalyticsSummaryDto;
        },
    },

}
</script>

<style>

</style>
