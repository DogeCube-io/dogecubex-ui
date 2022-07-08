<script setup lang="ts"></script>

<template>
    <main>
        <div class="px-4 py-5 my-5 text-center">
            <img class="d-block mx-auto mb-4" src="/image/hero.png" alt="">
            <h1 class="display-5 fw-bold">Your place to trade Altcoins!</h1>
            <div class="col-lg-6 mx-auto">
                <p class="lead mb-4">The first AMM on Radix Ledger brought to you by the oldest Radix Memecoin!</p>
                <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <RouterLink to="/swap" class="btn btn-primary btn-lg px-4 gap-3">Trade</RouterLink>
                    <RouterLink to="/about" class="btn btn-outline-secondary btn-lg px-4">Learn More</RouterLink>
                </div>
            </div>
        </div>
    </main>
</template>
