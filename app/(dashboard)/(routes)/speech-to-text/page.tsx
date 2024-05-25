"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Heading } from "@/components/heading";
import { FileUpload } from "@/components/file-upload";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/empty";
import { Text } from "lucide-react";



const Transcription = () => {
  const [transcription, setTranscription] = useState<string | null>(null);
  const form = useForm();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: any) => {
    try {
      setTranscription(null);
      const formData = new FormData();
      formData.append("audio", values.audio[0]);

      const response = await axios.post("/api/speech-to-text", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTranscription(response.data.text);
      form.reset();
    } catch (error: any) {
      console.error("Transcription Error:", error);
    }
  };

  return (
    <div>
      <Heading
        title="Speech to Text"
        description="Convert your speech to text"
        icon={Text}
        bgColor="bg-yellow-700s/10"
        iconColor="text-yellow-700"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-12 gap-2"
          >
            <FormField
              name="audio"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormControl>
                    <FileUpload accept="audio/*" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12" disabled={isLoading}>
              Transcribe
            </Button>
          </form>
        </Form>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {!transcription && !isLoading && (
            <Empty label="No transcription available" />
          )}
          {transcription && (
            <div className="mt-8">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-lg">{transcription}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transcription;
