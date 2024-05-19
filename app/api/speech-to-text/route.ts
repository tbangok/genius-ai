// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import OpenAI from "openai";
// import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
// import fs from "fs";
// import path from "path";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const speechFile = path.resolve("./speech.mp3");
// // const instructionMessage: ChatCompletionMessageParam = {
// //   role: "system",
// //   content:
// //     "Answer questions as short and quickly as possible. You must do it under 75 tokens.",
// // };

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     const body = await req.json();
//     const { prompt, voice = "alloy" } = body;

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!openai.apiKey) {
//       return new NextResponse("OpenAI API Key not configured.", {
//         status: 500,
//       });
//     }

//     if (!prompt) {
//       return new NextResponse("Prompt is required", { status: 400 });
//     }
//     if (!voice) {
//       return new NextResponse("Voice is required", { status: 400 });
//     }

//     const mp3 = await openai.audio.speech.create({
//       model: "tts-1",
//       voice: voice,
//       input: "Today is a wonderful day to build something people love!",
//     });
//     console.log(speechFile);
//     const buffer = Buffer.from(await mp3.arrayBuffer());
//     await fs.promises.writeFile(speechFile, buffer);
//     // mp3.stream_to_file(speechFile)
//   } catch (error) {
//     console.log("[VOICE_ERROR]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }



import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const speechFile = path.resolve("./public/speech.mp3"); // Ensure the path is within the public directory

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, voice = "alloy" } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!openai.apiKey) {
      return NextResponse.json(
        { error: "OpenAI API Key not configured." },
        { status: 500 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
    if (!voice) {
      return NextResponse.json({ error: "Voice is required" }, { status: 400 });
    }

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: prompt,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    // Send the URL of the saved audio file back to the client
    return NextResponse.json({ url: "/speech.mp3" });
  } catch (error) {
    console.error("[VOICE_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

