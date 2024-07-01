import prisma from "@/prisma";

interface AddToCartArgs {
    userId : number
    productId: number
    storeId: number
}
export const addToCartService = async(body: AddToCartArgs)=>{
    try {
        const { productId, userId, storeId } = body;

        const findUser = await prisma.user.findFirst({ where: { id: userId } });
        if (!findUser) {
          throw new Error('User not found');
        }
    
        const findProduct = await prisma.product.findFirst({ where: { id: productId } });
        if (!findProduct) {
          throw new Error('Product not found');
        }

        const newCart = await prisma.cart.create({data:{
            qty:1,
            isActive: true,
            productId,
            userId,
            storeId,

        }})

        return {message:"Product added to cart"}
    
    } catch (error) {
        throw error
    }
}