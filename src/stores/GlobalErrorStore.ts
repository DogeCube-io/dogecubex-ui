import { defineStore } from "pinia";

export const useGlobalErrorStore = defineStore({
    id: "GlobalError",
    state: () => ({
        _error: "",
    }),
    getters: {
        error: (state) => state._error
    },
    actions: {
        async setError(value: string) {
            console.log("set err" + value);
            // noinspection JSConstantReassignment
            this._error = value;
        }
    },
});
