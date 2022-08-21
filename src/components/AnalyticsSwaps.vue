<template>
    <table id="swaps" class="table table-striped">
        <thead>
        <tr>
            <th scope="col">&nbsp;</th>
            <th scope="col">Sent Amount</th>
            <th scope="col">Received Amount</th>
            <th scope="col">Account</th>
            <th scope="col">Time ↓</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="swap in data" v-bind:key="`${swap.tokenFrom}-${swap.tokenTo}-${swap.txIn.substring(0, 8)}-${swap.txOut.substring(0, 8)}`">
            <td class="text-start">
                <span v-if="!isSingleSymbol" class="me-1">
                    <RouterLink class="link-dark" :to="{ path: '/info', query:
                            {symbol:  swap.tokenFrom !== 'XRD' ? swap.tokenFrom : swap.tokenTo} }"> <icon-details/>
                    </RouterLink>
                </span>
                Swap
                <a target="_blank"
                   :href="'https://explorer.radixdlt.com/#/transactions/' + swap.txIn">{{ swap.tokenFrom }}</a>
                to
                <a target="_blank"
                   :href="'https://explorer.radixdlt.com/#/transactions/' + swap.txOut">{{ swap.tokenTo }}</a>
            </td>
            <td>{{ displayCurrency(swap.amountFrom) + ' ' + swap.tokenFrom }}</td>
            <td>{{ displayCurrency(swap.amountTo) + ' ' + swap.tokenTo }}</td>
            <td>
                <a target="_blank" :href="'https://explorer.radixdlt.com/#/accounts/' + swap.user">
                    {{ shortAddress(swap.user) }}
                </a>
            </td>
            <td>{{ swap.timeAgo }}</td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import type { TokenSwapDto } from "../../env";
import Utils from "@/util/Utils";
import API from "@/util/API";
import { useSwapEventStore } from "@/stores/SwapEventStore";
import type { UnwrapRef } from "vue";
import { defineComponent } from "vue";
import IconDetails from "@/components/icons/IconDetails.vue";

export default defineComponent({
    components: {IconDetails},
    props: {
        symbol: {
            type: String,
            required: false
        },
    },
    data() {
        return {
            data: [] as TokenSwapDto[],
            dataLoaded: false,

            statusInterval: null as ReturnType<typeof setInterval> | null,
        }
    },
    async mounted() {
        this.loadData();
        this.SwapEventStore.subscribe(this.onNewSwap);
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
            const url = `/api/analytics/swaps.json` + (this.isSingleSymbol ? "?symbol=" + this.symbol : "");
            const promise = API.get(url);
            this.dataLoaded = true;
            this.data = await promise as TokenSwapDto[] || [];
        },
        onNewSwap(state: UnwrapRef<{ lastSwap: TokenSwapDto }>) {
            const swap: TokenSwapDto = state.lastSwap;
            if (!this.symbol || swap.tokenTo === this.symbol || swap.tokenFrom === this.symbol) {
                this.loadData();
            }
        },
        displayCurrency(amount: string | number) {
            return Utils.displayCurrency(amount);
        },
        shortAddress(address: string) {
            return Utils.shortAddress(address);
        },
    },
    computed: {
        SwapEventStore() {
            return useSwapEventStore();
        },
        isSingleSymbol() {
            return this.symbol && this.symbol !== "XRD";
        },
    },
    watch: {
        symbol(newVal, oldVal) {
            if (oldVal !== newVal && this.dataLoaded) {
                this.loadData();
            }
        }
    }

});
</script>

<style>

</style>
