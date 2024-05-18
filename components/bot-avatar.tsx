import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const BotAvatar = () => {
  return (
    <Avatar className="h-7 w-8">
      <AvatarImage className="p-1" src="/logo.png" />
    </Avatar>
  );
};
