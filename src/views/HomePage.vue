<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Barcode Scanner</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="presentExportOptions" :disabled="isEmpty">
            <ion-icon slot="icon-only" :icon="downloadOutline"></ion-icon>
          </ion-button>
          <ion-button @click="openQrGenerator">
            <ion-icon slot="icon-only" :icon="qrCodeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Barcode Scanner</ion-title>
        </ion-toolbar>
      </ion-header>

      <empty-barcode-state v-if="isEmpty" />

      <barcode-list
        v-else
        :barcodes="barcodes"
        @share="share"
        @copy="copy"
        @open="open"
        @delete="confirmDelete"
        @detail="openBarcodeDetail"
      />

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="presentScanOptions">
          <ion-icon :icon="scanOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { onMounted } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonIcon, IonFab, IonFabButton, IonButtons, IonButton,
  modalController
} from '@ionic/vue'
import { scanOutline, downloadOutline, qrCodeOutline } from 'ionicons/icons'
import EmptyBarcodeState from '@/components/barcode/EmptyBarcodeState.vue'
import BarcodeList from '@/components/barcode/BarcodeList.vue'
import QrGeneratorModal from '@/views/QrGeneratorModal.vue'
import BarcodeDetailModal from '@/views/BarcodeDetailModal.vue'
import { useBarcodeStore } from '@/composables/useBarcodeStore'
import { useBarcodeScanner } from '@/composables/useBarcodeScanner'
import { useBarcodeActions } from '@/composables/useBarcodeActions'
import { useBarcodeExport } from '@/composables/useBarcodeExport'

const { barcodes, isEmpty, initialize } = useBarcodeStore()
const { presentScanOptions } = useBarcodeScanner()
const { share, copy, open, confirmDelete } = useBarcodeActions()
const { presentExportOptions } = useBarcodeExport()

/**
 * Öffnet den QR-Code-Generator als Modal.
 */
async function openQrGenerator() {
  const modal = await modalController.create({
    component: QrGeneratorModal
  })

  await modal.present()
}

/**
 * Öffnet die Detailansicht für einen Barcode als Modal.
 * @param {object} barcode
 */
async function openBarcodeDetail(barcode) {
  const modal = await modalController.create({
    component: BarcodeDetailModal,
    componentProps: { barcode }
  })

  await modal.present()
}

onMounted(initialize)
</script>

