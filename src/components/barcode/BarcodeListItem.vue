<template>
  <ion-item-sliding ref="slidingItem">
    <!-- Aktionen links: teilen, kopieren, öffnen -->
    <ion-item-options side="start">
      <ion-item-option color="primary" @click="emitAction('share')">
        <ion-icon slot="icon-only" :icon="shareSocialOutline"></ion-icon>
      </ion-item-option>
      <ion-item-option color="secondary" @click="emitAction('copy')">
        <ion-icon slot="icon-only" :icon="copyOutline"></ion-icon>
      </ion-item-option>
      <ion-item-option
        v-if="canBeOpened"
        color="success"
        @click="emitAction('open')"
      >
        <ion-icon slot="icon-only" :icon="openOutline"></ion-icon>
      </ion-item-option>
    </ion-item-options>

    <ion-item button @click="emitAction('detail')" detail>
      <ion-icon :icon="typeIcon" slot="start" color="primary"></ion-icon>
      <ion-label>
        <h2>{{ barcode.displayValue }}</h2>
        <p>
          <ion-badge color="medium" class="badge">{{ barcode.format }}</ion-badge>
          <ion-badge color="primary" class="badge">{{ barcode.valueType }}</ion-badge>
        </p>
        <p class="scan-date">{{ scannedAtLabel }}</p>
      </ion-label>
    </ion-item>

    <!-- Aktion rechts: löschen -->
    <ion-item-options side="end">
      <ion-item-option color="danger" @click="emitAction('delete')">
        <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  IonItem, IonItemSliding, IonItemOptions, IonItemOption,
  IonLabel, IonIcon, IonBadge
} from '@ionic/vue'
import {
  shareSocialOutline, copyOutline, openOutline, trashOutline
} from 'ionicons/icons'
import { isOpenable } from '@/utils/barcode.mapper'
import { resolveIconForValueType } from '@/utils/icon.resolver'
import { formatDateTime } from '@/utils/date.formatter'

const props = defineProps({ barcode: { type: Object, required: true } })
const emit = defineEmits(['share', 'copy', 'open', 'delete', 'detail'])
const slidingItem = ref(null)

const canBeOpened = computed(() => isOpenable(props.barcode.valueType))
const typeIcon = computed(() => resolveIconForValueType(props.barcode.valueType))
const scannedAtLabel = computed(() => formatDateTime(props.barcode.scannedAt))

const emitAction = async (action) => {
  const el = slidingItem.value?.$el ?? slidingItem.value
  if (el?.close) await el.close()
  emit(action, props.barcode)
}
</script>

<style scoped>
.badge {
  margin-right: 6px;
  font-size: 0.7rem;
}

.scan-date {
  font-size: 0.75rem;
  color: var(--ion-color-medium);
  margin-top: 4px;
}

ion-item h2 {
  font-weight: 500;
  font-size: 0.95rem;
  word-break: break-all;
}
</style>
