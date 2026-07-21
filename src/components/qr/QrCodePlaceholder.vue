<template>
  <div class="qr-placeholder">
    <ion-icon :icon="qrCodeOutline" class="placeholder-icon"></ion-icon>
    <p>Gib einen Text ein, um einen QR-Code zu generieren.</p>
  </div>
</template>

<script setup>
import { IonIcon } from '@ionic/vue'
import { qrCodeOutline } from 'ionicons/icons'
</script>

<style scoped>
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
