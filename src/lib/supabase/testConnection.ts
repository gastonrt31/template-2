import { supabase } from './supabase'

export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Error connecting to Supabase:', error.message)
      return false
    }

    console.log('Successfully connected to Supabase!')
    console.log('Test query result:', data)
    return true
  } catch (error) {
    console.error('Error testing Supabase connection:', error)
    return false
  }
} 