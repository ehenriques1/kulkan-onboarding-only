import { KulkanMessage } from "@/components/KulkanMessage";
import { UserMessage } from "@/components/UserMessage";

export default function SampleChat() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
      <KulkanMessage className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 space-y-3">
        <h3 className="text-lg font-semibold mb-2">👋 Welcome to Kulkan AI Onboarding</h3>
        <p>Hi there! I'm Kulkan’s onboarding strategist.</p>
        <p>I’ll ask you a few simple questions to understand your startup.</p>
        <p>Based on your stage, I’ll adapt the questions to keep it relevant and focused. It should take just a few minutes.</p>
        <p className="font-semibold text-gray-900">👉 First up: What’s the name of your startup?</p>
      </KulkanMessage>

      <UserMessage content="Kulkan" />

      <KulkanMessage className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 space-y-3">
        <p>Great, thank you!</p>
        <p className="font-semibold text-gray-900">🌐 Do you have a website or landing page? (If not, just write “skip”)</p>
      </KulkanMessage>
    </div>
  );
} 