<template>
  <div class="qr-container">
    <img :src="dataUrl" alt="QR-Code" class="qr-image" />
    <div class="qr-actions">
      <ion-button expand="block" @click="$emit('save')">
        <ion-icon slot="start" :icon="downloadOutline"></ion-icon>
        In Galerie speichern
      </ion-button>
      <ion-button expand="block" color="medium" @click="$emit('share')">
        <ion-icon slot="start" :icon="shareSocialOutline"></ion-icon>
        Teilen
      </ion-button>
    </div>
  </div>
</template>

<script setup>
import { IonButton, IonIcon } from '@ionic/vue'
import { downloadOutline, shareSocialOutline } from 'ionicons/icons'

defineProps({
  dataUrl: {
    type: String,
    required: true
  }
})

defineEmits(['save', 'share'])
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
</style>
