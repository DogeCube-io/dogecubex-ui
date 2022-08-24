<template>
    <th scope="col" class="sort" @click.stop="updateSort">
        <icon-arrow-down v-if="sortOrder && sortOrder.field === field && sortOrder.asc" />
        <icon-arrow-up v-if="sortOrder && sortOrder.field === field && !sortOrder.asc" />
        <slot />
    </th>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import type { AnalyticsSort } from "../../../env";
import IconArrowDown from "@/components/icons/IconArrowDown.vue";
import IconArrowUp from "@/components/icons/IconArrowUp.vue";

export default defineComponent({
    components: {IconArrowUp, IconArrowDown},
    emits: ["updateSort"],
    props: {
        field: {
            type: String,
            required: true
        },
        sortOrder: {
            type: Object as PropType<AnalyticsSort>,
            required: false
        },
    },
    methods: {
        updateSort(evt: Event) {
            this.$emit("updateSort", this.field);
        }
    }
});
</script>
