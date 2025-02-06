"use client"
import { categoryColors, type Activity, type GroupedActivities } from '../../lib/types';
import { useState, useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface Activity {
//   name: string
// }

// interface GroupedActivities {
//   "HIGH LIFE TIME (HLV)": Activity[]
//   "HIGH DOLLAR (HDV)": Activity[]
//   "LOW DOLLAR (LDV)": Activity[]
//   "ZERO VALUE (ZV)": Activity[]
// }

// const categoryColors = {
//   "HIGH LIFE TIME (HLV)": "bg-green-600",
//   "HIGH DOLLAR (HDV)": "bg-blue-600",
//   "LOW DOLLAR (LDV)": "bg-sky-400",
//   "ZERO VALUE (ZV)": "bg-orange-500",
// }

interface ActivitiesTableProps {
  activities: GroupedActivities
  setActivities: React.Dispatch<React.SetStateAction<GroupedActivities>>
  onAddActivity: (updatedActivities: GroupedActivities) => void
  onDeleteActivity: (updatedActivities: GroupedActivities) => void
  plannerTitle: string
  setPlannerTitle: (title: string) => void
}

export function ActivitiesTable({
  activities,
  setActivities,
  onAddActivity,
  onDeleteActivity,
  plannerTitle,
  setPlannerTitle,
}: ActivitiesTableProps) {
  const [newActivity, setNewActivity] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<keyof GroupedActivities>("HIGH LIFE TIME (HLV)")
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    category: keyof GroupedActivities
    index: number
  } | null>(null)

  useEffect(() => {
    setActivities(activities)
  }, [activities, setActivities])

  // const addActivity = () => {
  //   if (!newActivity.trim()) return

  //   const updatedActivities = {
  //     ...activities,
  //     [selectedCategory]: [...activities[selectedCategory], { name: newActivity.trim() }],
  //   }
  //   setActivities(updatedActivities)
  //   onAddActivity(updatedActivities)
  //   setNewActivity("")
  // }
  const addActivity = () => {
    if (!newActivity.trim()) return;
    
    console.log('Adding activity:', {
      category: selectedCategory,
      activity: newActivity.trim()
    });
  
    const updatedActivities = {
      ...activities,
      [selectedCategory]: [
        ...activities[selectedCategory],
        { 
          name: newActivity.trim(),
          id: newActivity.trim()  // Add id here
        }
      ],
    };
  
    console.log('Updated activities:', updatedActivities);
    setActivities(updatedActivities);
    onAddActivity(updatedActivities);
    setNewActivity("");
  };

  
  const deleteActivity = (category: keyof GroupedActivities, index: number) => {
    const updatedActivities = {
      ...activities,
      [category]: activities[category].filter((_, i) => i !== index),
    }
    setActivities(updatedActivities)
    onDeleteActivity(updatedActivities)
    setDeleteConfirmation(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Planner name"
          value={plannerTitle}
          onChange={(e) => setPlannerTitle(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="New activity"
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as keyof GroupedActivities)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HIGH LIFE TIME (HLV)">High Life Time Value</SelectItem>
            <SelectItem value="HIGH DOLLAR (HDV)">High Dollar Value</SelectItem>
            <SelectItem value="LOW DOLLAR (LDV)">Low Dollar Value</SelectItem>
            <SelectItem value="ZERO VALUE (ZV)">Zero Value</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addActivity}>Add Activity</Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(activities).map((category) => (
                <TableHead
                  key={category}
                  className={`${categoryColors[category as keyof GroupedActivities]} text-white`}
                >
                  {category}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: Math.max(...Object.values(activities).map((cat) => cat.length)) }).map((_, index) => (
              <TableRow key={index}>
                {(Object.keys(activities) as Array<keyof GroupedActivities>).map((category) => (
                  <TableCell key={category}>
                    {activities[category][index] && (
                      <div className="flex items-center justify-between gap-2">
                        <span>{activities[category][index].name}</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirmation({ category, index })}
                            >
                              ×
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the activity "{activities[category][index].name}"?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={() => deleteActivity(category, index)}>
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

