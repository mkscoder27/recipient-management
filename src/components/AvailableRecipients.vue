<script setup lang="ts">
import { computed } from 'vue'
import type { Recipient, Suggestion } from '../types/recipient'
import { getDomain, isValidEmail } from '../utils/helpers'

const props = defineProps<{
  allRecipients: Recipient[]
  searchQuery: string
  newEmail: string
}>()

const emit = defineEmits<{
  'select-recipient': [recipient: Recipient]
  'select-domain': [domain: string]
  'add-new-email': []
  'update:newEmail': [value: string]
}>()

// Group recipients by domain
const recipientsByDomain = computed(() => {
  const domains = new Map<string, Recipient[]>()
  
  props.allRecipients.forEach(recipient => {
    const domain = getDomain(recipient.email)
    if (!domains.has(domain)) {
      domains.set(domain, [])
    }
    domains.get(domain)?.push(recipient)
  })
  
  return domains
})

// Available domains for autocomplete
const availableDomains = computed(() => {
  return Array.from(recipientsByDomain.value.keys())
})

// Filtered suggestions based on search query
const suggestions = computed(() => {
  if (!props.searchQuery) return []
  
  const query = props.searchQuery.toLowerCase()
  const results: Suggestion[] = []
  
  // Add matching individual recipients
  props.allRecipients
    .filter(r => !r.isSelected && 
      (r.name.toLowerCase().includes(query) || 
       r.email.toLowerCase().includes(query)))
    .forEach(r => results.push(r))
  
  // Add matching domains
  availableDomains.value
    .filter(domain => domain.toLowerCase().includes(query))
    .forEach(domain => {
      results.push({
        id: `domain-${domain}`,
        name: `All @${domain} recipients`,
        type: 'domain',
        domain
      })
    })
  
  return results
})
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h2 class="text-xl font-semibold mb-4">Available Recipients</h2>
    
    <div class="space-y-4 mb-6">
      <div class="relative">
        <input
          type="text"
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          placeholder="Search recipients or company domain..."
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <!-- Suggestions Dropdown -->
        <div v-if="searchQuery && suggestions.length > 0" 
             class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          <div v-for="suggestion in suggestions" 
               :key="'suggestion-' + suggestion.id"
               class="p-2 hover:bg-gray-50 cursor-pointer"
               @click="suggestion.type === 'domain' ? 
                 emit('select-domain', (suggestion as any).domain) : 
                 emit('select-recipient', suggestion as Recipient)">
            <div class="font-medium">{{ suggestion.name }}</div>
            <div v-if="suggestion.type === 'individual'" class="text-sm text-gray-500">
              {{ (suggestion as Recipient).email }}
            </div>
          </div>
        </div>
      </div>
 
      <div class="flex gap-2">
        <input
          type="email"
          :value="newEmail"
          @input="emit('update:newEmail', ($event.target as HTMLInputElement).value)"
          placeholder="Enter new email..."
          class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @keyup.enter="emit('add-new-email')"
        />
        <button
          @click="emit('add-new-email')"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          :disabled="!isValidEmail(newEmail)"
        >
          Add Email
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="[domain, recipients] in recipientsByDomain" :key="domain" class="border rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold">@{{ domain }}</h3>
          <button
            v-if="recipients.some(r => !r.isSelected)"
            @click="emit('select-domain', domain)"
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Select All
          </button>
        </div>
        <div class="space-y-2">
          <div
            v-for="recipient in recipients.filter(r => !r.isSelected)"
            :key="recipient.id"
            class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
          >
            <div>
              <div class="font-medium">{{ recipient.name }}</div>
              <div class="text-sm text-gray-500">{{ recipient.email }}</div>
            </div>
            <button
              @click="emit('select-recipient', recipient)"
              class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>