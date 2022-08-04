<script setup lang="ts"></script>

<template>
    <TheHeader active-page="NotFound" :show-images="true" />
    <main>
        <div class="px-4 py-5 my-5 text-center">
            Page Not Found.<br> Please try to go back or start from <a href="/" >Home</a>.
        </div>
    </main>
</template>
<script>
import TheHeader from "@/components/TheHeader.vue";
export default {
    components: {TheHeader}
}
</script>
