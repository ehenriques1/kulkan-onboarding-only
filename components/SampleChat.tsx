import { KulkanMessage } from "@/components/KulkanMessage";
import { UserMessage } from "@/components/UserMessage";

export default function SampleChat() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
      <KulkanMessage
        title="👋 Welcome to Kulkan AI Onboarding"
        intro="Hi there! I'm Kulkan’s onboarding strategist."
        body={[
          "I’ll ask you a few simple questions to understand your startup.",
          "Based on your stage, I’ll adapt the questions to keep it relevant and focused. It should take just a few minutes.",
          "Let’s get started!",
        ]}
        question="👉 First up: What’s the name of your startup?"
      />

      <UserMessage content="Kulkan" />

      <KulkanMessage
        body={["Great, thank you!"]}
        question="🌐 Do you have a website or landing page? (If not, just write “skip”)"
      />
    </div>
  );
} 