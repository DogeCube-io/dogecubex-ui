<template>
    <button role="button"
            class="btn btn-outline-secondary btn-sm copy-btn-sm js-copy" :class="'copy-btn-sm-' + clazz">
        <IconCopy />
    </button>
</template>

<script lang="ts">
import IconCopy from "@/components/icons/IconCopy.vue";

export default {
    components: {IconCopy},
    props: {
        clazz: {
            type: String,
            required: true
        },
    },
}
</script>
