<template>
    <TheHeader active-page="Tokens" :show-images="true" />
    <main>
        <div class="px-4 my-5 text-center">
            <h1 class="display-6 fw-bold">&nbsp;</h1>
            <div class="mx-auto container d3x-text-white">
                <div class="my-3 py-3">
                    <h2 class="display-5 text-white text-center">Supported Tokens</h2>
                </div>
                <div class="shadow-sm mx-auto py-3" style="border-radius: 21px 21px 0 0;">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Symbol</th>
                            <th scope="col">Name</th>
                            <th scope="col">RRI</th>
                            <th scope="col">Description</th>
                            <th scope="col">Price, XRD</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(token, index) in tokens" v-bind:key="token.symbol">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ token.symbol }}</td>
                            <td>{{ token.name }}</td>
                            <td><a target="_blank" :href="`https://explorer.radixdlt.com//#/tokens/${token.rri}`"
                            >{{ shortRri(token.rri) }}</a></td>
                            <td>{{ token.description }}</td>
                            <td v-if="token.price !== null">
                                <RouterLink :to="`/swap?token=${token.symbol}`">{{ displayCurrency(token.price) }}</RouterLink>
                            </td>
                            <td v-else>N/A</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</template>

<style>
</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import type { TokenDto } from "../../env";
import Utils from "../util/Utils";

export default {
    components: {TheHeader},
    data() {
        return {
            tokens: [] as TokenDto[]
        }
    },
    props: {},
    async mounted() {
        const url = `/api/tokens.json`;
        this.tokens = await (await fetch(url)).json();
    },
    methods: {
        shortRri(rri: string) {
            return Utils.shortRri(rri);
        },
        displayCurrency(amount: string) {
            return Utils.displayCurrency(amount);
        }
    },
    computed: {},
}
</script>
