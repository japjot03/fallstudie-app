<template>
  <div class="empty-state">
    <ion-icon :icon="scanOutline" class="empty-icon"></ion-icon>
    <h2>Keine Barcodes vorhanden</h2>
    <p>Tippe auf den Button unten, um einen Barcode zu scannen.</p>
  </div>
</template>

<script setup>
import { IonIcon } from '@ionic/vue'
import { scanOutline } from 'ionicons/icons'
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
</style>
