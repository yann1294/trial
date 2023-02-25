import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "../../../../api/axios"
import AdminRoute from "../../../../components/routes/AdminRoute"
import { Avatar, Button} from "antd";
import {toast} from 'react-toastify'
import { FireOutlined, InfoOutlined,FlagOutlined, EditOutlined } from "@ant-design/icons";

const InstructorView = () => {
    
    const [instructor, setInstructor] = useState({})

    const router = useRouter()
    const {slug} = router.query;

    useEffect(() => {
        loadInstructor()
    }, [slug])

    const loadInstructor = async () => {
        const { data } = await axios.get(`/instructor/${slug}`)
        setInstructor(data)
    }

    const handleDeleteInstructor = async () => {
        const {data} = await axios.delete(`/instructor/delete/${slug}`)
        setInstructor(data)
        toast(`Great! You have successfully deleted ${slug}`)
        router.push(`/admin`)
    }

    console.log(instructor,'instructor details')

    return (
        <AdminRoute>
            <div className="container-fluid pt-3">
                {
                    instructor && (
                        <div className="container dummy">
                            <div className="row avatar">
                                <div className="avatar">
                                    <Avatar
                                        size={200}
                                        src={instructor.image ? instructor.image.Location : "/course.png"}
                                    />
                                </div>
                                <div className="col-md-12 detail">
                                    <h5>Name: {instructor.name}</h5>
                                </div> 
                            </div>
                            <div className='row'>
                                <div className="col-md-12 item">
                                        <Avatar
                                            className='icon'
                                            size={50}
                                            icon={<EditOutlined />}
                                        />
                                        <p>Created By: {instructor.instructor?.name}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-12 item">
                                        <Avatar
                                            className='icon'
                                            size={50}
                                            icon={<FireOutlined />}
                                        />
                                        <p>Age: {instructor.age}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-12 item">
                                        <Avatar
                                            className='icon'
                                            size={50}
                                            icon={<FlagOutlined />}
                                        />
                                        <p>Country: {instructor.country}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-12 item">
                                        <Avatar
                                            className='icon'
                                            size={50}
                                            icon={<InfoOutlined />}
                                        />
                                        <p>Email: {instructor.email}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-12 item">
                                        <Avatar
                                            className='icon'
                                            size={50}
                                            icon={<InfoOutlined />}
                                        />
                                        <p>Pwd: {instructor.password}</p>
                                </div>
                            </div>
                            <div className="buttons">
                                <Button className='btn' type='primary'
                                    onClick={
                                        () => router.push(`/admin/instructor/edit/${slug}`)
                                    }
                                >
                                    Update Instructor
                                </Button>
                                <Button className='btn' type='primary' danger onClick={handleDeleteInstructor}>Delete Instructor</Button>
                            </div>
                        </div>
                    )
                }
            </div>
        </AdminRoute>
    )
}

export default InstructorView