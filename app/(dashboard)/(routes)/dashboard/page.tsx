"use client";

import {
  ArrowRight,
  Code,
  ImageIcon,
  MessageSquare,
  Volume2,
  Settings,
  VideoIcon,
  Text,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/conversation",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/video",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    label: "Text To Speech Generation",
    icon: Volume2,
    href: "/text-to-speech",
    bgColor: "bg-red-500/10",
    color: "text-red-500",
  },
  {
    label: "Speech To Text Generation",
    icon: Text,
    href: "/speech-to-text",
    bgColor: "bg-yellow-700/10",
    color: "text-yellow-700",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/code",
    bgColor: "bg-green-600/10",
    color: "text-green-600",
  },
];

const DashboardPage = () => {
  const router = useRouter();

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="font-light text-muted-foreground text-sm md:text-lg text-center">
          Chat with the smartest AI
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
