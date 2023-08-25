import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '../../lib/prismadb';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).end();
        }

        const { name, code, imageSrc } = req.body;
        const pricenumber = parseInt(req.body.price, 10); // แปลงค่า price ให้เป็นตัวเลข

        const createProduct = await prismadb.product.create({
            data: {
                name, code, price: pricenumber, imageSrc
            }
        })
        return res.status(200).json(createProduct)

    } catch (error) {
        console.error('Internal Server Error:', error);
        return res.status(500).json({ error: 'Something went wrong (error 500)!' });
    }
}

// name , title , description , remark

