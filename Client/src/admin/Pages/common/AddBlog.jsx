import React, { useEffect, useState,useCallback, useMemo} from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import {useDropzone} from 'react-dropzone'
import { getBlogCategory } from '../../../features/blogCategory/blogCategorySlice'
import { useDispatch, useSelector } from 'react-redux';
import { deleteImages, blogImgUpload, clearImageState } from '../../../features/upload/blogUploadSlice';
// import { useNavigate } from 'react-router-dom';
import { createNewBlog, resetState } from '../../../features/blog/blogSlice';
import { toast } from "react-toastify";

let schema = yup.object().shape({
    title: yup.string().required("Title is Required"),
    description: yup.string().required("Description is Required"),
    category: yup.string().required("Category is Required"),
});

const AddBlog = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const [imageStateLoading, setImageStateLoading] = useState(false);
    const [loadedImagesCount, setLoadedImagesCount] = useState(false);
    const blogCategoryState = useSelector((state) => state.blogCategory.blogCategories);
    const imageState = useSelector((state) => state.blogUploadImg.images)
    const newBlog = useSelector((state) => state.blog);
    const { isSuccess, isError, createdBlog } = newBlog;

    const formik = useFormik({
        initialValues: {
            title: "",
            category: "",
            description: "",
            images: "",
        },
    validationSchema: schema,
        onSubmit: (values) => {
            try {
                alert(JSON.stringify(values));
                dispatch(createNewBlog(values))
                formik.resetForm();
                setTimeout(() => {
                    dispatch(resetState());
                    dispatch(clearImageState());
                    // navigate('/admin/blog-list')
                }, 3000);
            } catch (error) {
                console.log(error)
            }
            
        },
    });

    useEffect(() => {
        if (isSuccess && createdBlog) {
            toast.success('New blog is successfully created.')
        }
        if (isError) {
            toast.error('Something went wrong, Try again.')
        }
    },[createdBlog, isError, isSuccess])

    useEffect(() => {
        dispatch(getBlogCategory());
    }, [dispatch]);
    
    const onDrop = useCallback(acceptedFiles => {
        const formData = new FormData();
        for (let i = 0; i < acceptedFiles.length; i++) {
            formData.append('images', acceptedFiles[i]);
        }
        try {
            setImageStateLoading(true);
            dispatch(blogImgUpload(formData)).finally(() => {
                setImageStateLoading(false);
            });
            // setFileList(Array.from(acceptedFiles));
        } catch (error) {
            console.log('Error while Uploading to Cloudinary', error);
        }
    }, [dispatch]);

    const img = useMemo(() => {
        if (!Array.isArray(imageState)) {
            return [];
        }
        return imageState.map((i) => ({
            url: i.url,
            asset_id: i.asset_id,
            public_id: i.public_id,
        }))
    }, [imageState])

    useEffect(() => {
        formik.values.images = img;
    },[img,formik.values])
    
    const { getRootProps, getInputProps } = useDropzone({ onDrop });


    const handleImageLoad = (index) => {
        setLoadedImagesCount((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        if (loadedImagesCount === imageState.length) {
            setImageStateLoading(false);
        }
    }, [loadedImagesCount, imageState]);

    return (
        <>
        <div className="container ">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <form onSubmit={formik.handleSubmit}>
                            <h2 className="mb-4 header-name">Add Blog</h2>

                            {/* Blog Title */}
                            <div className="form-group mt-2">
                                <label htmlFor="blogTitle" className='label-name'>Blog Title</label>
                                <input
                                    type="text"
                                    className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                    id="blogTitle"
                                    name='title'
                                    placeholder= 'Enter Blog Title'
                                    onChange={formik.handleChange("title")}
                                    onBlur={formik.handleBlur("title")}
                                    value={formik.values.title}
                                    required />
                                {formik.touched.title && formik.errors.title && (
                                    <div className="invalid-feedback">
                                        {formik.errors.title}
                                    </div>
                                )}
                            </div>

                            {/* Blog Category */}
                            <div className="form-group mt-2">
                                <label htmlFor="categorySelect" className='label-name'>Category</label>
                                <select
                                    className={`form-control ${formik.touched.category && formik.errors.category ? 'is-invalid' : ''}`}
                                    id="categorySelect"
                                    name="category"
                                    onChange={formik.handleChange("category")}
                                    onBlur={formik.handleBlur("category")}
                                    value={formik.values.category}
                                    required
                                >
                                    <option value="">Choose Category ...</option>
                                    {blogCategoryState.map((i, j) => {
                                        return (
                                            <option key={j} value={i.title}>{i.title}</option>
                                        )
                                    })}
                                </select>
                                {formik.touched.category && formik.errors.category && (
                                    <div className="invalid-feedback">
                                        {formik.errors.category}
                                    </div>
                                )}
                            </div>

                            {/* ImageUpload */}
                            <div className='mt-2 '>
                                <label htmlFor="imageUpload" className='label-name'>Image</label>
                                <div className='bg-white product-border text-center'>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <div className='fs-6 p-5 dropzone_image'>
                                            Drag 'n' drop some files here, or click to select files and upload
                                        </div>
                                            
                                    </div>
                                </div>
                            </div>
                                
                            <div className="showimages d-flex flex-wrap gap-3 product-border bg-white p-3">
                                {Array.isArray(imageState) && imageState?.length > 0 ? (
                                    imageState?.map((i, j) => (
                                        <div className=" position-relative" key={j}>
                                            <button
                                                type="button"
                                                onClick={() => dispatch(deleteImages(i.public_id))}
                                                className="btn-close position-absolute btn-hover"
                                                style={{ top: "5px", right: "5px" }}
                                            ></button>
                                            <img className='dropzone_image' src={i.url} alt="" width={200} height={200} onLoad={() => handleImageLoad(j)}/>
                                        </div>
                                    ))
                                ) : imageStateLoading ? (
                                    // Show loading message if images are still loading
                                    <p className='pt-2 fs-6 display_color2'>Loading images...</p>
                                ) : (
                                    // Show "No images to display" message if no images
                                    <p className='pt-2 fs-6 display_color1'>Upload image to display</p>
                                )}
                            </div> 

                            {/* Blog Description */}
                            <div className='mt-2'>
                                <label htmlFor="productDescription" className='label-name'>Description</label>
                                <textarea
                                    className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                                    name="description"
                                    id="description"
                                    onChange={formik.handleChange("description")}
                                    onBlur={formik.handleBlur("description")}
                                    value={formik.values.description}
                                    rows={4} // Adjust the number of rows as needed
                                />
                            </div>
                            <div className='error'>
                                {formik.touched.description && formik.errors.description}
                            </div>

                            <button type="submit" className="btn btn-success btn-block mt-4">Add Product</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddBlog;










