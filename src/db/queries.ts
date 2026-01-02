import { Prisma } from "../../generated/prisma/client"
import { prisma } from "../lib/prisma"


// create user
export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({ data });
}


// get user by id
export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
}


// update user
export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error(`User with id ${id} not found`);
  }

  return prisma.user.update({
    where: { id },
    data
  });
}


// upsert user (create or update)
export const upsertUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.upsert({
    where: { id: data.id },
    create: data,
    update: data,
  });
}


// create product 
export const createProduct = async (data: Prisma.ProductCreateInput) => {
  return prisma.product.create({ data });
}


// get all products (latest first with user)
export const getAllProducts = async () => {
  return prisma.product.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};



// GET PRODUCT BY ID (with user + comments + comment users)
export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc"
        },
      }
    }
  })
};



// get products by userId
export const getProductsByUserId = async (userId: string) => {
  return prisma.product.findMany({
    where: { userId },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}



// update product
export const updateProduct = async (id: string, data: Prisma.ProductUpdateInput) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    return new Error(`Product with id ${id} not found`);
  }

  return prisma.product.update({
    where: { id },
    data,
  })
}



// delete product
export const deleteProduct = async (id: string) => {
  const existingProduct = await getProductById(id)
  if (!existingProduct) {
    return new Error(`Product with id ${id} not found`)
  }
  return prisma.product.delete({
    where: { id },
  })
}



// create comment 
export const createComment = async (data: Prisma.CommentCreateInput) => {
  return prisma.comment.create({
    data
  })
}



// get comment by id (with user)
export const getCommentById = async (id: string) => {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      user: true
    }
  })
}



// delete comment
export const deleteComment = async (id: string) => {
  const existingComment = await getCommentById(id);
  if (!existingComment) {
    return new Error(`Comment with id ${id} not found`);
  }

  return prisma.comment.delete({
    where: { id },
  })
}