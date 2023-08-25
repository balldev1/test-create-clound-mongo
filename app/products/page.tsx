'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image';
import ContainerProduct from '../components/ฺContainerProduct';
import { useRouter } from 'next/navigation';
import { StepBackwardOutlined } from '@ant-design/icons';



const Products = () => {
    const [getProduct, setGetProduct] = useState<typeof Products[]>([]);;
    const [searchValue, setSearchValue] = useState<string>('');
    const router = useRouter();

    const filteredProducts = getProduct.filter((product: any) =>
        product.name.toLowerCase().startsWith(searchValue.toLowerCase())
    );


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('api/getProduct');
                const inProductsData = response.data;
                setGetProduct(inProductsData);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }

        fetchData();// เรียกใช้ฟังก์ชัน fetchData เพื่อดึงข้อมูลเมื่อคอมโพเนนต์ถูกเรนเดอร์ครั้งแรก

    }, []);

    const handleRoute = () => {
        router.push('/')
    }


    console.log(getProduct)
    return (
        <div className='flex flex-col  sm:items-center sm:justify-center '>
            <div className='sm:py-20 sm:px-20 py-5 px-9 w-full h-full'>
                <div className='flex flex-col gap-10'>
                    <div className='flex justify-between'>
                        <h1 className='text-2xl font-semibold'>Product list</h1>
                        <div onClick={handleRoute}
                            className='flex flex-row items-center cursor-pointer'>
                            <p className='text-[2px]'>back page</p>
                            <StepBackwardOutlined className='text-xl ' />
                        </div>
                    </div>
                    <input
                        placeholder='  🔍︎ Name, Catalogue,Code'
                        className='p-2 border-[1px] w-full rounded-full placeholder-gray-300'
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />

                    <div className='sm:px-20 grid sm:grid-cols-5 grid-cols-2 gap-7 '>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product: any, i) => (
                                <div
                                    key={i}
                                    className='bg-white border-[1px] h-full w-full rounded-t-xl rounded-b-xl'
                                >
                                    <div className={`bg-rose-500 h-[150px] rounded-t-xl`} style={{
                                        backgroundImage: `url(${product.imageSrc})`,
                                        backgroundSize: 'cover', backgroundPosition: 'center'
                                    }}>
                                    </div>
                                    <div className='px-2 py-2 text-sm'>
                                        <h1 className='font-bold'>Product name: {product.name}</h1>
                                        <span className='text-[1px]'>Code: {product.code}</span>
                                    </div>
                                    <h1 className='text-right px-2 py-3 font-bold text-red-600'>{product.price}</h1>
                                </div>
                            ))
                        ) : (
                            <ContainerProduct /> // ถ้าไม่มีข้อมูลให้แสดงหน้านี้
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;
