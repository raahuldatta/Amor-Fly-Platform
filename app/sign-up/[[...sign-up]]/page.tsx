import { SignUp } from "@clerk/nextjs";
import { Animated3DBackground } from "@/components/ui/animated-3d-background";

export default function Page() {
  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden">
      <Animated3DBackground intensity={0.4} />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-pink-100/50 dark:from-gray-900/50 dark:via-purple-900/30 dark:to-pink-900/50" />
      
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">
        <div className="glass-card p-8 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce-in">
              <span className="text-2xl">🚀</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2 animate-fade-in">
              Join Amor Fly
            </h1>
            <p className="text-gray-600 dark:text-gray-400 animate-fade-in-delay">
              Start your learning journey today
            </p>
          </div>
          
          <SignUp 
            path="/sign-up" 
            routing="path"
            signInUrl="/sign-in"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200",
                formButtonPrimary: "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200",
                formFieldInput: "bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200",
                formFieldLabel: "text-gray-700 dark:text-gray-300 font-medium",
                footerActionLink: "text-pink-500 hover:text-pink-600 transition-colors duration-200",
                dividerLine: "bg-gray-200 dark:bg-gray-700",
                dividerText: "text-gray-500 dark:text-gray-400"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 