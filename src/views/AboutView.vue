<template>
    <TheHeader active-page="About" :show-images="true" />
    <main>
        <div class="px-4 my-5 text-center about">
            <h1 class="display-6 fw-bold">&nbsp;</h1>
            <div class="mx-auto container d3x-text-white">
                <div class="my-3 py-3">
                    <h2 class="display-5 text-white text-center">About</h2>
                </div>
                <div class="shadow-sm mx-auto py-3 px-md-5" style="border-radius: 21px 21px 0 0;">
                    <div class="row">
                        <div class="col-12">
                            DogeCubeX is a Centralized DEX on Radix Network that allows you to buy and sell listed
                            tokens directly from your Radix Wallet.<br>
                            It employs an Automated Market Maker (AMM) mechanism to offer you a price dynamically based
                            on your order size and current market conditions.<br>
                            All transactions happen on-ledger, and your tokens are in transit only for a short amount of
                            time.<br>
                            <br>
                        </div>
                        <div class="col-12">
                            To swap, you simply send the tokens to the specified Pool Address, and within 5 seconds
                            DogeCubeX sends swapped tokens back to you.<br>
                            The exchange rate is determined by a simple formula (same as Uniswap v2), depending on the
                            sent amount and available liquidity.<br>
                            When you send tokens, you can optionally add a message that will determine refund<code><sup>*</sup></code>
                            conditions in case of a rapid price change -
                            see <RouterLink to="/info">How To Swap</RouterLink> and the <RouterLink to="/swap"
                        >Swap Calculator</RouterLink> itself.<br>
                        </div>
                        <div class="col-12">
                            <br>
                            You can find more details and join the discussion in this thread
                            on <a href="https://radixtalk.com/t/dogecubex-the-first-amm-on-radix/1035" target="_blank">RadixTalk</a>.
                        </div>
                    </div>

                    <div class="accordion my-5" id="infos">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="info-fees">
                                <button class="accordion-button" :class="!feesExpanded ? 'collapsed' : ''" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#fees" :aria-expanded="feesExpanded" aria-controls="fees">
                                    <code><sup>*</sup></code>Fees
                                </button>
                            </h2>
                            <div id="fees" class="accordion-collapse collapse" :class="feesExpanded ? 'show' : ''" aria-labelledby="info-fees"
                                 data-bs-parent="#infos">
                                <div class="accordion-body">
                                    Typically, the fee applied to each swap consists of three parts:
                                    <ol>
                                        <li><strong>Pool Fee</strong> (<code>0.5 %</code>) - the reward to liquidity
                                            providers for supplying tokens to the pool.
                                        </li>
                                        <li><strong>Exchange Fee</strong> (<code>{{ config.exchangeFee }} %</code>) - supports the
                                            functioning of this Exchange.
                                        </li>
                                        <li><strong>Transfer Fee</strong> (<code>{{ config.swapTransferFeeXrd }} XRD</code>) - covers
                                            the Radix Network fee for the transfer(s) back to the Customer.
                                        </li>
                                    </ol>
                                    If the swap fails and the user gets refunded (e.g., the price suddenly changes and
                                    the sent amount is not enough to buy the amount specified in the user's message) -
                                    only a Transfer Fee is applied.<br>
                                    If swap fails at the user's fault (sending an encrypted message, asking for a token
                                    not in the pool, sending a too high amount, etc.) - a Refund Fee of
                                    <code>{{ config.swapRefundFeeXrd }} XRD</code>
                                    is applied to the refunded amount.<br>
                                    <!--                                For buy orders, the fees are applied to the sent XRD amount; for sell orders, the fees are applied to the XRD amount sent back to the user.-->
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="info-rules">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#rules" aria-expanded="false" aria-controls="rules">
                                    <code><sup>*</sup></code>Exchange Limitations
                                </button>
                            </h2>
                            <div id="rules" class="accordion-collapse collapse" aria-labelledby="info-rules"
                                 data-bs-parent="#infos">
                                <div class="accordion-body">
                                    To prevent spamming with tiny transactions, minimum order is: <code>{{ config.minOrderSize }} XRD</code>.<br>
                                    The maximum order is limited to: <code>{{ config.maxOrderSize - 10 }} XRD</code>. DogeCube Node
                                    stakers enjoy increased <RouterLink to="/stakers">order limits</RouterLink>.<br>
                                    Incoming orders outside these boundaries will be refunded and additional fee applied
                                    (see Fees), however if you want to swap more you can just spit into several transactions.<br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style>
.about .accordion-body {
    color: #ddd;
}
</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import { useAmmConfigStore } from "@/stores/AmmConfigStore";
import type { AmmConfigDto } from "../../env";
import { defineComponent } from "vue";

export default defineComponent({
    components: {TheHeader},
    props: {},
    data() {
        return {
            feesExpanded: false,
        }
    },
    mounted() {
        this.feesExpanded = this.$route.hash === "#info-fees";
    },
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
