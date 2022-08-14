import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { UnwrapRef } from "vue-demi";

export const useSettingsStore = defineStore({
    id: "d3x.Settings",
    state: () => ({
        notificationMode: useLocalStorage("d3x.Settings.notificationMode", "4"),
        chosenSymbols: useLocalStorage("d3x.Settings.chosenSymbols", ""),
        notificationSounds: useLocalStorage("d3x.Settings.notificationSounds", "0"),

        compactChart: useLocalStorage("d3x.Settings.compactChart", "0"),
        chartCurrency: useLocalStorage("d3x.Settings.chartCurrency", "XRD"),
        analyticsCurrency: useLocalStorage("d3x.Settings.analyticsCurrency", "XRD"),
    }),
    actions: {
        setNotificationMode(mode: string) {
            this.$patch({
                notificationMode: mode || "",
            });
        },
        addChosenSymbol(symbol: string) {
            const symbols = this.chosenSymbols ? this.chosenSymbols.split("-") : [];
            symbols.push(symbol);
            this.$patch({
                chosenSymbols: symbols.join("-"),
            });
        },
        removeChosenSymbol(symbol: string) {
            let symbols = this.chosenSymbols ? this.chosenSymbols.split("-") : [];
            symbols = symbols.filter((s) => s && s !== symbol);
            this.$patch({
                chosenSymbols: symbols.join("-"),
            });
        },
        setNotificationSounds(enabled: boolean | null) {
            this.$patch({
                notificationSounds: enabled ? "1" : "0",
            });
        },
        setCompactChart(enabled: boolean | null) {
            this.$patch({
                compactChart: enabled ? "1" : "0",
            });
        },
        subscribeChartChange(callback: (state: UnwrapRef<{ compactChart: string, chartCurrency: string }>) => void) {
            this.$subscribe((mutation, state) => {
                callback(state);
            });
        },
        setChartCurrency(currency: string) {
            this.$patch({
                chartCurrency: currency || "",
            });
        },
        setAnalyticsCurrency(currency: string) {
            this.$patch({
                analyticsCurrency: currency || "",
            });
        },
        subscribeAnalyticsCurrencyChange(callback: (state: UnwrapRef<{ analyticsCurrency: string }>) => void) {
            this.$subscribe((mutation, state) => {
                callback(state);
            });
        },
    },
});
