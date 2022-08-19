<template>
    <span class="copy-on-click" @click="triggerCopyButton">
        <slot />
    </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    methods: {
        triggerCopyButton(evt: Event) {
            if (evt.target) {
                const parent = (evt.target as HTMLElement).closest(".js-click-parent");
                if (parent) {
                    const btn = parent.getElementsByClassName("js-btn-copy").item(0);
                    if (btn) {
                        (btn as HTMLElement).click();
                    }
                }
            }
        }
    }
});
</script>
