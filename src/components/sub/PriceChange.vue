<template>
    <span :class="{'text-success': signum > 0, 'text-danger': signum < 0}">
        {{ strWithSign }}
    </span>
</template>

<script lang="ts">

import Utils from "@/util/Utils";
import { defineComponent } from "vue";

export default defineComponent({
    components: {},
    data() {
        return {}
    },
    props: {
        value: {
            type: Number,
            required: false
        },
    },
    computed: {
        signum(): number {
            return !this.value ? 0 : this.value < 0 ? -1 : 1;
        },
        strWithSign(): string {
            if (this.value == null) {
                return "--";
            }
            if (this.signum === 0) {
                return "-";
            }
            // noinspection SuspiciousTypeOfGuard
            if (typeof this.value === "string") {
                return (this.value as string).charAt(0) === "-" ? this.value + " %" : "+" + this.value + " %";
            }
            return Utils.strWithSign(this.value || 0) + " %";
        },
    },
    methods: {}
});
</script>
