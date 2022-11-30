import { defineStore } from "pinia";

export const useWalletConnectionStore = defineStore({
    id: "WalletConnection",
    state: () => ({
        zeus: "",
        xidar: "",
    }),
    actions: {
        setZeus(account: string) {
            this.$patch({
                zeus: account || "",
                xidar: ""
            });
        },

        setXidar(account: string) {
            this.$patch({
                zeus: "",
                xidar: account || "",
            });
        },

        setAll(zeusAccount: string, xidarAccount: string) {
            this.$patch({
                zeus: zeusAccount || "",
                xidar: xidarAccount || "",
            });
        },
    },
});
