
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Code, Award, BarChart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-8 space-y-16">
      <main className="flex flex-col items-center justify-center gap-8 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          AI Teacher
        </h1>
        <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
          A revolutionary educational platform that leverages artificial intelligence to deliver truly personalized learning experiences at scale.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/learn/algorithms">
              Explore Content
            </Link>
          </Button>
        </div>
      </main>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <BookOpen className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
          
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <Code className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Interactive Coding</h3>
          
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <BarChart className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
          
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <Award className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Achievements</h3>
          
        </div>
      </section>

      <section className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your learning experience?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of students who are mastering computer science concepts with AI Teacher.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard">
              Start Learning Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
