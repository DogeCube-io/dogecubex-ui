<template>
    <TheHeader active-page="FAQ" :show-images="true" />
    <main>
        <div class="px-4 my-5 text-center">
            <h1 class="display-6 fw-bold">&nbsp;</h1>
            <div class="mx-auto container d3x-text-white">
                <div class="my-3 py-3">
                    <h2 class="display-5 text-white text-center">FAQs</h2>
                </div>
                <div class="shadow-sm mx-auto py-3" style="width: 80%;border-radius: 21px 21px 0 0;">
                    <div class="accordion" id="infos">
                        <div class="accordion-item" v-for="(faq, index) in FAQs" v-bind:key="index">
                            <h2 class="accordion-header" :id="'info-r' + index">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        :data-bs-target="'#r' + index" :aria-controls="'r' + index"
                                        aria-expanded="false">{{ faq.q }}
                                </button>
                            </h2>
                            <div :id="'r' + index" class="accordion-collapse collapse"
                                 :aria-labelledby="'info-r' + index" data-bs-parent="#infos">
                                <div class="accordion-body" v-html="faq.a">
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
.accordion-body {
    color: #ddd;
}
</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import type { AmmConfigDto } from "../../env";
import { useAmmConfigStore } from "@/stores/AmmConfigStore";
import { defineComponent } from "vue";

export default  defineComponent({
    components: {TheHeader},
    data() {
        return {
            FAQs: [
                {
                    q: "How to list my Token?",
                    a: "Representatives of the project's Team can contact Benedetto <a href=&quot;https://t.me/BenGoch&quot;>@BenGoch</a> or Mr. Peanutbutter <a href=&quot;https://t.me/ALFRED_DULAiRE&quot;>@ALFRED_DULAiRE</a> to check if your Project meets the minimum requirements and discuss the details.",
                }, {
                    q: "How to add liquidity?",
                    a: "As any added liquidity needs to reside in the DogeCubeX hot wallet, adding liquidity is not supported at this time.",
                }, {
                    q: "I've got refunded but received less than I've sent",
                    a: "See <a href=&quot;/about#fees&quot;>About -> Fees</a> to learn more about the fees applied to the refunds.",
                },
            ]
        }
    },
    props: {},
    methods: {},
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
