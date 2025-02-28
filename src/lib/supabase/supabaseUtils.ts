import { User, StageNumber, Stage } from '@/types'
import { supabase } from './supabase'

// Create a new user
export const createUser = async (userData: {
  name: string
  license_plate: string
  identity_card_number: string
}) => {
  try {
    const userDoc = {
      ...userData,
      stages: {
        '1': { status: 'PENDING' },
        '2': { status: 'PENDING' },
        '3': { status: 'PENDING' }
      },
      qr_code: JSON.stringify(userData),
    }

    const { data, error } = await supabase
      .from('users')
      .insert(userDoc)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting users:', error)
    throw error
  }
}

// Update stage status
export const updateStageStatus = async (
  userId: string,
  stageNumber: StageNumber,
  status: Stage['status']
) => {
  try {
    // First, get the current user data
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('stages')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    // Create updated stages object
    const updatedStages = {
      ...userData.stages,
      [stageNumber]: {
        status,
        scan_time: status === 'CHECK' ? new Date().toISOString() : null
      }
    }

    // Update with the new stages object
    const { error } = await supabase
      .from('users')
      .update({ stages: updatedStages })
      .eq('id', userId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating stage status:', error)
    throw error
  }
}

// Subscribe to users changes (real-time)
export const subscribeToUsers = (callback: (users: User[]) => void) => {
  const subscription = supabase
    .channel('users_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'users'
      },
      async () => {
        // Fetch updated data
        const { data } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (data) callback(data)
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
} 