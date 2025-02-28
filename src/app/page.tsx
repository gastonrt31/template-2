'use client'

import { useEffect, useState } from 'react'
import { User } from '@/types'
import { UserForm } from '@/components/UserForm'
import { UsersTable } from '@/components/UsersTable'
import { getUsers, subscribeToUsers } from '@/lib/supabase/supabaseUtils'
import { testConnection } from '@/lib/supabase/testConnection'

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    // Test connection
    testConnection().then((success) => {
      setConnectionStatus(success ? 'success' : 'error')
    })

    // Initial fetch
    getUsers().then(setUsers)

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUsers(setUsers)

    return () => {
      unsubscribe()
    }
  }, [])

  if (connectionStatus === 'testing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg">Testing connection to Supabase...</p>
      </div>
    )
  }

  if (connectionStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-red-600 mb-4">Connection Error</h1>
          <p className="text-gray-600">Could not connect to Supabase. Please check your credentials and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">QR Code Check-in System</h1>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showForm ? 'Close Form' : 'Add New User'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Create New User</h2>
              <UserForm onSuccess={() => {
                getUsers().then(setUsers)
                setShowForm(false)
              }} />
            </div>
          </div>
        )}

        <UsersTable users={users} />
      </div>
    </main>
  )
}
