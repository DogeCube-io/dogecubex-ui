<template>
    <div class="row text-end">
        <div class="col-0 col-xl-1 col-xxl-2"></div>
        <div class="col-6 col-xl-6 col-xxl-5">
            <slot name="header" />
        </div>
        <div class="col-6 col-xl-5 col-xxl-5">
            <slot />
        </div>
    </div>
</template>
