'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PrinterIcon as Print } from 'lucide-react';

const timeSlots = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const categoryColors = {
  'HIGH LIFE TIME (HLV)': 'bg-green-600',
  'HIGH DOLLAR (HDV)': 'bg-blue-600',
  'LOW DOLLAR (LDV)': 'bg-sky-400',
  'ZERO VALUE (ZV)': 'bg-orange-500',
} as const;

interface ScheduleCell {
  activity: string;
  category: keyof typeof categoryColors;
}

type ScheduleData = {
  [time: string]: {
    [day: string]: ScheduleCell | null;
  };
};

interface Activity {
  id: string;
  name: string;
  category: keyof typeof categoryColors;
}

interface WeeklyScheduleProps {
  activities: Activity[];
  onSave: (schedule: ScheduleData) => void;
  onLoad: (selectedSchedule?: string) => Promise<ScheduleData | undefined>;
  savedSchedules: string[];
}

function SortableItem(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}

export function WeeklySchedule({
  activities,
  onSave,
  onLoad,
  savedSchedules,
}: WeeklyScheduleProps) {
  const [schedule, setSchedule] = useState<ScheduleData>({});
  const [selectedCell, setSelectedCell] = useState<{
    time: string;
    day: string;
  } | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    const loadedSchedule = await onLoad(selectedSchedule);
    if (loadedSchedule) {
      setSchedule(loadedSchedule);
    }
  };

  const handleCellClick = (time: string, day: string) => {
    setSelectedCell({ time, day });
  };

  const handleActivitySelect = (value: string) => {
    if (!selectedCell) return;

    const [category, activityName] = value.split(':');

    const newSchedule = { ...schedule };
    if (!newSchedule[selectedCell.time]) {
      newSchedule[selectedCell.time] = {};
    }

    newSchedule[selectedCell.time][selectedCell.day] = {
      activity: activityName.trim(),
      category: category as keyof typeof categoryColors,
    };

    setSchedule(newSchedule);
    setSelectedCell(null);
  };

  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const [activeTime, activeDay] = active.id.split('-');
      const [overTime, overDay] = over.id.split('-');

      setSchedule((prevSchedule) => {
        const newSchedule = JSON.parse(JSON.stringify(prevSchedule));
        const movedActivity = newSchedule[activeTime][activeDay];
        newSchedule[activeTime][activeDay] = null;
        if (!newSchedule[overTime]) newSchedule[overTime] = {};
        newSchedule[overTime][overDay] = movedActivity;
        return newSchedule;
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <Select
            onValueChange={setSelectedSchedule}
            value={selectedSchedule || undefined}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select schedule" />
            </SelectTrigger>
            <SelectContent>
              {savedSchedules.map((scheduleName) => (
                <SelectItem key={scheduleName} value={scheduleName}>
                  {scheduleName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={loadSchedule} disabled={!selectedSchedule}>
            Load Schedule
          </Button>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <Button onClick={() => onSave(schedule)}>Save Schedule</Button>
          <Button onClick={handlePrint} variant="outline">
            <Print className="mr-2 h-4 w-4" /> Print Schedule
          </Button>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center">
            <div className={`w-4 h-4 ${color} mr-2`}></div>
            <span className="text-sm">{category}</span>
          </div>
        ))}
      </div>
      <div className="border rounded-lg overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Time</TableHead>
                {days.map((day) => (
                  <TableHead key={day}>{day}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((time) => (
                <TableRow key={time}>
                  <TableCell className="font-medium">{time}</TableCell>
                  {days.map((day) => (
                    <TableCell
                      key={`${day}-${time}`}
                      className="p-0 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleCellClick(time, day)}
                    >
                      {selectedCell?.time === time &&
                      selectedCell?.day === day ? (
                        <Select onValueChange={handleActivitySelect}>
                          <SelectTrigger className="w-full h-full border-0">
                            <SelectValue placeholder="Select activity" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(groupedActivities).map(
                              ([category, categoryActivities]) => (
                                <SelectGroup key={category}>
                                  <SelectLabel>{category}</SelectLabel>
                                  {categoryActivities.map((activity) => (
                                    <SelectItem
                                      key={activity.id}
                                      value={`${activity.category}:${activity.name}`}
                                    >
                                      {activity.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <SortableContext
                          items={[`${time}-${day}`]}
                          strategy={verticalListSortingStrategy}
                        >
                          <SortableItem id={`${time}-${day}`}>
                            <div
                              className={`${
                                schedule[time]?.[day]
                                  ? categoryColors[schedule[time][day].category]
                                  : ''
                              } text-white p-2 text-sm min-h-[40px] transition-colors`}
                            >
                              {schedule[time]?.[day] &&
                                `${schedule[time][day].activity}`}
                            </div>
                          </SortableItem>
                        </SortableContext>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
}
