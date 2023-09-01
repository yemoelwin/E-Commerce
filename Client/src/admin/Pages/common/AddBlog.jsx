import React, { useState } from 'react';
import CustomInput from '../../../components/common/CustomInput';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import { Stepper } from 'react-form-stepper';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const AddBlog = () => {
    const [description, SetDescription] = useState();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleDescription = (value) => {
        SetDescription(value);
        console.log(value);
    };

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div>
            <h3 className="mb-2 title">Add Blog</h3>
            {/* <Stepper
                steps={[
                    { label: 'Add Blog Details' },
                    { label: 'Upload Images' },
                    { label: 'Finished' },
                ]}
                activeStep={1}
            /> */}
            <div>
                <form>
                    <CustomInput type='text' label='Enter Blog Title' />
                    <select className='form-control py-3 mb-2 mt-2' name="" id="">
                        <option value="">Select Blog Category</option>
                    </select>
                    
                    <div className='mt-2 border mb-4 bg-white'>
                        <Upload
                            className='py-4 ps-3'
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            // action="http://your-backend-domain.com/upload"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                        
                    </div>
                    <ReactQuill theme="snow" value={description} onChange={handleDescription} />
                    <button className='btn btn-success border-0 rounded my-4'>Add Blog</button>
                </form>
            </div>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default AddBlog;









// import React, { useState } from 'react'
// import CustomInput from '../../components/CustomInput';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { Stepper } from 'react-form-stepper';

// const AddBlog = () => {
//     const [description, SetDescription] = useState();
//     const handleDescription = (value) => {
//         SetDescription(value)
//         console.log(value);
//     }
//     return (
//         <>
//             <div>
//                 <h3 className="mb-4">Add Blog</h3>
//                 <Stepper
//                     steps={[{ label: 'Add Blog Details' }, { label: 'Upload Images' }, { label: 'Finished' }]}
//                     activeStep={1}
//                 />
//                 <div>
//                     <form action="">
//                         <CustomInput type='text' label='Enter Blog Title' />
//                         <select className='form-control py-3 mb-3' name="" id="">
//                             <option value="">Select Blog Category</option>
//                         </select>
//                         <ReactQuill theme="snow" value={description} onChange={handleDescription} />
//                         <button className='btn btn-success border-0 rounded my-4'>Add Blog</button>
//                     </form>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default AddBlog



