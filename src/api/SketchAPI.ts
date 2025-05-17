import Sketch from '../models/Sketch'
import { supabase } from './supabase'

// Function to publish a sketch
export async function publishSketch(sketch: Sketch): Promise<void> {
  const { error } = await supabase
    .from('sketches')
    .insert([{ title: sketch.title, artist: sketch.artist, data: JSON.stringify(sketch.toJSON()) }])
    .select()
    .single()

  if (error) {
    throw error
  }
}

// Function to get all published sketches
export async function getPublishedSketches(): Promise<Sketch[]> {
  const { data: sketches, error } = await supabase
    .from('sketches')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (
    sketches.map((sketch) => {
      return Sketch.fromJSON(JSON.parse(sketch.data))
    }) || []
  )
}
