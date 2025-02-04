"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"

interface Habit {
  id: string
  name: string
  category: string
  completed: boolean
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    const loadHabits = async () => {
      const user = auth.currentUser
      if (user) {
        const habitsRef = collection(db, "users", user.uid, "habits")
        const snapshot = await getDocs(habitsRef)
        const loadedHabits = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Habit)
        setHabits(loadedHabits)
      }
    }
    loadHabits()
  }, [])

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newHabit.trim() && selectedCategory) {
      const user = auth.currentUser
      if (user) {
        const habitsRef = collection(db, "users", user.uid, "habits")
        const newHabitDoc = await addDoc(habitsRef, {
          name: newHabit.trim(),
          category: selectedCategory,
          completed: false,
        })
        setHabits([
          ...habits,
          {
            id: newHabitDoc.id,
            name: newHabit.trim(),
            category: selectedCategory,
            completed: false,
          },
        ])
        setNewHabit("")
        setSelectedCategory("")
      }
    }
  }

  const toggleHabit = async (id: string) => {
    const user = auth.currentUser
    if (user) {
      const habitRef = doc(db, "users", user.uid, "habits", id)
      const updatedHabits = habits.map((habit) => {
        if (habit.id === id) {
          const updatedHabit = { ...habit, completed: !habit.completed }
          // Update the habit in Firestore
          updateDoc(habitRef, { completed: updatedHabit.completed })
          return updatedHabit
        }
        return habit
      })
      setHabits(updatedHabits)
    }
  }

  const deleteHabit = async (id: string) => {
    const user = auth.currentUser
    if (user) {
      const habitRef = doc(db, "users", user.uid, "habits", id)
      await deleteDoc(habitRef)
      setHabits(habits.filter((habit) => habit.id !== id))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addHabit} className="space-y-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="newHabit">New Habit</Label>
              <Input
                id="newHabit"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Enter a new habit"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a category</option>
                <option value="Body">Body</option>
                <option value="Mind">Mind</option>
                <option value="Soul">Soul</option>
                <option value="Relationships">Relationships</option>
                <option value="Romance">Romance</option>
                <option value="Money">Money</option>
                <option value="Career">Career</option>
                <option value="Leisure">Leisure</option>
                <option value="Self Improvement">Self Improvement</option>
                <option value="Environment">Environment</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            Add Habit
          </Button>
        </form>
        <div className="space-y-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 p-2 bg-gray-100 rounded"
            >
              <div className="flex items-center space-x-2 flex-grow">
                <Checkbox id={habit.id} checked={habit.completed} onCheckedChange={() => toggleHabit(habit.id)} />
                <Label htmlFor={habit.id} className="flex-grow">
                  {habit.name} <span className="text-sm text-gray-500">({habit.category})</span>
                </Label>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteHabit(habit.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

