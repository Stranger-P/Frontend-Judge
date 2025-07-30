import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Helper to get the color based on submission count level
const getColorClass = (level) => {
  switch (level) {
    case 0:
      return 'bg-muted';
    case 1:
      return 'bg-emerald-500/20';
    case 2:
      return 'bg-emerald-500/40';
    case 3:
      return 'bg-emerald-500/60';
    case 4:
      return 'bg-emerald-500/80';
    default:
      return 'bg-emerald-500';
  }
};

// Day labels on the left side of the heatmap
const DayLabels = () => (
  <div className="flex flex-col gap-[9px] pr-2 text-xs text-muted-foreground">
    <div className="h-3"></div> {/* Spacer for month row */}
    <div className="h-3">M</div>
    <div className="h-3"></div>
    <div className="h-3">W</div>
    <div className="h-3"></div>
    <div className="h-3">F</div>
    <div className="h-3"></div>
  </div>
);

const SubmissionHeatmap = ({ heatmapData, totalSubmissions, maxStreak, currentStreak, setCurrentYear, currentYear }) => {
  // Memoize heatmap grid data
  const { weeklyData, monthLabels } = useMemo(() => {
    const weeks = [];
    const startDate = new Date(currentYear, 0, 1);
    const firstDayOfWeek = startDate.getDay();
    let currentDay = new Date(startDate);
    currentDay.setDate(currentDay.getDate() - firstDayOfWeek);

    // Generate weeks
    for (let i = 0; i < 53; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        const dateStr = currentDay.toISOString().split('T')[0];
        if (currentDay.getFullYear() === currentYear) {
          const count = heatmapData[dateStr] || 0;
          const level = count === 0 ? 0 : Math.min(Math.ceil(count / 2), 4);
          week.push({
            date: new Date(currentDay),
            data: { count, level },
          });
        } else {
          week.push(null);
        }
        currentDay.setDate(currentDay.getDate() + 1);
      }
      weeks.push(week);
    }

    // Generate month labels
    const mLabels = [];
    let lastMonth = -1;
    for (let i = 0; i < weeks.length; i++) {
      const firstDayOfWeek = weeks[i][0]?.date;
      if (firstDayOfWeek) {
        const month = firstDayOfWeek.getMonth();
        if (month !== lastMonth) {
          mLabels.push({ label: months[month], index: i });
          lastMonth = month;
        }
      }
    }

    return { weeklyData: weeks, monthLabels: mLabels };
  }, [heatmapData, currentYear]);

  return (
    <Card className="leetcode-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg font-medium flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {totalSubmissions} submissions in {currentYear}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentYear(currentYear - 1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-foreground font-medium">{currentYear}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentYear(currentYear + 1)}
              disabled={currentYear >= new Date().getFullYear()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex">
            <DayLabels />
            <div className="w-full overflow-x-auto pb-2">
              <div className="flex flex-col gap-2">
                {/* Month Labels */}
                <div className="flex gap-1" style={{ marginLeft: '-1px' }}>
                  {weeklyData.map((_, weekIndex) => (
                    <div key={weekIndex} className="w-3 text-xs text-muted-foreground">
                      {monthLabels.find(m => m.index === weekIndex)?.label}
                    </div>
                  ))}
                </div>

                {/* Heatmap Grid */}
                <div className="flex gap-1">
                  {weeklyData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => {
                        if (!day) return <div key={dayIndex} className="w-3 h-3" />;

                        return (
                          <Tooltip key={dayIndex} delayDuration={100}>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-3 h-3 rounded-[2px] ${getColorClass(day.data.level)}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">
                                {day.data.count} submissions on{' '}
                                {day.date.toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>

        {/* Legend and Stats */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={`w-3 h-3 rounded-[2px] ${getColorClass(level)}`} />
              ))}
            </div>
            <span>More</span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>
              Longest Streak: <span className="text-foreground font-medium">{maxStreak} days</span>
            </span>
            <span>
              Current Streak: <span className="text-foreground font-medium">{currentStreak} days</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionHeatmap;