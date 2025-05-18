"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  ChevronRight, 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Save, 
  Laptop 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useUIStore } from "@/store/ui-store";

export default function SettingsPage() {
  const { isLoaded, user } = useUser();
  const { theme, setTheme } = useTheme();
  const { 
    sidebarVisible, 
    setSidebarVisible, 
    rightPanelVisible, 
    setRightPanelVisible, 
    bottomPanelVisible, 
    setBottomPanelVisible 
  } = useUIStore();
  
  // Form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const [codeEditorTheme, setCodeEditorTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState("14");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Initialize form with user data when loaded
  useState(() => {
    if (isLoaded && user) {
      setDisplayName(user.fullName || "");
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    setFormSubmitted(true);
    
    // Reset form submitted state after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 3000);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground">Settings</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Moon className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    placeholder="Your display name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={user?.primaryEmailAddress?.emailAddress || ""} 
                    disabled 
                  />
                  <p className="text-xs text-muted-foreground">
                    To change your email, please visit your Clerk account settings.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Tell us about yourself"
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                {formSubmitted && (
                  <p className="ml-4 text-sm text-green-500">Profile updated successfully!</p>
                )}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              
              <div className="space-y-4">
                <Label>Layout</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sidebar" className="flex items-center cursor-pointer">
                      <span>Show Sidebar</span>
                    </Label>
                    <Switch 
                      id="sidebar" 
                      checked={sidebarVisible} 
                      onCheckedChange={setSidebarVisible} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rightPanel" className="flex items-center cursor-pointer">
                      <span>Show Right Panel</span>
                    </Label>
                    <Switch 
                      id="rightPanel" 
                      checked={rightPanelVisible} 
                      onCheckedChange={setRightPanelVisible} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bottomPanel" className="flex items-center cursor-pointer">
                      <span>Show Bottom Panel</span>
                    </Label>
                    <Switch 
                      id="bottomPanel" 
                      checked={bottomPanelVisible} 
                      onCheckedChange={setBottomPanelVisible} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Code Editor</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editorTheme">Editor Theme</Label>
                    <Select value={codeEditorTheme} onValueChange={setCodeEditorTheme}>
                      <SelectTrigger id="editorTheme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vs-dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger id="fontSize">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12px</SelectItem>
                        <SelectItem value="14">14px</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                        <SelectItem value="18">18px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotifications" className="flex items-center cursor-pointer">
                      <span>Enable Email Notifications</span>
                    </Label>
                    <Switch 
                      id="emailNotifications" 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                </div>
                
                {emailNotifications && (
                  <div className="ml-6 space-y-2 border-l pl-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailCourseUpdates" className="flex items-center cursor-pointer">
                        <span>Course Updates</span>
                      </Label>
                      <Switch id="emailCourseUpdates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailAchievements" className="flex items-center cursor-pointer">
                        <span>New Achievements</span>
                      </Label>
                      <Switch id="emailAchievements" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailReminders" className="flex items-center cursor-pointer">
                        <span>Learning Reminders</span>
                      </Label>
                      <Switch id="emailReminders" defaultChecked />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushNotifications" className="flex items-center cursor-pointer">
                      <span>Enable Push Notifications</span>
                    </Label>
                    <Switch 
                      id="pushNotifications" 
                      checked={pushNotifications} 
                      onCheckedChange={setPushNotifications} 
                    />
                  </div>
                </div>
                
                {pushNotifications && (
                  <div className="ml-6 space-y-2 border-l pl-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushStreakReminders" className="flex items-center cursor-pointer">
                        <span>Streak Reminders</span>
                      </Label>
                      <Switch id="pushStreakReminders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushAchievements" className="flex items-center cursor-pointer">
                        <span>New Achievements</span>
                      </Label>
                      <Switch id="pushAchievements" defaultChecked />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Data Collection</h3>
                <p className="text-sm text-muted-foreground">
                  We collect data to improve your learning experience. You can control what data is collected below.
                </p>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analyticsConsent" className="flex items-center cursor-pointer">
                      <span>Learning Analytics</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        (Helps us personalize your learning path)
                      </span>
                    </Label>
                    <Switch id="analyticsConsent" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="improvementConsent" className="flex items-center cursor-pointer">
                      <span>Product Improvement</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        (Helps us improve the platform)
                      </span>
                    </Label>
                    <Switch id="improvementConsent" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <h3 className="text-lg font-medium">Account Data</h3>
                <div className="space-y-4">
                  <Button variant="outline">Download Your Data</Button>
                  <Button variant="outline" className="text-red-500">
                    Delete Account
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Deleting your account will permanently remove all your data from our systems.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
