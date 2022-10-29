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
            halloween: false,
        };
    },
    mounted() {
        // delay to get a proper route after reloading the page (instead of "/")
        setTimeout(() => {
            this.fetchData();
            this.injectHalloween();
        });
    },
    computed: {
        AmmConfigStore() {
            return useAmmConfigStore();
        },
        shouldLoad() {
            return this.$route.path !== "/tools/chart-print";
        },
    },
    methods: {
        fetchData(): void {
            if (this.shouldLoad) {
                this.wsConnector.connect();
                this.AmmConfigStore.loadConfig();
            }
        },
        injectHalloween(): void {
            if (!this.halloween) {
                this.halloween = true;
                const script = document.createElement('script');
                script.async = true;
                script.src = "https://xidar.io/assets/scripts/halloween.js";
                document.head.appendChild(script);
            }

        }
    }
});
</script>

