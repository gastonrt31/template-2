'use client'

import { useState } from 'react'
import { createUser } from '@/lib/supabase/supabaseUtils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User, UserIcon, Car, CreditCard } from 'lucide-react'

interface UserFormProps {
  onSuccess: () => void
}

export function UserForm({ onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    license_plate: '',
    identity_card_number: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createUser(formData)
      setFormData({
        name: '',
        license_plate: '',
        identity_card_number: ''
      })
      onSuccess()
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setLoading(false)
    }
  }

  // Input validation functions
  const validateName = (value: string) => {
    return value.length >= 2 && /^[a-zA-Z\s]*$/.test(value)
  }

  const validateLicensePlate = (value: string) => {
    // Format: ABC-123 or ABC123
    return /^[A-Z]{3}[-]?\d{3}$/.test(value.toUpperCase())
  }

  const validateIdentityCard = (value: string) => {
    // Assumes a 10-digit number
    return /^\d{10}$/.test(value)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
    setFormData({ ...formData, name: value })
  }

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    if (value.length <= 7) {
      setFormData({ ...formData, license_plate: value })
    }
  }

  const handleIdentityCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 10) {
      setFormData({ ...formData, identity_card_number: value })
    }
  }

  const isFormValid = 
    validateName(formData.name) &&
    validateLicensePlate(formData.license_plate) &&
    validateIdentityCard(formData.identity_card_number)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Name
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleNameChange}
            className={validateName(formData.name) || !formData.name ? '' : 'border-red-500'}
            placeholder="John Doe"
          />
          {formData.name && !validateName(formData.name) && (
            <p className="text-xs text-red-500">Name must be at least 2 characters and contain only letters</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="license_plate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Car className="h-4 w-4" />
            License Plate
          </label>
          <Input
            id="license_plate"
            value={formData.license_plate}
            onChange={handleLicensePlateChange}
            className={validateLicensePlate(formData.license_plate) || !formData.license_plate ? '' : 'border-red-500'}
            placeholder="ABC-123"
          />
          {formData.license_plate && !validateLicensePlate(formData.license_plate) && (
            <p className="text-xs text-red-500">Format: ABC-123 or ABC123</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="identity_card_number" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Identity Card Number
          </label>
          <Input
            id="identity_card_number"
            value={formData.identity_card_number}
            onChange={handleIdentityCardChange}
            className={validateIdentityCard(formData.identity_card_number) || !formData.identity_card_number ? '' : 'border-red-500'}
            placeholder="1234567890"
          />
          {formData.identity_card_number && !validateIdentityCard(formData.identity_card_number) && (
            <p className="text-xs text-red-500">Must be exactly 10 digits</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || !isFormValid}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  )
} 