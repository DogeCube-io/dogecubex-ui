import { defineStore } from "pinia";
import type { TokenSwapDto } from "../../env";
import type { UnwrapRef } from "vue-demi";

export const useSwapEventStore = defineStore({
    id: "SwapEvent",
    state: () => ({
        lastSwap: {} as TokenSwapDto,
    }),
    actions: {
        subscribe(callback: (state: UnwrapRef<{ lastSwap: TokenSwapDto }>) => void) {
            this.$subscribe((mutation, state) => {
                callback(state);
            });
        },
        setLastSwap(swap: TokenSwapDto) {
            this.$patch({
                lastSwap: swap
            });
        }
    },
});
