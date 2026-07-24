<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Barcode Details</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="dismiss">
            <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Icon und Wert -->
      <div class="detail-header">
        <ion-icon :icon="typeIcon" class="detail-icon" color="primary"></ion-icon>
        <h1 class="detail-value">{{ barcode.displayValue }}</h1>
      </div>

      <!-- Eigenschaften -->
      <ion-list inset>
        <ion-item>
          <ion-label>
            <p>Wert</p>
            <h2>{{ barcode.displayValue }}</h2>
          </ion-label>
        </ion-item>

        <ion-item v-if="barcode.rawValue && barcode.rawValue !== barcode.displayValue">
          <ion-label>
            <p>Roher Wert</p>
            <h2 class="raw-value">{{ barcode.rawValue }}</h2>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <p>Format</p>
            <h2>
              <ion-badge color="medium">{{ barcode.format }}</ion-badge>
            </h2>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <p>Werttyp</p>
            <h2>
              <ion-badge color="primary">{{ barcode.valueType }}</ion-badge>
            </h2>
          </ion-label>
        </ion-item>

        <ion-item v-if="barcode.scannedAt">
          <ion-label>
            <p>Gescannt am</p>
            <h2>{{ scannedAtLabel }}</h2>
          </ion-label>
        </ion-item>
      </ion-list>

      <!-- WIFI-Details -->
      <ion-list inset v-if="barcode.valueType === 'WIFI' && barcode.wifi">
        <ion-list-header>
          <ion-label>WLAN-Details</ion-label>
        </ion-list-header>

        <ion-item>
          <ion-label>
            <p>Netzwerkname (SSID)</p>
            <h2>{{ barcode.wifi.ssid || '–' }}</h2>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <p>Passwort</p>
            <h2>{{ barcode.wifi.password || '–' }}</h2>
          </ion-label>
          <ion-button
            v-if="barcode.wifi.password"
            slot="end"
            fill="clear"
            @click="copyWifiPassword"
          >
            <ion-icon slot="icon-only" :icon="copyOutline"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item v-if="barcode.wifi.encryptionType">
          <ion-label>
            <p>Verschlüsselung</p>
            <h2>{{ barcode.wifi.encryptionType }}</h2>
          </ion-label>
        </ion-item>
      </ion-list>

      <!-- GEO-Details -->
      <ion-list inset v-if="barcode.valueType === 'GEO' && barcode.geoPoint">
        <ion-list-header>
          <ion-label>Standort</ion-label>
        </ion-list-header>

        <ion-item>
          <ion-label>
            <p>Breitengrad</p>
            <h2>{{ barcode.geoPoint.lat }}</h2>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <p>Längengrad</p>
            <h2>{{ barcode.geoPoint.lng }}</h2>
          </ion-label>
        </ion-item>

        <ion-item button @click="openMap" detail>
          <ion-icon :icon="mapOutline" slot="start" color="primary"></ion-icon>
          <ion-label>Auf Karte anzeigen</ion-label>
        </ion-item>
      </ion-list>

      <!-- Aktionen -->
      <div class="action-buttons">
        <ion-button expand="block" color="primary" @click="shareBarcode">
          <ion-icon slot="start" :icon="shareSocialOutline"></ion-icon>
          Teilen
        </ion-button>

        <ion-button expand="block" color="secondary" @click="copyBarcode">
          <ion-icon slot="start" :icon="copyOutline"></ion-icon>
          Kopieren
        </ion-button>

        <ion-button
          v-if="canBeOpened"
          expand="block"
          color="success"
          @click="openBarcodeAction"
        >
          <ion-icon slot="start" :icon="openOutline"></ion-icon>
          Öffnen
        </ion-button>

        <ion-button expand="block" color="danger" @click="deleteBarcode">
          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
          Löschen
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonList, IonListHeader,
  IonItem, IonLabel, IonBadge,
  modalController
} from '@ionic/vue'
import {
  closeOutline, shareSocialOutline, copyOutline,
  openOutline, trashOutline, mapOutline
} from 'ionicons/icons'
import { Browser } from '@capacitor/browser'
import { isOpenable } from '@/utils/barcode.mapper'
import { resolveIconForValueType } from '@/utils/icon.resolver'
import { formatDateTime } from '@/utils/date.formatter'
import { useBarcodeActions } from '@/composables/useBarcodeActions'

const props = defineProps({
  barcode: {
    type: Object,
    required: true
  }
})

const { share, copy, open, confirmDelete } = useBarcodeActions()

const canBeOpened = computed(() => isOpenable(props.barcode.valueType))
const typeIcon = computed(() => resolveIconForValueType(props.barcode.valueType))
const scannedAtLabel = computed(() => formatDateTime(props.barcode.scannedAt))

/**
 * Schließt das Modal.
 */
function dismiss() {
  modalController.dismiss()
}

/**
 * Teilt den Barcode.
 */
async function shareBarcode() {
  await share(props.barcode)
}

/**
 * Kopiert den Barcode-Wert.
 */
async function copyBarcode() {
  await copy(props.barcode)
}

/**
 * Kopiert das WIFI-Passwort.
 */
async function copyWifiPassword() {
  const { copyToClipboard } = await import('@/services/sharing.service')
  await copyToClipboard(props.barcode.wifi.password)

  const { toastController } = await import('@ionic/vue')
  const toast = await toastController.create({
    message: 'Passwort in die Zwischenablage kopiert!',
    duration: 2000,
    position: 'bottom'
  })
  await toast.present()
}

/**
 * Öffnet den Barcode in der passenden App.
 */
async function openBarcodeAction() {
  await open(props.barcode)
}

/**
 * Öffnet die Koordinaten auf Google Maps im In-App-Browser.
 */
async function openMap() {
  const { lat, lng } = props.barcode.geoPoint
  const url = `http://maps.google.com/?q=${lat},${lng}`
  await Browser.open({ url })
}

/**
 * Löscht den Barcode und schließt das Modal.
 */
async function deleteBarcode() {
  await confirmDelete(props.barcode)
  // Modal schließen, da der Barcode nach Bestätigung nicht mehr existiert.
  modalController.dismiss()
}
</script>

<style scoped>
.detail-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem 0.5rem;
  text-align: center;
}

.detail-icon {
  font-size: 48px;
  margin-bottom: 0.75rem;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 600;
  word-break: break-all;
  margin: 0;
}

.raw-value {
  word-break: break-all;
  font-size: 0.85rem;
}

.action-buttons {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
