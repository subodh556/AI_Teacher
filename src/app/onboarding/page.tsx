"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    learningGoal: "",
    experienceLevel: "beginner",
    preferredTopics: [] as string[],
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (topic: string) => {
    setFormData((prev) => {
      const topics = [...prev.preferredTopics];
      if (topics.includes(topic)) {
        return { ...prev, preferredTopics: topics.filter((t) => t !== topic) };
      } else {
        return { ...prev, preferredTopics: [...topics, topic] };
      }
    });
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update user metadata with onboarding information
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          learningGoal: formData.learningGoal,
          experienceLevel: formData.experienceLevel,
          preferredTopics: formData.preferredTopics,
          onboardingComplete: true,
        },
      });

      // Redirect to dashboard after successful onboarding
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating user metadata:", error);
    }
  };
  const topics = [
    "Algorithms",
    "Data Structures",
    "Web Development",
    "Mobile Development",
    "Machine Learning",
    "Artificial Intelligence",
    "Database Systems",
    "Computer Networks",
    "Operating Systems",
    "Software Engineering",
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Help us personalize your learning experience
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between">
            <div className={`h-2 w-1/3 ${step >= 1 ? "bg-primary" : "bg-muted"}`}></div>
            <div className={`h-2 w-1/3 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div className={`h-2 w-1/3 ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">What is your learning goal?</h2>
              <textarea
                name="learningGoal"
                value={formData.learningGoal}
                onChange={handleInputChange}
                className="w-full min-h-[150px] p-3 border rounded-md"
                placeholder="I want to learn programming to..."
                required
              />
              <div className="flex justify-end">
                <Button type="button" onClick={handleNextStep}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">What is your experience level?</h2>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
                aria-label="Experience Level"
                required
              >
                <option value="beginner">Beginner - New to programming</option>
                <option value="intermediate">Intermediate - Some programming experience</option>
                <option value="advanced">Advanced - Experienced programmer</option>
              </select>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  Previous
                </Button>
                <Button type="button" onClick={handleNextStep}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Select topics you're interested in</h2>
              <div className="grid grid-cols-2 gap-3">
                {topics.map((topic) => (
                  <div
                    key={topic}
                    className={`p-3 border rounded-md cursor-pointer ${
                      formData.preferredTopics.includes(topic)
                        ? "bg-primary/10 border-primary"
                        : ""
                    }`}
                    onClick={() => handleTopicChange(topic)}
                  >
                    {topic}
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  Previous
                </Button>
                <Button type="submit">
                  Complete Profile
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
