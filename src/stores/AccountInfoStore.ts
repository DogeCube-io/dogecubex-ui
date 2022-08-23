import { defineStore } from "pinia";
import type { AccountInfoDtoExt } from "../../env";
import API from "@/util/API";

let loadingAcc = null as string | null;

export const useAccountInfoStore = defineStore({
    id: "AccountInfo",
    state: () => ({
        accountInfo: null as AccountInfoDtoExt | null,
    }),
    actions: {
        async loadAccountInfo(account: string) {
            if ((loadingAcc !== account)) {
                loadingAcc = account;
                if (this.accountInfo?.account !== account) {
                    this.$patch({
                        accountInfo: null,
                    });
                }
                if (account) {
                    const accInfo = await API.get(`/api/accounts/info.json?account=${account}`) as AccountInfoDtoExt;
                    accInfo.account = account;
                    loadingAcc = null;
                    this.$patch({
                        accountInfo: accInfo,
                    });
                }
            }
        },
    },
});
