import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up to get started with AI Teacher
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary text-primary-foreground hover:bg-primary/90",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
          redirectUrl="/onboarding"
        />
      </div>
    </div>
  );
}
