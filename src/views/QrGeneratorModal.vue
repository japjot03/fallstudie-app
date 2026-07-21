<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>QR-Code Generator</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="dismiss">
            <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-input
          v-model="inputText"
          label="Text eingeben"
          label-placement="floating"
          placeholder="z.B. https://example.com"
          @ionInput="generateDebounced"
        ></ion-input>
      </ion-item>

      <qr-code-preview
        v-if="qrDataUrl"
        :data-url="qrDataUrl"
        @save="save"
        @share="share"
      />

      <qr-code-placeholder v-else />
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonItem, IonInput,
  modalController
} from '@ionic/vue'
import { closeOutline } from 'ionicons/icons'
import QrCodePreview from '@/components/qr/QrCodePreview.vue'
import QrCodePlaceholder from '@/components/qr/QrCodePlaceholder.vue'
import { useQrGenerator } from '@/composables/useQrGenerator'

const { inputText, qrDataUrl, generateDebounced, save, share } = useQrGenerator()

/**
 * Schließt das Modal.
 */
function dismiss() {
  modalController.dismiss()
}
</script>
