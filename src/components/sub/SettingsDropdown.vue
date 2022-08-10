<template>
    <button :id="btnId" :class="addClass || ''" class="dropdown-toggle link-dark settings-button"
            data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" type="button">
        <icon-settings />
    </button>
    <div :class="addClass || ''" class="settings-dropdown dropdown-menu dropdown-menu-end" :aria-labelledby="btnId">
        <div class="row">
            <div class="col-6">
                <label for="notification-mode-range" class="form-label">Notifications: </label>
            </div>
            <div class="col-6">
                <div class="row">
                    <div>
                        <input type="range" v-model="notificationMode" class="form-range" min="1"
                               max="4" step="1"
                               @input="onNotificationModeChange"
                               id="notification-mode-range"
                               :style="{backgroundSize: (Number(notificationMode) - 1) * 100 / 3 + '% 100%'}">
                    </div>
                </div>
                <div class="row">
                    <div :class=" notificationMode === '3' || notificationMode === '4' ?  'text-end' : 'text-start'">
                        <span :class="notificationMode === '1' ? '' : (notificationMode === '2' ? '' : 'ms-3')">{{ notifMode }}</span>
                        <span v-if="notificationMode === '3'" class="ms-1">
                        <span data-bs-toggle="tooltip" data-bs-placement="left"
                              title="Click on the bell icon on the Info page to get notifications"><icon-question /></span>
                    </span>
                        <span v-else-if="notificationMode === '2'" class="ms-1">
                    <span data-bs-toggle="tooltip" data-bs-placement="left"
                          title="Only notifications related to the current page will appear"><icon-question /></span>
                    </span>
                    </div>
                </div>

            </div>

        </div>
        <div class="row">
            <div class="col-8 text-start" @click="false">
                <label for="notification-sounds" class="form-label" :class="{'text-muted': notificationMode === '1'}" >With sound: </label>
            </div>
            <div class="col-4">
                <div class="form-check form-switch">
                    <input v-model="notificationSounds" class="form-check-input" type="checkbox" role="switch"
                           :disabled="notificationMode === '1'"
                           @input="onNotificationSoundsChange" id="notification-sounds">
                    <label class="form-check-label" for="notification-sounds"> </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconQuestion from "@/components/icons/IconQuestion.vue";
import IconSettings from "@/components/icons/IconSettings.vue";
import Tooltip from "bootstrap/js/dist/tooltip";
import { useSettingsStore } from "@/stores/SettingsStore";

export default defineComponent({
    components: {IconQuestion, IconSettings},
    data() {
        return {
            notificationMode: "4",
            notificationSounds: false,
            notificationModesMap: {
                "1": "OFF",
                "2": "Relevant",
                "3": "Chosen Only",
                "4": "All",
            } as Record<string, string>,
            tooltips: [] as Tooltip[],
        };
    },
    props: {
        btnId: {
            type: String,
            required: true
        },
        addClass: {
            type: String,
            required: false
        },
    },
    mounted() {
        this.notificationMode = this.SettingsStore.notificationMode;
        this.notificationSounds = this.SettingsStore.notificationSounds === "1";
        setTimeout(() => {
            this.initTooltips();
        });
    },
    computed: {
        notifMode(): string {
            return this.notificationModesMap[this.notificationMode || "4"];
        },
        SettingsStore() {
            return useSettingsStore();
        },
    },
    methods: {
        onNotificationModeChange(evt: Event) {
            this.SettingsStore.setNotificationMode('' + (evt.target as HTMLInputElement).value);
            setTimeout(() => {
                this.initTooltips();
            });
            //  this.onChange(false);
        },
        onNotificationSoundsChange(evt: Event) {
            const target = evt.target as HTMLInputElement;
            const checked = target.checked;
            this.SettingsStore.setNotificationSounds(checked);
            if (checked && !target.disabled) {
                const audio = new Audio("swap.mp3");
                audio.play();
            }
        },
        initTooltips() {
            for (const tip of this.tooltips) {
                tip.hide();
            }
            this.tooltips.length = 0;

            const tooltipTriggerList = [].slice.call(document.querySelectorAll(`#${this.btnId} ~ .settings-dropdown [data-bs-toggle="tooltip"]`));
            tooltipTriggerList.map((tooltipTriggerEl) => {
                const tooltip = new Tooltip(tooltipTriggerEl);
                this.tooltips.push(tooltip);
                return tooltip;
            });
        },
    }
});
</script>
<style>
.settings-button {
    background: transparent;
    border: none;
    font-size: 24px;
}

.settings-button:after {
    display: none;
}

.settings-button ~ .dropdown-menu {
    margin-top: -6px;
    margin-right: 7px;
}

.settings-dropdown {
    background-color: #dedede;
    border-radius: 5px;
    color: black;
    padding: 5px 5px;
    min-width: 290px;
}

@media (min-width: 576px) {
    .settings-button ~ .dropdown-menu {
        margin-top: -12px;
        margin-right: 15px;
    }

    .settings-dropdown {
        padding: 5px 10px;
        min-width: 300px;
    }
}

.settings-dropdown.dropdown-menu-end[data-bs-popper] {
    /*right: auto;*/
}
</style>
