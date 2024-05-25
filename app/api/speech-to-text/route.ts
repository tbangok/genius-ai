import { auth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import formidable from "formidable";
import { createReadStream } from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parseForm = (req: NextApiRequest) =>
  new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    }
  );

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = auth();

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!openai.apiKey) {
      return res.status(500).json({ error: "OpenAI API Key not configured." });
    }

    const { fields, files } = await parseForm(req);
    const { prompt } = fields;
    const file = files.file;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(file.path),
      model: "whisper-1",
    });

    return res.status(200).json({ transcription: transcription.text });
  } catch (error) {
    console.error("[VOICE_ERROR]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
