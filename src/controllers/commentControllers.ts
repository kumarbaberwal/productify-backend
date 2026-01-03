import type { Request, Response } from "express";
import * as queries from "../db/queries.ts";
import { getAuth } from "@clerk/express";
import type { Prisma } from "../../generated/prisma/client.ts";


export const createComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { content } = req.body as Prisma.CommentCreateInput;
    if (!content) return res.status(400).json({ error: "Comment content is required" });

    const { productId } = req.params;
    if (!productId) return res.status(404).json({ error: "Product id is required" });

    const existingProduct = await queries.getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        error: "Product not found",
      })
    }

    const comment = await queries.createComment({
      content,
      product: {
        connect: { id: productId }
      },
      user: {
        connect: { id: userId }
      }
    })

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment: ", error);
    res.status(500).json({
      error: "Failed to create a comment",
    })
  }
}



export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { commentId } = req.params;
    if (!commentId) return res.status(404).json({ error: "Comment id is required" });

    const existingComment = await queries.getCommentById(commentId);
    if (!existingComment) {
      return res.status(404).json({
        error: "Comment not found",
      })
    }

    if (existingComment.userId !== userId) return res.status(403).json({ error: "You can only delete your own comments" });

    await queries.deleteComment(commentId);

    res.status(200).json({
      error: "Comment deleted successfully"
    });
  } catch (error) {
    console.error("Error creating comment: ", error);
    res.status(500).json({
      error: "Failed to create a comment",
    })
  }
}