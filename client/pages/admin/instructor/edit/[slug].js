import { useState, useEffect } from "react";
import axios from "../../../../api/axios";
import Resizer from 'react-image-file-resizer'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import AdminRoute from "../../../../components/routes/AdminRoute";
import StudentCreateForm from "../../../../components/forms/StudentCreateForm";

const EditInstructor = () => {
         // state
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    image: {},
    uploading: false,
    loading: false,
  });

  const [image, setImage] = useState({});
  const [preview, setPreview] = useState('')
  const [uploadButtonText, setUploadButtonText] = useState('Upload image')

  const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        loadInstructor()
    }, [slug])

    const loadInstructor = async () => {
        const { data } = await axios.get(`/instructor/${slug}`)
        if (data) setValues(data)
        if(data && data.image) setImage(data.image)
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
      };
    
    const handleImage = (e) => {
        let file = e.target.files[0]
        setPreview(window.URL.createObjectURL(file))
        setUploadButtonText(file.name)
        setValues({ ...values, loading: true })

        // resize
        Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
            try {
                let { data } = await axios.post(`/instructor/upload-image`, {
                    image: uri,
                })
                console.log('IMAGE UPLOADED', data)
                // set image in the state
                setImage(data)
                setValues({ ...values, loading: false })
            } catch (error) {
                console.log(error)
                setValues({ ...values, loading: false })
                toast('Image upload failed. Try later.')
            }
        })
    };

    const handleImageRemove = async () => {
        try {
            // console.log(values);
            setValues({ ...values, loading: true })
            const res = await axios.post(`/instructor/remove-image`, { image })
            setImage({})
            setPreview('')
            setUploadButtonText('Upload Image')
            setValues({ ...values, loading: false })
        } catch (error) {
            console.log(error)
            setValues({ ...values, loading: false })
            toast('Remove Image upload failed. Try later.')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // console.log(values)
            const { data } = await axios.put(`/instructor/${slug}`, {
                ...values,
                image,
            });
            toast('Instructor Updated!')
            router.push('/admin')
        } catch (error) {
            toast(error.response.data)
        }
    };

    return (
        <AdminRoute>
            <h1 className="jumbotron text-center square">Update Instructor</h1>
            <div className="pt-3 pb-3">
                <StudentCreateForm
                    handleSubmit={handleSubmit}
                    handleImage={handleImage}
                    handleImageRemove={handleImageRemove}
                    handleChange={handleChange}
                    values={values}
                    setValues={setValues}
                    preview={preview}
                    uploadButtonText={uploadButtonText}
                    editPage={true}
                />
            </div>
        </AdminRoute>
    )
}

export default EditInstructor
