<template>
    <button ref="btnCopy" role="button" @click="copyValue"
            class="btn btn-outline-secondary btn-sm copy-btn-sm" :class="'copy-btn-sm-' + clazz">
        <IconCopy />
    </button>
</template>

<script lang="ts">
import IconCopy from "@/components/icons/IconCopy.vue";
import Tooltip from "bootstrap/js/dist/tooltip";
import { defineComponent } from "vue";

export default defineComponent({
    components: {IconCopy},
    data() {
        return {
            tooltips: [] as Tooltip[],
        }
    },
    props: {
        clazz: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    },
    methods: {
        copyValue() {
            window.navigator.clipboard.writeText(this.value);

            const tooltip = new Tooltip(this.$refs.btnCopy as Element, {
                trigger: 'manual',
                title: 'Copied',
                placement: 'right',
                customClass: 'd3x-tooltip-success'
            });
            for (const tip of this.tooltips) {
                tip.hide();
            }
            this.tooltips.length = 0;
            this.tooltips.push(tooltip);
            tooltip.show();

            setTimeout(function () {
                tooltip.hide();
            }, 2500);

        }
    }
});
</script>
