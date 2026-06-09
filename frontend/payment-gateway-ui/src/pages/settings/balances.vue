<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <router-link to="/settings/profile" class="text-indigo-600 hover:text-indigo-900">← Volver al perfil</router-link>
        <h1 class="text-2xl font-bold text-slate-900 mt-2">Balances y transacciones</h1>
        <p class="text-sm text-slate-600">Resumen financiero y desglose de transacciones del comercio.</p>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3 mb-6">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total recaudado</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">{{ formatMoney(totalCollected, displayCurrency) }}</p>
        <p class="text-sm text-slate-600">Suma de transacciones completadas</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Por pagar</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">{{ formatMoney(pendingAmount, displayCurrency) }}</p>
        <p class="text-sm text-slate-600">Transacciones pendientes</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Comisión plataforma</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">{{ formatMoney(platformCommission, displayCurrency) }}</p>
        <p class="text-sm text-slate-600">Comisiones acumuladas sobre ventas</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-900">Transacciones</h2>
      </div>

      <div v-if="isLoading" class="py-8 text-center text-slate-600">Cargando transacciones...</div>
      <div v-else-if="error" class="py-4 text-sm text-red-700">{{ error }}</div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                <th class="py-2 pr-4">ID</th>
                <th class="py-2 pr-4">Estado</th>
                <th class="py-2 pr-4">Monto</th>
                <th class="py-2 pr-4">Comisión</th>
                <th class="py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in transactions" :key="tx.id" class="border-b border-slate-100 text-sm text-slate-700">
                <td class="py-3 pr-4 font-mono">{{ tx.id ? tx.id.slice(0, 8) + '...' : 'N/A' }}</td>
                <td class="py-3 pr-4">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    tx.status === 'SUCCEEDED' || tx.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : tx.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700',
                  ]">{{ tx.status }}</span>
                </td>
                <td class="py-3 pr-4 font-semibold text-slate-900">{{ formatMoney(Number(tx.amount || 0), tx.currency || displayCurrency) }}</td>
                <td class="py-3 pr-4 font-semibold text-slate-900">{{ formatMoney(calcPlatformFee(Number(tx.amount || 0)), tx.currency || displayCurrency) }}</td>
                <td class="py-3">{{ new Date(tx.createdAt).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useMerchantStore } from '@/stores/merchant'
import { useAuthStore } from '@/stores/auth'
import { transactionService } from '@/services/transactions'

const merchantStore = useMerchantStore()
const authStore = useAuthStore()
const merchant = computed(() => merchantStore.current)

const isLoading = ref(false)
const error = ref('')
const transactions = ref<any[]>([])

function formatMoney(amount: number | null | undefined, currency = 'USD') {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount))
  } catch {
    return `${currency} ${Number(amount).toFixed(2)}`
  }
}

function calcPlatformFee(amount: number) {
  return amount * 0.029 + 0.3
}

const totalCollected = computed(() => {
  return transactions.value
    .filter((t) => ['SUCCEEDED', 'COMPLETED'].includes(String(t.status).toUpperCase()))
    .reduce((s, t) => s + Number(t.amount || 0), 0)
})

const pendingAmount = computed(() => {
  return transactions.value
    .filter((t) => String(t.status).toUpperCase() === 'PENDING')
    .reduce((s, t) => s + Number(t.amount || 0), 0)
})

const platformCommission = computed(() => {
  return transactions.value
    .filter((t) => ['SUCCEEDED', 'COMPLETED'].includes(String(t.status).toUpperCase()))
    .reduce((s, t) => s + calcPlatformFee(Number(t.amount || 0)), 0)
})

const displayCurrency = computed(() => transactions.value.length ? transactions.value[0].currency || 'USD' : 'USD')

async function fetchAll() {
  if (!merchant.value) return
  isLoading.value = true
  error.value = ''
  try {
    const resp = await transactionService.list(1, 1000)
    transactions.value = resp.items.filter((t: any) => t.merchantId === merchant.value!.id)
  } catch (err: any) {
    error.value = 'No se pudieron cargar las transacciones.'
    transactions.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // La página debe ser autosuficiente en navegación directa o al refrescar:
  // si el comercio aún no está cargado en el store, lo cargamos a partir de la sesión.
  if (!merchant.value) {
    await authStore.initializeSession()
    const id = authStore.user?.merchantId || authStore.user?.id
    if (id) {
      try {
        await merchantStore.fetchById(id)
      } catch {
        /* el watch de merchant disparará fetchAll cuando esté disponible */
      }
    }
  }
  fetchAll()
})

watch(merchant, (v) => {
  if (v) fetchAll()
})
</script>


