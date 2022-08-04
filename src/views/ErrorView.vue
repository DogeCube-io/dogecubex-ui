<script setup lang="ts">
import { useGlobalErrorStore } from "@/stores/GlobalErrorStore";</script>

<template>
    <main>
        <div class="px-4 py-5 my-5 text-center">
            An error has occurred. <br>
            <div>{{ useGlobalErrorStore().error }}</div>
            Please try to go back or start from <a href="/">Home</a>.
        </div>
    </main>
</template>
