<template>
    <TheHeader active-page="Swap" :show-images="true" />
    <main>
        <div class="px-4 my-5 text-center">
            <img class="d-block mx-auto mb-4 hero-image" style="height: 128px;" :src="heroImageFullUrl" alt="">
            <div class="col-lg-6 mx-auto container d3x-text-white">
                <div class="row">
                    <div id="pool-select-parent" class="col-12">
                        <pool-selector v-model="selectedPool"
                                       :initial-selection="selectedPoolSymbol" @onPoolSelected="poolChanged" />
                    </div>
                </div>
                <div class="row justify-content-center py-2 g-5">
                    <div class="col-12" style="max-width: 450px;">
                        <span>Trading Engine: </span>
                        <status-widget :symbol="selectedPoolSymbol" :refresh-interval="3000" />
                    </div>
                </div>
                <div class="row justify-content-center pb-2 g-5" v-show="selectedPool && selectedPool.account">
                    <div v-if="selectedPool" class="col-12" style="max-width: 450px;">
                        <span class="float-start">Pool account: </span>
                        <span class="d-inline-block float-end js-click-parent">
                            <copy-trigger class="badge bg-info ms-1">
                                {{ util.shortAddress(selectedPool.account) }}
                            </copy-trigger>
                            &nbsp;<button-copy clazz="white float-end" :value="selectedPool.account" />
                        </span>
                    </div>
                </div>

            </div>
            <div class="col-lg-6 mx-auto container ">
                <div class="row justify-content-center g-5">
                    <swap-widget v-if="queryParams" :params="queryParams"
                                 @on-update-model="onParamsUpdate" :symbol="selectedPoolSymbol"
                                 :pool-account="selectedPool && selectedPool.account || ''"
                                 :token-rri="selectedPool && selectedPool.token.rri || ''" />
                </div>
            </div>
        </div>
    </main>
</template>

<style>
.swap-panel {
    background-color: #dedede;
    border-radius: 5px;
    color: black;
    padding: 10px;
}

.swap-panel h5 {
    color: black;
    margin-bottom: 20px;
}

.arrow-down {
    display: inline;
    margin-top: -21px;
    margin-left: -20px;
    position: absolute;
}

.change-direction {
    display: inline;
    margin-top: -20px;
    margin-left: 70px;
    position: absolute;
    z-index: 10;
    padding: 0 3px 2px 3px;
    border: black 1px solid;
}

.change-direction:focus {
    box-shadow: none;
}

.swap-settings {
    display: inline;
    z-index: 10;
    padding: 0 3px 2px 3px;
    border: black 1px solid;
}

.swap-settings:focus {
    box-shadow: none;
}

.price-row {
    background-color: #fefefe;
    border-radius: 3px;
    padding: 5px 0 5px;
    margin: 0 0 5px;
}

.message-row .alert {
    margin-left: 12px;
    width: calc(100% - 24px);
}

.input-group-text.token-name {
    min-width: 70px;
}

input[type="range"] {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    background-image: linear-gradient(#0095ff, #0095ff);
    background-size: 0 100%;
    background-repeat: no-repeat;
    height: 10px;
}

input[type=range]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
}

input[type=range]::-moz-range-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
}

input[type="range"]::-ms-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
}

#pool-select-parent {
    min-height: 57px;
}

#swap-message-prompt div:first-child {
    padding-right: 27px;
}

</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import type { AmmConfigDto, PoolInfoDto, SwapModel } from "../../env";
import Utils from "../util/Utils";
import ButtonCopy from "@/components/sub/ButtonCopy.vue";
import { useAmmConfigStore } from "@/stores/AmmConfigStore";
import PoolSelector from "@/components/PoolSelector.vue";
import StatusWidget from "@/components/StatusWidget.vue";
import SwapWidget from "@/components/SwapWidget.vue";
import Models from "@/util/Models";
import { useActiveStateStore } from "@/stores/ActiveStateStore";
import { defineComponent } from "vue";
import CopyTrigger from "@/components/sub/CopyTrigger.vue";

export default defineComponent({
    components: {
        CopyTrigger,
        SwapWidget, StatusWidget, PoolSelector, ButtonCopy, TheHeader
    },
    data() {
        return {
            selectedPool: null as never as PoolInfoDto,

            swapModel: null as never as SwapModel,
            queryParams: null as never as SwapModel,
        };
    },
    props: {},
    mounted() {
        const query = Models.swapModel(this.$route.query);

        if (!query.to && !query.from) {
            const symbol = this.ActiveStateStore.lastSymbol || "DGC";
            const mode = this.ActiveStateStore.mode;
            if (mode === "SELL") {
                query.from = symbol;
            } else {
                query.to = symbol;
            }
        }
        if (!query.amount && !query.xrd) {
            const symbol = query.from || query.to || "";
            const lastInput = this.ActiveStateStore.lastInputs[symbol];
            if (lastInput && lastInput.amount) {
                query.amount = String(lastInput.amount);
            } else {
                query.xrd = this.ActiveStateStore.xrd || "100";
            }
        }
        this.queryParams = query;
    },
    methods: {
        poolChanged() {
            if (!this.selectedPool) {
                return;
            }
            if (this.queryParams.to) {
                const query = this.getQueryParams(this.queryParams);
                query.to = this.selectedPool.token.symbol;
                this.updateInputs(query, query.to);
                this.queryParams = query;
            } else if (this.queryParams.from) {
                const query = this.getQueryParams(this.queryParams);
                query.from = this.selectedPool.token.symbol;
                this.updateInputs(query, query.from);
                this.queryParams = query;
            }
        },
        updateInputs(query: SwapModel, symbol: string) {
            const lastInput = this.ActiveStateStore.lastInputs[symbol];
            if (lastInput) {
                if (lastInput.xrd) {
                    query.xrd = String(this.ActiveStateStore.xrd || lastInput.xrd); // ? is this possible ?
                } else {
                    delete query.xrd;
                }
                if (lastInput.amount) {
                    query.amount = String(lastInput.amount);
                } else {
                    delete query.amount;
                }
            }
        },
        onParamsUpdate(params: SwapModel) {
            this.queryParams = params;
        },
        getQueryParams(swapModel: SwapModel): SwapModel {
            return Models.swapModel(swapModel);
        },
    },
    computed: {
        selectedPoolSymbol(): string {
            if (!this.selectedPool) {
                if (this.queryParams && this.queryParams.from) {
                    return this.queryParams.from;
                }
                if (this.queryParams && this.queryParams.to) {
                    return this.queryParams.to;
                }
                return "DGC";
            }
            return this.selectedPool.token.symbol;
        },
        heroImageFullUrl(): string {
            if (!this.selectedPool) {
                return "";
            }
            const heroImg = this.selectedPool.heroImageUrl;
            if (!heroImg) {
                return "";
            }
            return heroImg.startsWith("http") ? heroImg : "https://dogecubex.b-cdn.net" + heroImg;
        },
        util() {
            return Utils;
        },
        ActiveStateStore() {
            return useActiveStateStore();
        },
        AmmConfigStore() {
            return useAmmConfigStore();
        },
        config(): AmmConfigDto {
            return this.AmmConfigStore.config || {};
        },
    },
    watch: {
        queryParams(newVal) {
            const queryParams = this.getQueryParams(newVal);
            const symbol = queryParams.from || queryParams.to || "";
            this.ActiveStateStore.setState(symbol, queryParams.from ? "SELL" : "BUY");
            this.ActiveStateStore.setAmount(symbol, queryParams.amount, queryParams.xrd);
            this.$router.replace({query: queryParams});
        },
        "$route.query": function (q) {
            this.queryParams = Models.swapModel(q);
        },
    }
});
</script>
