import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import { verifyToken } from "../../../../lib/auth";
import { Task } from "../../../../lib/types";
import { ObjectId } from "mongodb";

export async function PUT(request: Request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await verifyToken(token);
    const { title, description, completed } = await request.json();

    // Extract task ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Gets the dynamic [id]
    if (!id) {
      return NextResponse.json({ error: "Task ID missing" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const tasksCollection = db.collection<Task>("tasks");

    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { title, description, completed, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated" });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await verifyToken(token);

    // Extract task ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Task ID missing" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const tasksCollection = db.collection<Task>("tasks");

    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
