<template>
  <ion-list>
    <barcode-list-item
      v-for="barcode in barcodes"
      :key="barcode.id"
      :barcode="barcode"
      @share="$emit('share', $event)"
      @copy="$emit('copy', $event)"
      @open="$emit('open', $event)"
      @delete="$emit('delete', $event)"
      @detail="$emit('detail', $event)"
    />
  </ion-list>
</template>

<script setup>
import { IonList } from '@ionic/vue'
import BarcodeListItem from '@/components/barcode/BarcodeListItem.vue'

defineProps({
  barcodes: {
    type: Array,
    required: true
  }
})

defineEmits(['share', 'copy', 'open', 'delete', 'detail'])
</script>
