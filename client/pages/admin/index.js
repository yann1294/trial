import { useState, useEffect } from "react";
import axios from "../../api/axios";
import AdminRoute from "../../components/routes/AdminRoute";
import { Avatar,Tooltip } from "antd";
import Link from "next/link";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const AdminIndex = () =>{

    const [instructors, setInstructors] = useState([])
    const [students, setStudents] = useState([])

    useEffect(() => {
        loadInstructors();
      }, []);
    

    useEffect(() =>{
        loadStudents();
    },[])
    
    const loadInstructors = async () => {
        const { data } = await axios.get(`/find-instructor`);
        setInstructors(data);
    }

    const loadStudents = async () => {
        const { data } = await axios.get(`/find-student`);
        setStudents(data);
    }

    const myStyle = { marginTop: "-15px", fontSize: "10px" };

    return (
        <AdminRoute>
            <h1 className="jumbotron text-center square ">Admin Dashboard</h1>
            <h2 className="text-center square ">Instructors</h2>
            {/* <pre>{JSON.stringify(instructors, null, 4)}</pre> */}
            {
                instructors && instructors.map((instructor) =>(
                    <>
                        <div className="media pt-2">
                            <Avatar
                                size={80}
                                src={instructor.image ? instructor.image.Location : "/instructor.svg"}
                                />
                            <div className="media-body pl-2">
                                <div className="row">
                                    <div className="col">
                                        <Link
                                            href={`/admin/instructor/view/${instructor.slug}`}
                                            className='pointer'
                                        >
                                            <a className="mt-2 text-primary">
                                                <h5 className="pt-2">{instructor.name}</h5>
                                            </a>
                                        </Link>
                                    </div>
                                    <div col-md-3 mt-3 text-center>
                                        <Tooltip title='Published'>
                                            <CheckCircleOutlined className="h5 pointer text-success" />
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ))
            }
            <h2 className="text-center square ">Students</h2>
            {
                students && students.map((student) =>(
                    <>
                        <div className="media pt-2">
                            <Avatar
                                size={80}
                                src={student.image ? student.image.Location : "/student.svg"}
                                />
                            <div className="media-body pl-2">
                                <div className="row">
                                    <div className="col">
                                        <Link
                                            href={`/admin/student/view/${student.slug}`}
                                            className='pointer'
                                        >
                                        <a className="mt-2 text-primary">
                                            <h5 className="pt-2">{student.name}</h5>
                                        </a>
                                        </Link>
                                    </div>
                                    <div col-md-3 mt-3 text-center>
                                        <Tooltip title='Published'>
                                            <CheckCircleOutlined className="h5 pointer text-success" />
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ))
            }
        </AdminRoute>
    )
}

export default AdminIndex