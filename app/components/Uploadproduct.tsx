'use client'
import React, { useCallback, useState } from 'react'
import { UploadOutlined, StepForwardOutlined } from '@ant-design/icons';
import { Button, Form, Input, } from 'antd';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const Uploadproduct = () => {

    const [form] = Form.useForm();

    const router = useRouter();

    //state form
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [price, setPrice] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [imageView, setImageView] = useState('');
    const [imageUp, setImageUp] = useState("");



    const uploadImage = async () => {
        //ถ้าใส่ ข้อมูลไม่ครบ แสดง error
        if (!name || !code || !price || !imageUp) {
            toast.error('Please fill in all the fields');
            return;
        }

        const formData = new FormData();
        formData.append('file', imageUp);
        formData.append('upload_preset', 'n2sb3ooy');

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dqse3famh/image/upload', formData);
            const uploadedImageUrl = response.data.secure_url; // เก็บ URL ของรูปภาพที่อัปโหลด
            setImageSrc(uploadedImageUrl); // Store the uploaded image URL
            console.log("Uploaded Image URL:", uploadedImageUrl);
            toast.success('Upload Product Success')
            try {
                // เมื่อรูปภาพถูกอัปโหลดเสร็จแล้วเราจะส่ง URL ไปในการสร้างสินค้า
                await axios.post('/api/create', {
                    name, code, price, imageSrc: uploadedImageUrl
                });
                console.log("Product created successfully!");
            } catch (createError) {
                toast.error('createError');
                console.error('Error creating product:', createError);
            }
        } catch (uploadError) {
            toast.error('uploadError');
            console.error('Error uploading image:', uploadError);
        }
    };

    //reset
    const handleResetForm = async () => {
        try {
            const shouldReset = await window.confirm("คุณต้องการยกเลิกใช่หรือไม่?");
            if (!shouldReset) {
                return; // ไม่ดำเนินการรีเซ็ตถ้าผู้ใช้ไม่ยืนยัน
            }
            // reset form
            form.resetFields();
            setImageView(''); // รีเซตค่า imageView เป็นสตริงเปล่า
            toast.success('reset success')
        } catch (error) {
            console.log('error', error);
        }
    };
    console.log()


    const handleSubmit = async () => {
        try {
            await axios.post('/api/create', {
                name, code, price, imageSrc
            })
        } catch (error) {
            console.log('Something went wrong!')
        }
    };

    // อัปโหลดรูปภาพและแสดงตัวอย่างรูป
    const handleImageUpload = (e) => {
        const selectedImage = e.target.files[0];
        setImageUp(selectedImage);

        // สร้าง URL สำหรับแสดงตัวอย่างรูป
        const imageUrl = URL.createObjectURL(selectedImage);
        setImageView(imageUrl);
    };

    // ไปหน้า Product
    const handleRoute = () => {
        router.push('/products')
    }




    return (
        <div className='flex flex-col sm:items-center sm:justify-center'>
            <div className=' sm:px-20 py-5 px-5 '>
                <div className='flex justify-between'>
                    <h1 className='text-2xl font-semibold'>Upload Product </h1>
                    <div onClick={handleRoute}
                        className='flex flex-row items-center cursor-pointer'>
                        <p className='text-[2px]'>next page</p>
                        <StepForwardOutlined className='text-xl ' />
                    </div>
                </div>
                <Form form={form}
                    layout="vertical"
                    className='flex flex-col gap-3 sm:pt-5 sm:pl-20 pt-5  text-sm font-semibold'>
                    <h1>Upload image</h1>
                    <div className='flex flex-col '>
                        <div className='sm:w-[600px] sm:h-[300px] h-[230px] border-2  rounded-xl border-dashed'>
                            <div className='flex flex-col items-center justify-center h-full'>
                                {imageView && <img src={imageView} alt="Uploaded Preview" className="sm:h-[180px] h-[100px]" />}
                                <UploadOutlined className='text-xl' />
                                <Form.Item
                                    valuePropName="fileList"
                                >
                                    <div className='flex flex-row gap-1'>
                                        <h1 className='text-gray-400 text-md text-center'>Drag & Drop or </h1>
                                        <label
                                            htmlFor="image-upload" className='cursor-pointer underline text-blue-500'>
                                            Choose
                                        </label>
                                        <h1 className='text-gray-400 text-md text-center'>file to upload</h1>
                                    </div>
                                    <input onChange={handleImageUpload}
                                        id="image-upload" type="file" name="file"
                                        className="hidden"
                                        style={{ display: 'none' }}
                                    />

                                    <p className='text-gray-400 text-[2px] text-center'>JPG or PNG Maximum file size 50MB</p>
                                </Form.Item>
                            </div>
                        </div>
                        <div className='sm:py-5'>
                            <Form.Item
                                label="Product name"
                                name="product"
                            >
                                <Input onChange={(e) => setName(e.target.value)}
                                    type='text' value={name}
                                    className='p-2 rounded-full' placeholder='Product name' />
                            </Form.Item>
                            <Form.Item
                                label="Code"
                                name="code"
                            >
                                <Input onChange={(e) => setCode(e.target.value)}
                                    type='text' value={code}
                                    className='p-2 rounded-full' placeholder='   Code' />
                            </Form.Item>
                            <Form.Item
                                label="Price"
                                name="price"
                            >
                                <Input onChange={(e) => setPrice(e.target.value)}
                                    type='number' value={price}
                                    className='p-2 rounded-full' placeholder='   Price' />
                            </Form.Item>

                            <Form.Item label="">
                                <div className='flex justify-center gap-5 item-center text-center'>
                                    <Button onClick={handleResetForm}
                                        className=' text-orange-500 w-[130px] h-[40px] rounded-full' htmlType="submit">
                                        ยกเลิก
                                    </Button>
                                    <Button onClick={uploadImage}
                                        htmlType="submit"
                                        className=' bg-orange-600 text-white  w-[130px] h-[40px] rounded-full' >
                                        ยืนยัน
                                    </Button>
                                </div>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </div >
        </div >
    )
}

export default Uploadproduct

