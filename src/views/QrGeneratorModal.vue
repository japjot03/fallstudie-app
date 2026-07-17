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
          @ionInput="generateQrCode"
        ></ion-input>
      </ion-item>

      <div class="qr-container" v-if="qrDataUrl">
        <img :src="qrDataUrl" alt="QR-Code" class="qr-image" />
        <div class="qr-actions">
          <ion-button expand="block" @click="saveQrCode">
            <ion-icon slot="start" :icon="downloadOutline"></ion-icon>
            In Galerie speichern
          </ion-button>
          <ion-button expand="block" color="medium" @click="shareQrCode">
            <ion-icon slot="start" :icon="shareSocialOutline"></ion-icon>
            Teilen
          </ion-button>
        </div>
      </div>

      <div class="qr-placeholder" v-else>
        <ion-icon :icon="qrCodeOutline" class="placeholder-icon"></ion-icon>
        <p>Gib einen Text ein, um einen QR-Code zu generieren.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonItem, IonInput,
  modalController, toastController
} from '@ionic/vue'
import { closeOutline, qrCodeOutline, downloadOutline, shareSocialOutline } from 'ionicons/icons'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import QRCode from 'qrcode'

const inputText = ref('')
const qrDataUrl = ref('')

let debounceTimer = null

async function generateQrCode() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    const text = inputText.value.trim()
    if (!text) {
      qrDataUrl.value = ''
      return
    }
    try {
      qrDataUrl.value = await QRCode.toDataURL(text, {
        width: 280,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
    } catch (error) {
      console.error('Fehler bei QR-Code-Generierung:', error)
      qrDataUrl.value = ''
    }
  }, 300)
}

async function saveQrCode() {
  if (!qrDataUrl.value) return
  try {
    // Data-URL in Base64-Daten umwandeln (nach dem Komma)
    const base64Data = qrDataUrl.value.split(',')[1]
    const fileName = `qrcode_${Date.now()}.png`

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents
    })

    await showToast('QR-Code wurde gespeichert!')
  } catch (error) {
    console.error('Fehler beim Speichern:', error)
    await showToast('Fehler beim Speichern des QR-Codes.')
  }
}

async function shareQrCode() {
  if (!qrDataUrl.value) return
  try {
    const base64Data = qrDataUrl.value.split(',')[1]
    const fileName = `qrcode_${Date.now()}.png`

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Cache
    })

    const fileUri = await Filesystem.getUri({
      path: fileName,
      directory: Directory.Cache
    })

    await Share.share({
      title: 'QR-Code',
      url: fileUri.uri,
      dialogTitle: 'QR-Code teilen'
    })
  } catch (error) {
    console.error('Fehler beim Teilen:', error)
    await showToast('Fehler beim Teilen des QR-Codes.')
  }
}

async function showToast(message) {
  const toast = await toastController.create({
    message,
    duration: 2000,
    position: 'bottom'
  })
  await toast.present()
}

function dismiss() {
  modalController.dismiss()
}
</script>

<style scoped>
.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.qr-image {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.qr-actions {
  margin-top: 1.5rem;
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 4rem;
  color: var(--ion-color-medium);
  text-align: center;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 1rem;
}

.qr-placeholder p {
  font-size: 0.9rem;
  max-width: 250px;
}
</style>
