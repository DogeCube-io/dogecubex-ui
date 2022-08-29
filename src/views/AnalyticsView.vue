<template>
    <TheHeader active-page="Analytics" :show-images="true" />
    <main>
        <div class="px-1 px-sm-4 my-5 text-center">
            <br>
            <div class="mx-auto container d3x-text-white">
                <div class="my-3">
                    <h4 class="text-white text-center">Analytics
                        <span style="width: 0;" class="float-end">
                            <currency-switcher class="float-end" />
                        </span>
                    </h4>
                </div>
                <div class="shadow-sm mx-auto">
                    <analytics-summary />
                </div>
                <div class="shadow-sm mx-auto py-3">
                    <h5>Tokens</h5>
                    <analytics-tokens />
                </div>

                <div class="shadow-sm mx-auto py-3">
                    <div class="h5">
                        Recent Swaps
                        <status-widget class="fs-6" :refresh-interval="15000" />
                    </div>

                    <analytics-swaps />
                </div>
            </div>
        </div>
    </main>
</template>

<style>
#tokens td {
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
    min-width: 60px;
}

#tokens td.tiny {
    min-width: 5px;
    padding: 6px 0 0 0;
}

#swaps td {
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
    min-width: 60px;
}
</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import { useAmmConfigStore } from "@/stores/AmmConfigStore";
import type { AmmConfigDto } from "../../env";
import AnalyticsSummary from "@/components/AnalyticsSummary.vue";
import AnalyticsTokens from "@/components/AnalyticsTokens.vue";
import StatusWidget from "@/components/StatusWidget.vue";
import AnalyticsSwaps from "@/components/AnalyticsSwaps.vue";
import { defineComponent } from "vue";
import CurrencySwitcher from "@/components/sub/CurrencySwitcher.vue";

export default  defineComponent({
    components: {CurrencySwitcher, AnalyticsSwaps, StatusWidget, AnalyticsTokens, AnalyticsSummary, TheHeader},
    data() {
        return {};
    },
    props: {},
    computed: {
        AmmConfigStore() {
            return useAmmConfigStore();
        },
        config(): AmmConfigDto {
            return this.AmmConfigStore.config || {};
        },
    },
});
</script>
