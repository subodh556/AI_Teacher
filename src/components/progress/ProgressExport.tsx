"use client";

import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ProgressExport } from "@/types/progress";

interface ProgressExportComponentProps {
  userId: string;
  onExport: (exportOptions: ProgressExport) => void;
  className?: string;
}

export function ProgressExportComponent({
  userId,
  onExport,
  className,
}: ProgressExportComponentProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [includeActivities, setIncludeActivities] = useState(true);
  const [includeAssessments, setIncludeAssessments] = useState(true);
  const [includeAchievements, setIncludeAchievements] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [format, setFormat] = useState<"json" | "csv">("json");

  const handleExport = () => {
    onExport({
      userId,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      includeActivities,
      includeAssessments,
      includeAchievements,
      includeMetrics,
      format,
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Export Progress Data</CardTitle>
        <CardDescription>
          Download your learning progress data for analysis or backup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Date Range</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label htmlFor="start-date" className="text-xs text-muted-foreground mb-1 block">
                Start Date (Optional)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <Label htmlFor="end-date" className="text-xs text-muted-foreground mb-1 block">
                End Date (Optional)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Include Data</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-activities"
                checked={includeActivities}
                onCheckedChange={(checked) => setIncludeActivities(!!checked)}
              />
              <Label htmlFor="include-activities">Learning Activities</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-assessments"
                checked={includeAssessments}
                onCheckedChange={(checked) => setIncludeAssessments(!!checked)}
              />
              <Label htmlFor="include-assessments">Assessment Results</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-achievements"
                checked={includeAchievements}
                onCheckedChange={(checked) => setIncludeAchievements(!!checked)}
              />
              <Label htmlFor="include-achievements">Achievements</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-metrics"
                checked={includeMetrics}
                onCheckedChange={(checked) => setIncludeMetrics(!!checked)}
              />
              <Label htmlFor="include-metrics">Progress Metrics</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Export Format</h3>
          <RadioGroup
            defaultValue="json"
            value={format}
            onValueChange={(value) => setFormat(value as "json" | "csv")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="format-json" />
              <Label htmlFor="format-json" className="flex items-center">
                <FileJson className="h-4 w-4 mr-1" />
                JSON
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="format-csv" />
              <Label htmlFor="format-csv" className="flex items-center">
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                CSV
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExport} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </CardFooter>
    </Card>
  );
}
