export type StepType = 'login' | 'signup' | 'otp';

export const stepContent = {
    login: {
        title: "Glide",
        subtitle: "Sign in to your premium space",
        buttonText: "Continue",
        footerText: "Don't have an account?",
        footerActionText: "Sign Up",
        nextStep: 'signup' as StepType
    },
    signup: {
        title: "Glide",
        subtitle: "Create your premium account",
        buttonText: "Get Started",
        footerText: "Already have an account?",
        footerActionText: "Sign In",
        nextStep: 'login' as StepType
    },
    otp: {
        title: "Verification",
        subtitle: "Enter the code sent to your email",
        buttonText: "Verify and Create Account",
        footerText: "Didn't receive the code?",
        footerActionText: "Resend Code",
        nextStep: 'login' as StepType
    }
};