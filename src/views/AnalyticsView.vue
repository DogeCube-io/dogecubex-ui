<template>
    <TheHeader active-page="Analytics" :show-images="true" />
    <main>
        <div class="px-4 my-5 text-center about">
            <h1 class="display-6 fw-bold">&nbsp;</h1>
            Analytics here
        </div>
    </main>
</template>

<style>
.about .accordion-body {
    color: #ddd;
}
</style>
<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import { useAmmConfigStore } from "@/stores/AmmConfigStore";
import type { AmmConfigDto } from "../../env";

export default {
    components: {TheHeader},
    props: {},
    computed: {
        AmmConfigStore() {
            return useAmmConfigStore();
        },
        config(): AmmConfigDto {
            return this.AmmConfigStore.config || {};
        },
    },
}
</script>
