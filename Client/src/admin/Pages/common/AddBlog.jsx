import React, { useEffect, useState,useCallback, useMemo} from 'react';
import * as yup from 'yup';
import { toast } from "react-toastify";
import {useDropzone} from 'react-dropzone'
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteImages, blogImgUpload, clearImageState } from '../../../features/upload/blogUploadSlice';
import { getAllBlogCategory } from '../../../features/blogCategory/blogCategorySlice'
import { blogResetState, createNewBlog, getBlog, updateABlog } from '../../../features/blog/blogSlice';

let schema = yup.object().shape({
    title: yup.string().required("Title is Required"),
    description: yup.string().required("Description is Required"),
    category: yup.string().required("Category is Required"),
});

const AddBlog = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [imageStateLoading, setImageStateLoading] = useState(false);
    const [loadedImagesCount, setLoadedImagesCount] = useState(false);
    const blogCategoryState = useSelector((state) => state.blogCategory.blogCategories);
    const imageState = useSelector((state) => state.blogUploadImg.images)
    const newBlog = useSelector((state) => state.blog);
    const { isSuccess, isError, newBlogData, singleBlogData, updatedBlogData } = newBlog;
    const blogIdSegment = location?.pathname?.split('/')[3];
    const blogId = blogIdSegment === 'undefined' ? undefined : blogIdSegment;

    const img = useMemo(() => {
        if (!Array.isArray(imageState)) {
            return [];
        }
        return imageState?.map((i) => ({
            url: i.url,
            asset_id: i.asset_id,
            public_id: i.public_id,
        }));
    }, [imageState]);
    
    useEffect(() => {
        formik.values.images = img;
    }, [img]);

    useEffect(() => {
        dispatch(getAllBlogCategory());
        if (blogId !== undefined) {
            dispatch(getBlog(blogId));
        } else {
            dispatch(blogResetState());
        }
    }, [blogId]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: singleBlogData?.title || "",
            category: singleBlogData?.category || "",
            description: singleBlogData?.description || "",
            images: singleBlogData?.images || "",
        },
        validationSchema: schema,
        onSubmit: async(values) => {
            try {
                if (blogId !== undefined) {
                    const data = {id: blogId, updatedBlog: values}
                    await dispatch(updateABlog(data));
                    dispatch(blogResetState());
                    dispatch(clearImageState());
                    setTimeout(() => {
                        navigate('/admin/blog-list')
                }, 300);
                } else {
                    await dispatch(createNewBlog(values))
                    dispatch(blogResetState());
                    dispatch(clearImageState());
                    formik.resetForm();
                }
            } catch (error) {
                console.log(error)
            }
        },
    });

    useEffect(() => {
        if (isSuccess && newBlogData) {
            toast.success('New blog is successfully created.')
        }
        if (isSuccess && updatedBlogData) {
            toast.success('Blog has been updated successfully.')
        }
        if (isError) {
            toast.error('Something went wrong, Try again.')
        }
    }, [ isError, isSuccess, updatedBlogData])
    
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
        } catch (error) {
            console.log('Error while Uploading to Cloudinary', error);
        }
    }, []);

    const handleRemoveImage = (public_id, index) => {
        // Dispatch the delete function to remove the image from Cloudinary
        dispatch(deleteImages(public_id))
            .then(() => {
                // Update the UI by removing the image from formik values
                const updatedImages = [...formik.values.images];
                updatedImages.splice(index, 1);
                formik.setFieldValue("images", updatedImages);
            })
            .catch((error) => {
                console.error("Error deleting image from Cloudinary", error);
            });
    };
    
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
                            <h2 className="mb-4 header-name">
                                {blogId !== undefined ? "Update Blog" : "Add Blog"}
                            </h2>

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
                                    {blogCategoryState?.map((i, j) => {
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
                                {(Array.isArray(formik.values.images) && formik.values.images.length > 0) ? (
                                    formik.values.images.map((image, index) => (
                                        <div className="position-relative" key={index}>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(image.public_id, index)}
                                                className="btn-close position-absolute btn-hover"
                                                style={{ top: "5px", right: "5px" }}
                                            ></button>
                                            <img
                                                className='dropzone_image'
                                                src={image.url}
                                                alt=""
                                                width={200}
                                                height={200}
                                                onLoad={() => handleImageLoad(index)}
                                            />
                                        </div>
                                    ))
                                ) : imageStateLoading ? (
                                    <p className='pt-2 fs-6 display_color2'>Loading images...</p>
                                ) : (
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

                            <button type="submit" className="btn btn-success btn-block mt-4">
                                {blogId !== undefined ? "Update" : "Add Blog"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddBlog;


// {/* {(Array.isArray(imageState) && imageState?.length > 0) ? (
//                                     imageState?.map((i, j) => (
//                                         <div className=" position-relative" key={j}>
//                                             <button
//                                                 type="button"
//                                                 onClick={() => dispatch(deleteImages(i.public_id))}
//                                                 className="btn-close position-absolute btn-hover"
//                                                 style={{ top: "5px", right: "5px" }}
//                                             ></button>
//                                             <img
//                                                 className='dropzone_image'
//                                                 src={i.url}
//                                                 alt=""
//                                                 width={200}
//                                                 height={200}
//                                                 onLoad={() => handleImageLoad(j)}
//                                             />
//                                         </div>
//                                     ))
//                                 ) : imageStateLoading ? (
//                                     <p className='pt-2 fs-6 display_color2'>Loading images...</p>
//                                 ) : (
//                                     <p className='pt-2 fs-6 display_color1'>Upload image to display</p>
//                                 )} */}

//                                 {/* // onClick={() => {
//                                                 //     // Remove the image from the form values
//                                                 //     const updatedImages = formik.values.images.filter((_, i) => i !== index);
//                                                 //     formik.setFieldValue("images", updatedImages);
//                                                 // }} */}







