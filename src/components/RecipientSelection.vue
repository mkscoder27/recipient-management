<script setup lang="ts">
import { ref } from 'vue'
import type { Recipient } from '../types/recipient'
import { getDomain, isValidEmail } from '../utils/helpers'
import AvailableRecipients from './AvailableRecipients.vue'
import SelectedRecipients from './SelectedRecipients.vue'

const allRecipients = ref<Recipient[]>([
  { id: 1, name: 'Manish Singh', email: 'manish@example.com', isSelected: false, type: 'individual' },
  { id: 2, name: 'Diksha Singh', email: 'diksha@example.com', isSelected: false, type: 'individual' },
  { id: 3, name: 'Ashutosh Kaushik', email: 'ashu@motadata.com', isSelected: false, type: 'individual' },
  { id: 4, name: 'Krishna Sharma', email: 'krishna@motadata.com', isSelected: false, type: 'individual' },
])

const selectedRecipients = ref<Recipient[]>([])
const searchQuery = ref('')
const newEmail = ref('')

const selectRecipient = (recipient: Recipient) => {
  recipient.isSelected = true
  selectedRecipients.value.push(recipient)
  searchQuery.value = ""
}

const selectDomain = (domain: string) => {
  const domainRecipients = allRecipients.value.filter(r => 
    !r.isSelected && getDomain(r.email) === domain
  )
  searchQuery.value = ""
  domainRecipients.forEach(recipient => {
    recipient.isSelected = true
    selectedRecipients.value.push(recipient)
  })
}

const removeRecipient = (recipient: Recipient) => {
  recipient.isSelected = false
  selectedRecipients.value = selectedRecipients.value.filter(r => r.id !== recipient.id)
}

const removeDomain = (domain: string) => {
  const domainRecipients = selectedRecipients.value.filter(r => getDomain(r.email) === domain)
  domainRecipients.forEach(recipient => {
    recipient.isSelected = false
  })
  selectedRecipients.value = selectedRecipients.value.filter(r => getDomain(r.email) !== domain)
}

const addNewEmail = () => {
  if (isValidEmail(newEmail.value)) {
    const domain = getDomain(newEmail.value)
    const newRecipient: Recipient = {
      id: Date.now(),
      name: newEmail.value,
      email: newEmail.value,
      isSelected: false,
      type: 'individual'
    }
    allRecipients.value.push(newRecipient)
    newEmail.value = ''
  }
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="grid grid-cols-2 gap-6">
      <AvailableRecipients
        :all-recipients="allRecipients"
        v-model:search-query="searchQuery"
        v-model:new-email="newEmail"
        @select-recipient="selectRecipient"
        @select-domain="selectDomain"
        @add-new-email="addNewEmail"
      />
      <SelectedRecipients
        :selected-recipients="selectedRecipients"
        @remove-recipient="removeRecipient"
        @remove-domain="removeDomain"
      />
    </div>
  </div>
</template>