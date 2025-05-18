"use client";

import { useState } from "react";
import { Plus, Target, Calendar, CheckCircle, Edit, Trash, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserGoal } from "@/types/progress";

interface GoalTrackerProps {
  goals: UserGoal[];
  topics?: { id: string; name: string }[];
  onCreateGoal?: (goal: Omit<UserGoal, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateGoal?: (id: string, updates: Partial<UserGoal>) => void;
  onDeleteGoal?: (id: string) => void;
  className?: string;
}

export function GoalTracker({
  goals,
  topics = [],
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
  className,
}: GoalTrackerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);
  
  // Form state for new goal
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetValue: 5,
    goalType: "weekly" as UserGoal["goalType"],
    topicId: "",
  });

  // Form state for editing goal
  const [editGoal, setEditGoal] = useState({
    title: "",
    description: "",
    targetValue: 5,
    goalType: "weekly" as UserGoal["goalType"],
    topicId: "",
  });

  // Handle creating a new goal
  const handleCreateGoal = () => {
    if (onCreateGoal) {
      onCreateGoal({
        ...newGoal,
        userId: "", // This will be set by the API
        currentValue: 0,
        startDate: new Date().toISOString(),
        completed: false,
      });
    }
    
    // Reset form and close dialog
    setNewGoal({
      title: "",
      description: "",
      targetValue: 5,
      goalType: "weekly",
      topicId: "",
    });
    setIsCreateDialogOpen(false);
  };

  // Handle editing a goal
  const handleEditGoal = () => {
    if (selectedGoal && onUpdateGoal) {
      onUpdateGoal(selectedGoal.id, editGoal);
    }
    
    // Reset form and close dialog
    setSelectedGoal(null);
    setIsEditDialogOpen(false);
  };

  // Handle deleting a goal
  const handleDeleteGoal = (id: string) => {
    if (onDeleteGoal) {
      onDeleteGoal(id);
    }
  };

  // Open edit dialog for a goal
  const openEditDialog = (goal: UserGoal) => {
    setSelectedGoal(goal);
    setEditGoal({
      title: goal.title,
      description: goal.description,
      targetValue: goal.targetValue,
      goalType: goal.goalType,
      topicId: goal.topicId || "",
    });
    setIsEditDialogOpen(true);
  };

  // Format goal type for display
  const formatGoalType = (type: UserGoal["goalType"]) => {
    switch (type) {
      case "daily": return "Daily";
      case "weekly": return "Weekly";
      case "monthly": return "Monthly";
      case "total": return "Overall";
      default: return type;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Learning Goals</CardTitle>
            <CardDescription>Track your progress towards your goals</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a new learning goal to track your progress
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="Complete 5 lessons"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your goal"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetValue">Target Value</Label>
                    <Input
                      id="targetValue"
                      type="number"
                      min={1}
                      value={newGoal.targetValue}
                      onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goalType">Goal Type</Label>
                    <Select
                      value={newGoal.goalType}
                      onValueChange={(value) => setNewGoal({ ...newGoal, goalType: value as UserGoal["goalType"] })}
                    >
                      <SelectTrigger id="goalType">
                        <SelectValue placeholder="Select goal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="total">Overall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topicId">Topic (Optional)</Label>
                  <Select
                    value={newGoal.topicId}
                    onValueChange={(value) => setNewGoal({ ...newGoal, topicId: value })}
                  >
                    <SelectTrigger id="topicId">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Topics</SelectItem>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGoal}>Create Goal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <Target className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(goal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatGoalType(goal.goalType)}</span>
                    </div>
                    <span className="text-xs font-medium">
                      {goal.currentValue} / {goal.targetValue}
                    </span>
                  </div>
                  <Progress
                    value={(goal.currentValue / goal.targetValue) * 100}
                    className="h-2"
                  />
                </div>
                {goal.topicName && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">
                      Topic: {goal.topicName}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No goals set yet. Create your first learning goal!</p>
          </div>
        )}
      </CardContent>
      
      {/* Edit Goal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>
              Update your learning goal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Goal Title</Label>
              <Input
                id="edit-title"
                placeholder="Complete 5 lessons"
                value={editGoal.title}
                onChange={(e) => setEditGoal({ ...editGoal, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe your goal"
                value={editGoal.description}
                onChange={(e) => setEditGoal({ ...editGoal, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-targetValue">Target Value</Label>
                <Input
                  id="edit-targetValue"
                  type="number"
                  min={1}
                  value={editGoal.targetValue}
                  onChange={(e) => setEditGoal({ ...editGoal, targetValue: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-goalType">Goal Type</Label>
                <Select
                  value={editGoal.goalType}
                  onValueChange={(value) => setEditGoal({ ...editGoal, goalType: value as UserGoal["goalType"] })}
                >
                  <SelectTrigger id="edit-goalType">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="total">Overall</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-topicId">Topic (Optional)</Label>
              <Select
                value={editGoal.topicId}
                onValueChange={(value) => setEditGoal({ ...editGoal, topicId: value })}
              >
                <SelectTrigger id="edit-topicId">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditGoal}>Update Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
