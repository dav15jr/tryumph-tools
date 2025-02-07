'use client';
import {
  categoryColors,
  type Activity,
  type GroupedActivities,
} from '../../lib/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/auth/protected-route';
import { WeeklySchedule } from '@/components/planner/weekly-schedule';
import { ProductivityChart } from '@/components/planner/productivity-chart';
import { ActivitiesTable } from '@/components/planner/activities-table';
import { PlannerSummary } from '@/components/planner/planner-summary';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

// interface Activity {
//   name: string
// }

// interface GroupedActivities {
//   "HIGH LIFE TIME (HLV)": Activity[]
//   "HIGH DOLLAR (HDV)": Activity[]
//   "LOW DOLLAR (LDV)": Activity[]
//   "ZERO VALUE (ZV)": Activity[]
// }

interface ScheduleData {
  [time: string]: {
    [day: string]: {
      activity: string;
      category: keyof GroupedActivities;
    } | null;
  };
}

interface PlannerData {
  activities: GroupedActivities;
  weeklySchedule: ScheduleData;
  title: string;
}

export default function PlannerPage() {
  const [activities, setActivities] = useState<GroupedActivities>({
    'HIGH LIFE TIME (HLV)': [],
    'HIGH DOLLAR (HDV)': [],
    'LOW DOLLAR (LDV)': [],
    'ZERO VALUE (ZV)': [],
  });
  const [plannerTitle, setPlannerTitle] = useState('');
  const [storedPlanners, setStoredPlanners] = useState<string[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<ScheduleData>({});
  const [productivityData, setProductivityData] = useState({
    HLV: 0,
    HDV: 0,
    LDV: 0,
    ZV: 0,
  });

  useEffect(() => {
    loadStoredPlanners();
  }, []);

  useEffect(() => {
    updateProductivityChart();
  }, [weeklySchedule]); //update productivity chart when weekly schedule changes

  useEffect(() => {
    console.log('Activities state:', activities);
  }, [activities]);

  const loadStoredPlanners = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const plannersRef = collection(db, 'users', user.uid, 'planners');
      const snapshot = await getDocs(plannersRef);
      const plannerTitles = snapshot.docs.map((doc) => doc.id);
      setStoredPlanners(plannerTitles);
    } catch (error) {
      console.error('Error loading stored planners:', error);
    }
  };

  const savePlanner = async (schedule: ScheduleData) => {
    const user = auth.currentUser;
    if (!user || !plannerTitle) return;

    try {
      const plannerRef = doc(db, 'users', user.uid, 'planners', plannerTitle);
      const plannerData: PlannerData = {
        activities,
        weeklySchedule: schedule,
        title: plannerTitle,
      };
      await setDoc(plannerRef, plannerData);
      console.log('Planner saved successfully');
      loadStoredPlanners();
      setWeeklySchedule(schedule);
    } catch (error) {
      console.error('Error saving planner:', error);
    }
  };

  const loadPlanner = async (
    selectedPlanner: string | null
  ): Promise<ScheduleData | undefined> => {
    const user = auth.currentUser;
    if (!user || !selectedPlanner) return;

    try {
      const plannerRef = doc(
        db,
        'users',
        user.uid,
        'planners',
        selectedPlanner
      );
      const plannerDoc = await getDoc(plannerRef);

      if (plannerDoc.exists()) {
        const plannerData = plannerDoc.data() as PlannerData;
        setActivities(plannerData.activities);
        setPlannerTitle(plannerData.title);
        setWeeklySchedule(plannerData.weeklySchedule);
        return plannerData.weeklySchedule;
      }
    } catch (error) {
      console.error('Error loading planner:', error);
    }
  };

  const updateProductivityChart = () => {
    const newProductivityData = {
      HLV: 0,
      HDV: 0,
      LDV: 0,
      ZV: 0,
    };

    Object.values(weeklySchedule).forEach((daySchedule) => {
      Object.values(daySchedule).forEach((cell) => {
        if (cell) {
          switch (cell.category) {
            case 'HIGH LIFE TIME (HLV)':
              newProductivityData.HLV++;
              break;
            case 'HIGH DOLLAR (HDV)':
              newProductivityData.HDV++;
              break;
            case 'LOW DOLLAR (LDV)':
              newProductivityData.LDV++;
              break;
            case 'ZERO VALUE (ZV)':
              newProductivityData.ZV++;
              break;
          }
        }
      });
    });

    setProductivityData(newProductivityData);
  };

  const handleAddActivity = (updatedActivities: GroupedActivities) => {
    setActivities(updatedActivities);
  };

  const handleDeleteActivity = (updatedActivities: GroupedActivities) => {
    setActivities(updatedActivities);
  };
  const mappedActivities = Object.entries(activities).flatMap(
    ([category, acts]) => {
      console.log('Category:', category);
      console.log('Acts:', acts);
      return acts.map((act) => {
        console.log('Processing activity:', act);
        return {
          ...act,
          id: act.name,
          category: category as keyof typeof categoryColors,
        };
      });
    }
  );

  console.log('Mapped activities:', mappedActivities);
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Card className="mb-8 no-print">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Productivity Planner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Plan your week efficiently by categorizing your activities and
              visualizing your time allocation.
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-4 md:gap-6 mb-6 no-print">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-4">
                <ActivitiesTable
                  activities={activities}
                  setActivities={setActivities}
                  onAddActivity={handleAddActivity}
                  onDeleteActivity={handleDeleteActivity}
                  plannerTitle={plannerTitle}
                  setPlannerTitle={setPlannerTitle}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="print-container">
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="mb-4 text-center">
                <h2 className="text-2xl md:text-4xl font-bold">
                  {plannerTitle}
                </h2>
              </div>
              <WeeklySchedule
                activities={Object.entries(activities).flatMap(
                  ([category, acts]) =>
                    acts.map((act) => ({
                      ...act,
                      id: act.name,
                      category: category as keyof typeof categoryColors,
                    }))
                )}
                onSave={savePlanner}
                onLoad={loadPlanner}
                savedSchedules={storedPlanners}
              />
            </div>
            <div className="space-y-6">
              <ProductivityChart data={productivityData} />
              <PlannerSummary data={productivityData} activities={activities} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
