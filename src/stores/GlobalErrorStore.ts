import { defineStore } from "pinia";

export const useGlobalErrorStore = defineStore({
    id: "GlobalError",
    state: () => ({
        error: "",
    }),
    getters: {
        error: (state) => state.error
    },
    actions: {
        async setError(value: string) {
            console.log("set err" + value);
            // noinspection JSConstantReassignment
            this.error = value;
        }
    },
});
