import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

// TODO: remove after migration
const getOldSettingsString = (prop: string): string => {
    const obj = localStorage["d3x.ActiveState"];
    return obj ? (JSON.parse(obj)[prop] || "") : "";
};

const getOldSettingsObj = (prop: string): Record<string, Record<string, string | number>> => {
    const obj = localStorage["d3x.ActiveState"];
    return obj ? (JSON.parse(obj)[prop] || {}) : {};
};

export const useActiveStateStore = defineStore({
    id: "d3x.ActiveState",
    state: () => ({
        lastSymbol: useLocalStorage("d3x.ActiveState.lastSymbol", getOldSettingsString("lastSymbol")),
        activeSymbol: useLocalStorage("d3x.ActiveState.activeSymbol", getOldSettingsString("activeSymbol")),
        mode: useLocalStorage("d3x.ActiveState.mode", getOldSettingsString("mode")),

        //map: symbol => {amount?, xrd?}
        lastInputs: useLocalStorage("d3x.ActiveState.lastInputs", getOldSettingsObj("lastInputs")),
        xrd: useLocalStorage("d3x.ActiveState.xrd", getOldSettingsString("xrd")),
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
        setAmount(symbol: string, amount: string | number | undefined, xrd: string | number | undefined) {
            const lastInputs = {...this.lastInputs};
            delete lastInputs["undefined"];
            const input = {} as { amount: string | number, xrd: string | number };
            if (amount) {
                input.amount = amount;
            }
            if (xrd) {
                input.xrd = xrd;
                this.$patch({
                    xrd: xrd as string,
                });
            }
            lastInputs[symbol] = input;
            this.$patch((state) => {
                state.lastInputs = lastInputs;
            })
        },
    },
});
