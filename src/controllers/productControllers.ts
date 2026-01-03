import type { Request, Response } from "express";
import * as queries from "../db/queries.ts";
import { getAuth } from "@clerk/express";
import type { Prisma } from "../../generated/prisma/browser.ts";


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await queries.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching all products: ", error);
    res.status(500).json({
      error: "Error fetching all products"
    })
  }
}


// get product by user (protected)
export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      })
    }

    const products = await queries.getProductsByUserId(userId);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching user products: ", error);
    res.status(500).json({
      error: "Error fetching user products"
    })
  }
}



// get single product by id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Product id is required" });
    }
    const product = await queries.getProductById(id);
    if (!product) {
      return res.status(400).json({
        error: "Product not found"
      });
    }

    res.status(200).json(product)
  } catch (error) {
    console.error("Error fetching the product: ", error);
    res.status(500).json({
      error: "Error fetcing the product"
    })
  }
}



// create product (protected)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { title, description, imageUrl } = req.body;
    if (!title || !description || !imageUrl) {
      return res.status(400).json({
        error: "Title, Description and imageUrl is required",
      })
    }

    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      user: {
        connect: { id: userId }
      },
    })

    res.status(201).json(product)

  } catch (error) {
    console.error("Error creating product: ", error);
    res.status(500).json({
      error: "Failed to create a product",
    })
  }
}



// update product (protected)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        error: "Product id is required"
      })
    }

    const { title, description, imageUrl } = req.body as Prisma.ProductUpdateInput;

    const existingProduct = await queries.getProductById(id)
    if (!existingProduct) {
      return res.status(404).json({
        error: "Product not found"
      })
    }

    if (existingProduct.userId !== userId) {
      return res.status(403).json({
        error: "You can only update your own products"
      })
    }

    const product = await queries.updateProduct(id, {
      title,
      description,
      imageUrl
    })

    res.status(200).json(product)
  } catch (error) {
    console.error("Error updating product: ", error)
    res.status(500).json({
      error: "Failed to update product"
    })
  }
}



// delete product (protected)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req)
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Product id is required" });

    const existingProduct = await queries.getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({
        error: "Product not found"
      })
    }

    if (existingProduct.userId !== userId) {
      return res.status(403).json({
        error: "You can only delete you own products"
      })
    }

    await queries.deleteProduct(id);
    res.status(200).json({
      message: "Product delete successfully"
    })
  } catch (error) {
    console.error("Error deleting product: ", error)
    res.status(500).json({
      error: "Failed to delete product"
    })
  }
}