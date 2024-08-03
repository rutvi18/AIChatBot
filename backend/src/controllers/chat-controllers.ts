import { NextFunction, Request, Response } from "express";
import User from "../models/user.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Entered generateChat");
  const message = req.body.Message;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    console.log("entered try(GCC)", user, req.body, message);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    // grab chats of user
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionMessageParam[];
    chats.push({ role: "user", content: message });
    user.chats.push({ role: "user", content: message });
    console.log("Chats", chats);

    // send all chats with new one to openAI API
    const config = configureOpenAI();
    const openai1 = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey:
        "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",
    });
    console.log("COnfig");
    // get latest response
    const chatResponse = await openai1.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: chats,
    });
    console.log("Chat response", chatResponse.choices[0].message);

    user.chats.push(chatResponse);
    console.log("pushed");
    await user.save();
    console.log("saved");
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const snedChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //user login
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunction");
    }
    if (user._id.toString() != res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);

    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunction");
    }
    if (user._id.toString() != res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK"});
  } catch (error) {
    console.log(error);

    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
