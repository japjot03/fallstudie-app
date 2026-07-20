<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Barcode Scanner</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="showExportActionSheet" :disabled="barcodes.length === 0">
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

      <!-- Leerer Zustand -->
      <div v-if="barcodes.length === 0" class="empty-state">
        <ion-icon :icon="scanOutline" class="empty-icon"></ion-icon>
        <h2>Keine Barcodes vorhanden</h2>
        <p>Tippe auf den Button unten, um einen Barcode zu scannen.</p>
      </div>

      <!-- Barcode-Liste -->
      <ion-list v-else>
        <ion-item-sliding v-for="(barcode, index) in barcodes" :key="index" ref="slidingItems">
          <!-- Slide-Options Links -->
          <ion-item-options side="start">
            <ion-item-option color="primary" @click="shareBarcode(barcode, index)">
              <ion-icon slot="icon-only" :icon="shareSocialOutline"></ion-icon>
            </ion-item-option>
            <ion-item-option color="secondary" @click="copyBarcode(barcode, index)">
              <ion-icon slot="icon-only" :icon="copyOutline"></ion-icon>
            </ion-item-option>
            <ion-item-option
              v-if="isOpenable(barcode.valueType)"
              color="success"
              @click="openBarcode(barcode, index)"
            >
              <ion-icon slot="icon-only" :icon="openOutline"></ion-icon>
            </ion-item-option>
          </ion-item-options>

          <!-- Barcode-Inhalt -->
          <ion-item>
            <ion-icon :icon="getIconForType(barcode.valueType)" slot="start" color="primary"></ion-icon>
            <ion-label>
              <h2>{{ barcode.displayValue }}</h2>
              <p>
                <ion-badge color="medium" class="badge">{{ barcode.format }}</ion-badge>
                <ion-badge color="primary" class="badge">{{ barcode.valueType }}</ion-badge>
              </p>
              <p class="scan-date">{{ formatDate(barcode.scannedAt) }}</p>
            </ion-label>
          </ion-item>

          <!-- Slide-Options Rechts -->
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="confirmDelete(index)">
              <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <!-- FAB-Button zum Scannen -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="showScanOptions">
          <ion-icon :icon="scanOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonIcon, IonFab, IonFabButton,
  IonItemSliding, IonItemOptions, IonItemOption, IonBadge,
  IonButtons, IonButton,
  alertController, actionSheetController, toastController,
  modalController
} from '@ionic/vue'
import {
  scanOutline, shareSocialOutline, copyOutline, trashOutline,
  openOutline, cameraOutline, imageOutline, downloadOutline,
  qrCodeOutline, linkOutline, callOutline, mailOutline,
  chatbubbleOutline, locationOutline, barcodeOutline, closeOutline
} from 'ionicons/icons'
import { Preferences } from '@capacitor/preferences'
import { Share } from '@capacitor/share'
import { Clipboard } from '@capacitor/clipboard'
import { Browser } from '@capacitor/browser'
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import QrGeneratorModal from './QrGeneratorModal.vue'

const STORAGE_KEY = 'scanned_barcodes'
const barcodes = ref([])
const slidingItems = ref([])

// ==================== Persistenz ====================

async function loadBarcodes() {
  try {
    const result = await Preferences.get({ key: STORAGE_KEY })
    if (result.value) {
      barcodes.value = JSON.parse(result.value)
    }
  } catch (error) {
    console.error('Fehler beim Laden der Barcodes:', error)
  }
}

async function saveBarcodes() {
  try {
    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(barcodes.value)
    })
  } catch (error) {
    console.error('Fehler beim Speichern der Barcodes:', error)
  }
}

// ==================== Barcode Scanning ====================

function mapValueType(rawType) {
  // MLKit gibt numerische valueType-Werte zurück
  const typeMap = {
    1: 'CONTACT_INFO',
    2: 'EMAIL',
    3: 'ISBN',
    4: 'PHONE',
    5: 'PRODUCT',
    6: 'SMS',
    7: 'TEXT',
    8: 'URL',
    9: 'WIFI',
    10: 'GEO',
    11: 'CALENDAR_EVENT',
    12: 'DRIVER_LICENSE'
  }
  if (typeof rawType === 'string') return rawType
  return typeMap[rawType] || 'TEXT'
}

function mapFormat(rawFormat) {
  const formatMap = {
    0: 'UNKNOWN',
    1: 'CODE_128',
    2: 'CODE_39',
    4: 'CODE_93',
    8: 'CODABAR',
    16: 'DATA_MATRIX',
    32: 'EAN_13',
    64: 'EAN_8',
    128: 'ITF',
    256: 'QR_CODE',
    512: 'UPC_A',
    1024: 'UPC_E',
    2048: 'PDF_417',
    4096: 'AZTEC'
  }
  if (typeof rawFormat === 'string') return rawFormat
  return formatMap[rawFormat] || 'UNKNOWN'
}

async function checkCameraPermission() {
  const { camera } = await BarcodeScanner.checkPermissions()
  if (camera === 'granted') return true

  if (camera === 'denied') {
    await showPermissionDenied()
    return false
  }

  // Berechtigung anfordern
  const result = await BarcodeScanner.requestPermissions()
  if (result.camera === 'granted') return true

  await showPermissionDenied()
  return false
}

async function showPermissionDenied() {
  const alert = await alertController.create({
    header: 'Kamera-Berechtigung benötigt',
    message: 'Die Kamera-Berechtigung wurde verweigert. Bitte erlaube den Kamera-Zugriff in den App-Einstellungen, um Barcodes scannen zu können.',
    buttons: [
      { text: 'Abbrechen', role: 'cancel' },
      {
        text: 'Einstellungen öffnen',
        handler: () => {
          BarcodeScanner.openSettings()
        }
      }
    ]
  })
  await alert.present()
}

async function scanWithCamera() {
  const hasPermission = await checkCameraPermission()
  if (!hasPermission) return

  try {
    const { barcodes: scannedBarcodes } = await BarcodeScanner.scan()
    if (scannedBarcodes && scannedBarcodes.length > 0) {
      for (const scanned of scannedBarcodes) {
        addBarcode(scanned)
      }
    }
  } catch (error) {
    console.error('Fehler beim Scannen:', error)
    await showToast('Fehler beim Scannen des Barcodes.')
  }
}

async function scanFromGallery() {
  try {
    const { barcodes: scannedBarcodes } = await BarcodeScanner.readBarcodesFromImage()
    if (scannedBarcodes && scannedBarcodes.length > 0) {
      for (const scanned of scannedBarcodes) {
        addBarcode(scanned)
      }
    } else {
      await showToast('Kein Barcode im ausgewählten Bild erkannt.')
    }
  } catch (error) {
    // Nutzer hat möglicherweise die Auswahl abgebrochen
    if (error.message && error.message.includes('cancel')) {
      return
    }
    console.error('Fehler beim Lesen des Bildes:', error)
    await showToast('Kein Barcode im ausgewählten Bild erkannt.')
  }
}

function addBarcode(scanned) {
  const barcode = {
    displayValue: scanned.displayValue || scanned.rawValue || '',
    format: mapFormat(scanned.format),
    valueType: mapValueType(scanned.valueType),
    scannedAt: new Date().toISOString()
  }
  barcodes.value.unshift(barcode)
  saveBarcodes()
}

// ==================== Scan-Optionen ====================

async function showScanOptions() {
  const actionSheet = await actionSheetController.create({
    header: 'Barcode scannen',
    buttons: [
      {
        text: 'Mit Kamera scannen',
        icon: cameraOutline,
        handler: () => scanWithCamera()
      },
      {
        text: 'Aus Galerie wählen',
        icon: imageOutline,
        handler: () => scanFromGallery()
      },
      {
        text: 'Abbrechen',
        icon: closeOutline,
        role: 'cancel'
      }
    ]
  })
  await actionSheet.present()
}

// ==================== Barcode-Aktionen ====================

async function closeSliding(index) {
  if (slidingItems.value && slidingItems.value[index]) {
    const el = slidingItems.value[index].$el || slidingItems.value[index]
    if (el && el.close) {
      await el.close()
    }
  }
}

async function shareBarcode(barcode, index) {
  await closeSliding(index)
  try {
    await Share.share({
      title: 'Barcode',
      text: `Wert: ${barcode.displayValue}\nFormat: ${barcode.format}\nTyp: ${barcode.valueType}`,
      dialogTitle: 'Barcode teilen'
    })
  } catch (error) {
    console.error('Fehler beim Teilen:', error)
  }
}

async function copyBarcode(barcode, index) {
  await closeSliding(index)
  try {
    await Clipboard.write({
      string: barcode.displayValue
    })
    await showToast('In die Zwischenablage kopiert!')
  } catch (error) {
    console.error('Fehler beim Kopieren:', error)
  }
}

function isOpenable(valueType) {
  return ['URL', 'PHONE', 'EMAIL', 'SMS', 'GEO'].includes(valueType)
}

async function openBarcode(barcode, index) {
  await closeSliding(index)
  try {
    switch (barcode.valueType) {
      case 'URL':
        await Browser.open({ url: barcode.displayValue })
        break
      case 'PHONE': {
        const phoneNumber = barcode.displayValue.replace(/\s/g, '')
        window.open(`tel:${phoneNumber}`, '_system')
        break
      }
      case 'EMAIL': {
        const email = barcode.displayValue
        window.open(`mailto:${email}`, '_system')
        break
      }
      case 'SMS': {
        const smsNumber = barcode.displayValue.replace(/\s/g, '')
        window.open(`sms:${smsNumber}`, '_system')
        break
      }
      case 'GEO': {
        const geoValue = barcode.displayValue
        window.open(`geo:${geoValue}`, '_system')
        break
      }
      default:
        await showToast('Dieser Barcode-Typ kann nicht geöffnet werden.')
    }
  } catch (error) {
    console.error('Fehler beim Öffnen:', error)
    await showToast('Fehler beim Öffnen des Barcodes.')
  }
}

async function confirmDelete(index) {
  const alert = await alertController.create({
    header: 'Barcode löschen',
    message: 'Möchtest du diesen Barcode wirklich löschen?',
    buttons: [
      { text: 'Abbrechen', role: 'cancel' },
      {
        text: 'Löschen',
        role: 'destructive',
        handler: () => {
          barcodes.value.splice(index, 1)
          saveBarcodes()
        }
      }
    ]
  })
  await alert.present()
}

// ==================== Export ====================

async function showExportActionSheet() {
  const actionSheet = await actionSheetController.create({
    header: 'Barcodes exportieren',
    buttons: [
      {
        text: 'Als JSON exportieren',
        handler: () => exportAsJson()
      },
      {
        text: 'Als CSV exportieren',
        handler: () => exportAsCsv()
      },
      {
        text: 'Abbrechen',
        icon: closeOutline,
        role: 'cancel'
      }
    ]
  })
  await actionSheet.present()
}

async function exportAsJson() {
  try {
    const data = JSON.stringify(barcodes.value, null, 2)
    const fileName = `barcodes_${Date.now()}.json`

    await Filesystem.writeFile({
      path: fileName,
      data: data,
      directory: Directory.Cache,
      encoding: Encoding.UTF8
    })

    const fileUri = await Filesystem.getUri({
      path: fileName,
      directory: Directory.Cache
    })

    await Share.share({
      title: 'Barcodes Export',
      url: fileUri.uri,
      dialogTitle: 'Barcodes teilen'
    })
  } catch (error) {
    console.error('Fehler beim JSON-Export:', error)
    await showToast('Fehler beim Exportieren.')
  }
}

async function exportAsCsv() {
  try {
    let csv = 'Wert,Format,Typ,Gescannt am\n'
    for (const b of barcodes.value) {
      const value = `"${(b.displayValue || '').replace(/"/g, '""')}"`
      csv += `${value},${b.format},${b.valueType},${b.scannedAt}\n`
    }

    const fileName = `barcodes_${Date.now()}.csv`

    await Filesystem.writeFile({
      path: fileName,
      data: csv,
      directory: Directory.Cache,
      encoding: Encoding.UTF8
    })

    const fileUri = await Filesystem.getUri({
      path: fileName,
      directory: Directory.Cache
    })

    await Share.share({
      title: 'Barcodes Export',
      url: fileUri.uri,
      dialogTitle: 'Barcodes teilen'
    })
  } catch (error) {
    console.error('Fehler beim CSV-Export:', error)
    await showToast('Fehler beim Exportieren.')
  }
}

// ==================== QR-Code Generator ====================

async function openQrGenerator() {
  const modal = await modalController.create({
    component: QrGeneratorModal
  })
  await modal.present()
}

// ==================== Hilfsfunktionen ====================

function getIconForType(valueType) {
  switch (valueType) {
    case 'URL': return linkOutline
    case 'PHONE': return callOutline
    case 'EMAIL': return mailOutline
    case 'SMS': return chatbubbleOutline
    case 'GEO': return locationOutline
    default: return barcodeOutline
  }
}

function formatDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function showToast(message) {
  const toast = await toastController.create({
    message,
    duration: 2000,
    position: 'bottom'
  })
  await toast.present()
}

// ==================== Lifecycle ====================

onMounted(() => {
  loadBarcodes()
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70%;
  text-align: center;
  padding: 2rem;
  color: var(--ion-color-medium);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 1rem;
  color: var(--ion-color-medium);
}

.empty-state h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.9rem;
  max-width: 280px;
}

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
