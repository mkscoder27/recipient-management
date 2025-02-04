<script setup lang="ts">
import { computed } from 'vue'
import type { Recipient } from '../types/recipient'
import { getDomain } from '../utils/helpers'

const props = defineProps<{
  selectedRecipients: Recipient[]
}>()

const emit = defineEmits<{
  'remove-recipient': [recipient: Recipient]
  'remove-domain': [domain: string]
}>()

// Group selected recipients by domain
const selectedRecipientsByDomain = computed(() => {
  const domains = new Map<string, Recipient[]>()
  
  props.selectedRecipients.forEach(recipient => {
    const domain = getDomain(recipient.email)
    if (!domains.has(domain)) {
      domains.set(domain, [])
    }
    domains.get(domain)?.push(recipient)
  })
  
  return domains
})
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h2 class="text-xl font-semibold mb-4">Selected Recipients</h2>
    <div class="space-y-4">
      <div v-for="[domain, recipients] in selectedRecipientsByDomain" :key="domain" class="border rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold">@{{ domain }}</h3>
          <button
            @click="emit('remove-domain', domain)"
            class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Remove All
          </button>
        </div>
        <div class="space-y-2">
          <div
            v-for="recipient in recipients"
            :key="recipient.id"
            class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
          >
            <div>
              <div class="font-medium">{{ recipient.name }}</div>
              <div class="text-sm text-gray-500">{{ recipient.email }}</div>
            </div>
            <button
              @click="emit('remove-recipient', recipient)"
              class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>