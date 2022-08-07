<template>
    <div :id="elementId" class="container">
        <span class="msg-small" >
            <span v-if="swap.tokenFrom === 'XRD'">
                 <span v-if="swap.amountFrom >= 1500">🚀 </span>
                 <span v-if="swap.amountFrom >= 1000">🔥 </span>
                 <span v-if="swap.amountFrom >= 500">👍 </span>
            </span>
            Swapped <span>{{ displayCurrency(swap.amountFrom) + ' ' + swap.tokenFrom }}</span> for&nbsp;
            <span>{{ displayCurrency(swap.amountTo) + ' ' + swap.tokenTo }}</span>
        </span>
        <button class="btn btn-sm btn-outline-secondary ms-2 link-dark" @click.stop="viewSwap">View</button>
    </div>
</template>

<script lang="ts">
import type { TokenSwapDto } from "../../../env";
import Utils from "@/util/Utils";

export default {
    components: {},
    data() {
        return {
            router: null,
        }
    },
    emits: ["viewClick", "close-toast"],
    props: {
        swap: null as never as TokenSwapDto,
        elementId: String,
    },
    computed: {
        swapSymbol(): string {
            if (!this.swap) {
                return "";
            }
            return this.swap.tokenFrom !== "XRD" ? this.swap.tokenFrom : this.swap.tokenTo;
        }
    },
    methods: {
        viewSwap() {
            setTimeout(() => {
                this.$emit('close-toast');
            }, 0);
            this.$emit('viewClick', this.swapSymbol);
        },
        displayCurrency(amount: string | number) {
            return Utils.displayCurrency(amount);
        },
        displayCurrency0(amount: string | number) {
            return Utils.displayCurrency0(amount);
        },
    }
}
</script>

