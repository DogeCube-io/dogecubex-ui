<template>
    <TheHeader active-page="Chart" :show-images="true" />
    <main class="container-xxl">
        <div class="my-5 text-center">
            <div class="row">
                <div class="col-lg-3"></div>
                <div id="pool-select-parent" class="col-lg-6">
                    <pool-selector v-model="selectedPool" :initial-selection="symbol" @onPoolSelected="poolChanged" />
                </div>
                <div class="col-lg-3"></div>
            </div>
            <br>
            <TVChartContainer v-if="symbol" :symbol="symbol" />
        </div>
    </main>
</template>

<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import TVChartContainer from "@/components/TVChartContainer.vue";
import PoolSelector from "@/components/PoolSelector.vue";
import type { PoolInfoDto } from "../../env";
import IconDetails from "@/components/icons/IconDetails.vue";
import { useActiveStateStore } from "@/stores/ActiveStateStore";

export default {
    name: 'app',
    components: {IconDetails, TheHeader, TVChartContainer, PoolSelector},
    data() {
        return {
            symbol: "",
            currency: "",
            selectedPool: <PoolInfoDto><any>null,
        };
    },
    mounted() {
        this.symbol = this.$route.query.symbol;
        this.currency = this.$route.query.currency;

        if (!this.symbol) {
            this.symbol = this.ActiveStateStore.lastSymbol || "DGC";
        } else {
            this.ActiveStateStore.setSymbol(this.symbol);
        }
    },
    methods: {
        getQueryParams() {
            const qp = {};
            if (this.symbol) {
                qp.symbol = this.symbol;
            }
            if (this.currency) {
                qp.currency = this.currency;
            }
            return qp;
        },
        poolChanged() {
            this.symbol = this.selectedPool.token.symbol;
        },
    },
    computed: {
        ActiveStateStore() {
            return useActiveStateStore();
        },
    },
    watch: {
        symbol(newVal) {
            const queryParams = this.getQueryParams();
            if (newVal) {
                queryParams.symbol = newVal;
            }
            this.ActiveStateStore.setSymbol(queryParams.symbol);
            this.$router.replace({ query: queryParams });
        },
        currency(newVal) {
            const queryParams = this.getQueryParams();
            if (newVal) {
                queryParams.currency = newVal;
            }
            this.$router.replace({ query: queryParams });
        },
        "$route.query": function(q) {
            this.symbol = q.symbol;
            this.currency = q.currency;
        },
    }
}
</script>

<style lang="scss" scoped>
.app {
    text-align: center;

    &__header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        background-color: #222;
        color: #fff;
    }

    &__title {
        display: block;
        font-size: 1.5em;
    }
}

.TVChartContainer {
    height: calc(100vh - 200px);
    min-height: 350px;
}

</style>
