<template>
    &nbsp;
</template>

<script lang="ts">
import { useAmmConfigStore } from "@/stores/AmmConfigStore";
import WsConnector from "@/util/WsConnector";
import { defineComponent } from "vue";

export default defineComponent({
    name: "ConfigLoader",
    data() {
        return {
            wsConnector: new WsConnector(),
        };
    },
    mounted() {
        this.fetchData();
    },
    computed: {
        AmmConfigStore() {
            return useAmmConfigStore();
        },
    },
    methods: {
        fetchData(): void {
            this.wsConnector.connect();
            this.AmmConfigStore.loadConfig();
        }
    }
});
</script>

