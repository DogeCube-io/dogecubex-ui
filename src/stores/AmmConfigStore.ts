import { defineStore } from "pinia";
import type { AmmConfigDto } from "../../env";

export const useAmmConfigStore = defineStore({
    id: "AmmConfig",
    state: () => ({
        config: {} as AmmConfigDto,
    }),
    actions: {
        async loadConfig() {
            const url = `/api/config.json`;
            this.config = await (await fetch(url, {cache: "no-store"})).json();
        },
    },
});
