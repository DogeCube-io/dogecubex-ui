import { defineStore } from "pinia";
import type { AmmConfigDto } from "../../env";
import API from "@/util/API";

export const useAmmConfigStore = defineStore({
    id: "AmmConfig",
    state: () => ({
        config: {} as AmmConfigDto,
    }),
    actions: {
        async loadConfig() {
            this.config = await API.get("/api/config.json") as AmmConfigDto;
        },
    },
});
