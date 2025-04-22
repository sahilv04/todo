import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";
import { Task } from "../../../lib/types";
import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await verifyToken(token); // Safe: Runs in Node.js runtime
    const db = await connectToDatabase();
    const tasksCollection = db.collection<Task>("tasks");

    const tasks = await tasksCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await verifyToken(token); // Safe: Runs in Node.js runtime
    const { title, description, completed } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const tasksCollection = db.collection<Task>("tasks");

    // Generate _id upfront
    const _id = new ObjectId();

    // Create task object with _id to satisfy Task interface
    const task: Task = {
      _id: _id,
      title,
      description: description || "",
      completed: completed || false,
      userId,
      createdAt: new Date(),
    };

    // Insert task into MongoDB
    await tasksCollection.insertOne({ ...task });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
