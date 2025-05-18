"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressChartData } from "@/types/progress";

// We'll dynamically import the chart component to avoid SSR issues
let Chart: any;

interface ProgressChartProps {
  data: ProgressChartData;
  title?: string;
  description?: string;
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export function ProgressChart({
  data,
  title = "Progress Over Time",
  description = "Track your improvement over time",
  height = 300,
  showLegend = true,
  className,
}: ProgressChartProps) {
  const [mounted, setMounted] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // Handle client-side only rendering for the chart
  useEffect(() => {
    const loadChart = async () => {
      try {
        // Dynamically import the chart component
        const chartModule = await import("chart.js");
        const { Chart: ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } = chartModule;
        
        // Register required components
        ChartJS.register(
          CategoryScale,
          LinearScale,
          PointElement,
          LineElement,
          BarElement,
          Title,
          Tooltip,
          Legend
        );
        
        // Import the React wrapper
        const reactChartjs = await import("react-chartjs-2");
        Chart = reactChartjs;
        
        setMounted(true);
      } catch (error) {
        console.error("Failed to load chart:", error);
      }
    };

    loadChart();
  }, []);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Tabs defaultValue="line" className="w-[120px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="line" onClick={() => setChartType("line")}>Line</TabsTrigger>
              <TabsTrigger value="bar" onClick={() => setChartType("bar")}>Bar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          {mounted ? (
            chartType === "line" ? (
              <Chart.Line data={data} options={options} />
            ) : (
              <Chart.Bar data={data} options={options} />
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-muted-foreground">Loading chart...</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
