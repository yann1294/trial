import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "../../../../api/axios"
import AdminRoute from "../../../../components/routes/AdminRoute"
import { Avatar, Button} from "antd";
import {toast} from 'react-toastify'
import { FireOutlined, InfoOutlined,FlagOutlined, EditOutlined } from "@ant-design/icons";


const StudentView = () => {

    const [student, setStudent] = useState({})

    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        loadStudent()
    }, [slug])

    const loadStudent = async () => {
        const { data } = await axios.get(`/student/${slug}`)
        setStudent(data)
    }

    const handleRemoveStudent = async () => {
        const {data} = await axios.delete(`/student/delete/${slug}`)
        setStudent(data)
        toast(`Great! You have successfully deleted ${slug}`)
        router.push(`/admin`)
    }

    console.log(student,'student details')

    return (
        <AdminRoute>
            <div className="container-fluid pt-3">
                {
                    student && (
                        <div className="container dummy">
                            <div className="row avatar">
                                <div className="avatar">
                                    <Avatar
                                        size={200}
                                        src={student.image ? student.image.Location : "/course.png"}
                                    />
                                </div>
                                <div className="col-md-12 detail">
                                    <h5>Name: {student.name}</h5>
                                </div> 
                            </div>
                            <div className='row'>
                                <div className="col-md-12 item">
                                        <Avatar
                                            className='icon'
                                            size={50}
                                            icon={<EditOutlined />}
                                        />
                                        <p>Created By: {student.student?.name}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-12 item">
                                        <Avatar
                                            className='icon'
                                            size={50}
                                            icon={<FireOutlined />}
                                        />
                                        <p>Age: {student.age}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-12 item">
                                        <Avatar
                                            className='icon'
                                            size={50}
                                            icon={<FlagOutlined />}
                                        />
                                        <p>Country: {student.country}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-12 item">
                                        <Avatar
                                            className='icon'
                                            size={50}
                                            icon={<InfoOutlined />}
                                        />
                                        <p>Email: {student.email}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-12 item">
                                        <Avatar
                                            className='icon'
                                            size={50}
                                            icon={<InfoOutlined />}
                                        />
                                        <p>Pwd: {student.password}</p>
                                </div>
                            </div>
                            <div className="buttons">
                                <Button className='btn' type='primary'
                                    onClick={
                                        () => router.push(`/admin/student/edit/${slug}`)
                                    }
                                >
                                    Update Student
                                </Button>
                                <Button className='btn' type='primary' danger onClick={handleRemoveStudent}>Delete Student</Button>
                            </div>
                        </div>
                    )
                }
            </div>
        </AdminRoute>
    )
}

export default StudentView