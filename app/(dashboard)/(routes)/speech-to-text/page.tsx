"use client";
import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Volume2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema, voiceOptions } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import AudioPlayer from "@/components/ui/audio-player";

const TextToSpeech = () => {
  const router = useRouter();
  const [audio, setAudio] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      voice: "alloy",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setAudio(null);
      const response = await axios.post("/api/text-to-speech", values);
      console.log(response);
      setAudio(response.data.url);

      form.reset();
    } catch (error: any) {
      //todo: open pro modal
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Text to Speech"
        description="Convert your text to speech"
        icon={Volume2}
        iconColor="text-red-500"
        bgColor="bg-red-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-12 rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-8">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Enter text to convert to speech"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="voice"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {voiceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {!audio && !isLoading && <Empty label="No audio generated" />}
          {audio && (
            <div className="mt-8">
              <Card className="rounded-lg overflow-hidden">
                <CardFooter className="p-2">
                  <AudioPlayer src={audio} />
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
