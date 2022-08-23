import { defineStore } from "pinia";
import { UnwrapRef } from "vue-demi";

export const useWalletConnectionStore = defineStore({
    id: "WalletConnection",
    state: () => ({
        zeus: "",
    }),
    actions: {
        subscribeZeus(callback: (state: UnwrapRef<{ zeus: string }>) => void) {
            this.$subscribe((mutation: any, state) => {
                if (mutation.payload && mutation.payload.zeus !== undefined) {
                    callback(state);
                }
            });
        },
        setZeus(account: string) {
            this.$patch({
                zeus: account || ""
            });
        }
    },
});
