<template>
    &nbsp;
</template>

<script lang="ts">
import { useAmmConfigStore } from "@/stores/AmmConfigStore";

export default {
    name: "ConfigLoader",
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
            this.AmmConfigStore.loadConfig();
        }
    }
}
</script>

