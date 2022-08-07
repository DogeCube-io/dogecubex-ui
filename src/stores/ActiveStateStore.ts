import { defineStore } from "pinia";

export const useActiveStateStore = defineStore({
    id: "d3x.ActiveState",
    state: () => ({
        lastSymbol: "",
        activeSymbol: "",
        mode: "",

        lastInputs: {}, //map: symbol => {amount?, xrd?}
        xrd: "",
    }),
    actions: {
        setState(symbol: string, mode: string) {
            this.$patch({
                lastSymbol: symbol || this.lastSymbol,
                activeSymbol: symbol || "",
                mode: mode || "",
            });
        },
        setSymbol(symbol: string) {
            this.$patch({
                lastSymbol: symbol || this.lastSymbol,
                activeSymbol: symbol || "",
            });
        },
        setAmount(symbol: string, amount: string | number, xrd: string | number) {
            const lastInputs = {...this.lastInputs };
            const input = {} as {amount: string | number, xrd: string | number};
            if (amount) {
                input.amount = amount;
            }
            if (xrd) {
                input.xrd = xrd;
                this.xrd = xrd;
            }
            lastInputs[symbol] = input;
            this.lastInputs = lastInputs;
        },
    },
    persist: true,
});
