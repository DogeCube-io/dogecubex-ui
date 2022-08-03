import { defineStore } from "pinia";
import type { AmmConfigDto } from "../../env";

export const useAmmConfigStore = defineStore({
    id: "AmmConfig",
    state: () => ({
        config: {} as AmmConfigDto,
    }),
    actions: {
        async loadConfig() {
            const url = `/api/config.json?q=${Date.now()}`;
            this.config = await (await fetch(url)).json();
        },
    },
});
