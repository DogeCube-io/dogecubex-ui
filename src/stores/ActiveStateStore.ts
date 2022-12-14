import { defineStore } from "pinia";
import { RemovableRef, useLocalStorage } from "@vueuse/core";
import type { UnwrapRef } from "vue-demi";
import type { AnalyticsSort } from "../../env";

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

        connectedAccount: useLocalStorage("d3x.ActiveState.connectedAccount", null as string | null) as RemovableRef<string | null>,
        accounts: useLocalStorage("d3x.ActiveState.accounts", ""),

        analyticsSort: useLocalStorage("d3x.ActiveState.analyticsSort", ""),
    }),
    getters: {
        accountsArr: (state) => JSON.parse(state.accounts || "[]") as string[],
        analyticsSortOrder: (state) => {
            const analyticsSort = state.analyticsSort;
            return (analyticsSort ? {
                field: analyticsSort.split("|")[0],
                asc: analyticsSort.endsWith("|asc")
            } : null) as AnalyticsSort | null;
        },
    },
    actions: {
        setState(symbol: string, mode: string) {
            this.$patch({
                lastSymbol: symbol && symbol !== "XRD" ? symbol : this.lastSymbol,
                activeSymbol: symbol || "",
                mode: mode || "",
            });
        },
        setSymbol(symbol: string) {
            this.$patch({
                lastSymbol: symbol && symbol !== "XRD" ? symbol : this.lastSymbol,
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
        connectAccount(account: string) {
            let accounts = this.accountsArr;
            if (account) {
                accounts = accounts.filter(e => e !== account);
                accounts.unshift(account);
            }
            this.$patch({
                connectedAccount: account,
                accounts: JSON.stringify(accounts),
            });
        },
        removeAccount(account: string) {
            let accounts = this.accountsArr;
            accounts = accounts.filter(e => e !== account);
            this.$patch({
                accounts: JSON.stringify(accounts),
            });
        },
        subscribeConnectedAccount(callback: (state: UnwrapRef<{ connectedAccount: string | null }>) => void) {
            this.$subscribe((mutation: any, state) => {
                if (mutation.payload && mutation.payload.connectedAccount !== undefined) {
                    callback(state);
                }
            });
        },
        setAnalyticsSort(sort: AnalyticsSort) {
            this.$patch({
                analyticsSort: sort ? sort.field + (sort.asc ? "|asc" : "|desc") : "",
            });
        }

    },
});
