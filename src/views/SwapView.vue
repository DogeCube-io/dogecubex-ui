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
                <div class="row justify-content-center py-2 g-5" v-show="selectedPool && selectedPool.account">
                    <div v-if="selectedPool" class="col-12" style="max-width: 450px;">
                        <span class="float-start">Pool account: </span>
                        <span class="d-inline-block float-end">
                            <span class="badge bg-info ms-1">{{ util.shortAddress(selectedPool.account) }}</span>
                            &nbsp;<button-copy clazz="white float-end" :value="selectedPool.account" />
                        </span>
                    </div>
                </div>
                <div class="row justify-content-center pb-2 g-5">
                    <div class="col-12" style="max-width: 450px;">
                        <span class="float-start">Trading Engine: </span>
                        <status-widget :symbol="selectedPoolSymbol" :refresh-interval="3000" />
                        <RouterLink class="btn btn-primary btn-sm ms-2 float-end"
                                    :to="{ path: '/chart', query: {symbol: selectedPoolSymbol} }">
                            <icon-graph-up />
                        </RouterLink>
                        <RouterLink class="btn btn-primary btn-sm float-end"
                                    :to="{ path: '/token', query: {symbol: selectedPoolSymbol} }">
                            <icon-details />
                            Info
                        </RouterLink>
                    </div>
                </div>
                <div class="row justify-content-center pb-2">
                    <div class="col-12 ">

                    </div>
                </div>
            </div>
            <div class="col-lg-6 mx-auto container ">
                <div class="row justify-content-center g-5">
                    <swap-widget ref="swapWidget" v-if="queryParams" :params="queryParams"
                                 @on-update-model="onParamsUpdate" :symbol="selectedPoolSymbol" />
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
    /*margin-top: -20px;*/
    /*margin-left: 70px;*/
    /*position: absolute;*/
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
import IconSliders from "@/components/icons/IconSliders.vue";
import IconArrowDown from "@/components/icons/IconArrowDown.vue";
import IconChangeDirection from "@/components/icons/IconChangeDirection.vue";
import IconInfo from "@/components/icons/IconInfo.vue";
import { useAmmConfigStore } from "@/stores/AmmConfigStore";
import PoolSelector from "@/components/PoolSelector.vue";
import StatusWidget from "@/components/StatusWidget.vue";
import IconDetails from "@/components/icons/IconDetails.vue";
import IconGraphUp from "@/components/icons/IconGraphUp.vue";
import SwapWidget from "@/components/SwapWidget.vue";
import Models from "@/util/Models";

export default {
    components: {
        SwapWidget, IconGraphUp, IconDetails, StatusWidget,
        PoolSelector, IconInfo, IconChangeDirection, IconArrowDown, IconSliders, ButtonCopy, TheHeader
    },
    data() {
        return {
            selectedPool: <PoolInfoDto><any>null,

            swapModel: null as never as SwapModel,
            queryParams: null as never as SwapModel,
        };
    },
    props: {},
    mounted() {
        const query = Models.swapModel(this.$route.query);

        if (!query.to && !query.from) {
            query.to = "DGC";
        }
        if (!query.amount && !query.xrd) {
            query.xrd = "100";
        }
        this.queryParams = query;
    },
    unmounted() {
    },
    methods: {
        poolChanged() {
            if (this.queryParams.to) {
                const query = this.getQueryParams(this.queryParams);
                query.to = this.selectedPool.token.symbol;
                this.queryParams = query;
            } else if (this.queryParams.from) {
                const query = this.getQueryParams(this.queryParams);
                query.from = this.selectedPool.token.symbol;
                this.queryParams = query;
            }
        },
        onParamsUpdate(params: SwapModel) {
            this.queryParams = params;
        },
        getQueryParams(swapModel) {
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
            return heroImg.startsWith("http") ? heroImg : "https://dogecubex.b-cdn.net" + heroImg;
        },
        util() {
            return Utils;
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
            this.$router.replace({query: queryParams});
        },
        "$route.query": function (q) {
            this.queryParams = Models.swapModel(q);
        },
    }
}
</script>
