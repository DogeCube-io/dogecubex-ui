<template>
    <TheHeader active-page="HowTo" :show-images="true" />
    <main>
        <div class="px-4 my-5">
            <h1 class="display-6 fw-bold">&nbsp;</h1>
            <div class="mx-auto container d3x-text-white">
                <div class="me-md-3 px-3 overflow-hidden">
                    <div class="my-3 py-3">
                        <h2 class="display-5 text-white text-center">How To Swap</h2>
                    </div>
                    <div class="my-2 py-1">
                        <p class="lead text-white">1. Selling a specific amount of tokens</p>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            Simply send your tokens to the Pool Account. All your sent tokens will be exchanged to the
                            another token in the pool at the current Pool price.<br>
                            Be sure to first run through the calculator on the <RouterLink to="/swap">Swap</RouterLink> page.
                        </div>
                    </div>
                    <div class="my-2 py-1">
                        <p class="lead text-white">2. Buying a specific amount of tokens</p>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            Go to the Calculator on the <RouterLink to="/swap">Swap</RouterLink> page and enter the amount you would
                            like to receive in the second <code>To</code> field.<br>
                            Copy the amount from the bottom of the form and send it to the Pool Account.<br>
                            <b>The drawback here</b> is that any swaps happening before you send your transaction may
                            change the price and your actual received amount may differ.<br>
                            To make sure that you receive an exact amount see #3.
                        </div>
                    </div>
                    <div class="my-2 py-1">
                        <p class="lead text-white">3. Swapping for an exact amount</p>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            Open the Settings on the <RouterLink to="/swap">Swap</RouterLink> page and increase <code>Slippage
                            tolerance</code>, for example, to <code>5 %</code>.<br>
                            Enter the amount you would like to receive in the second <code>To</code> field. Note that
                            now the amount that you need to send is slightly higher and accounts for the slippage
                            tolerance you've adjusted above.<br>
                            Send a transaction with <b>both the amount and the message</b> copied from the bottom of the
                            form. Do not encrypt the message!<br>
                            In response, you will receive the desired token amount <b>and the unused remainder</b> of
                            your sent tokens.<br>
                            If the price moves unfavorably just before you send the transaction and your sent amount is
                            not enough to buy the exact number of tokens - you will receive a refund (minus Transfer
                            Fee).
                        </div>
                    </div>
                    <div class="my-2 py-1">
                        <p class="lead text-white">4. Swapping for at least a specific amount</p>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            Similarly to the above, you can set <code>Slippage tolerance</code> and then enter the
                            amount you would like to sell in the first <code>From</code> field.<br>
                            Then send a transaction with the desired minimum amount in the message. All your sent amount
                            will be swapped, or you will receive a refund for the full amount.
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <img src="/image/swap-ui.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>
</template>

<style>
</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import { defineComponent } from "vue";

export default defineComponent({
    components: {TheHeader},
    props: {},
    computed: {},
});
</script>
