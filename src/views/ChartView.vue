<template>
    <TheHeader active-page="Chart" :show-images="true" />
    <main class="container-xxl">
        <div class="my-5 text-center">
            <TVChartContainer />
        </div>
    </main>
</template>

<script lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import TVChartContainer from "@/components/TVChartContainer.vue";
import { version } from '../../public/charting_library'

export default {
    name: 'app',
    components: {TheHeader, TVChartContainer},
    data() {
        return {version: version()}
    }
}
</script>

<style lang="scss" scoped>
.app {
    text-align: center;

    &__header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        background-color: #222;
        color: #fff;
    }

    &__title {
        display: block;
        font-size: 1.5em;
    }
}

.TVChartContainer {
    height: calc(100vh - 200px);
}

</style>
