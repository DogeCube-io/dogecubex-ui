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
        <tr v-for="swap in data" v-bind:key="`${swap.tokenFrom}-${swap.tokenTo}-${swap.dateAdded}`">
            <td class="text-start">
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
import { UnwrapRef } from "vue";

export default {
    components: {},
    props: {
        symbol: {
            type: String,
            required: false
        },
    },
    data() {
        return {
            data: [] as TokenSwapDto[],

            statusInterval: null,
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
            const url = `/api/analytics/swaps.json` + (this.symbol && this.symbol !== "XRD" ? "?symbol=" + this.symbol : "");
            this.data = await API.get(url) as TokenSwapDto[] || [];
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
    },

}
</script>

<style>

</style>
