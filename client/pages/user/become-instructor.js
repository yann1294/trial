import axios from "../../api/axios";
import { useContext, useState } from 'react';
import { Context } from '../../context';
import { Button } from 'antd';
import { SettingOutlined, UserSwitchOutlined, LoadingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import UserRoute from '../../components/routes/UserRoute';


const BecomeInstructor = () => {

    // state
    const [loading, setLoading] = useState(false)
    const {state:{user}} = useContext(Context)

    const becomeInstructor = () => {
        // console.log('become instructor')
        setLoading(true)
        axios.post(`/make-instructor`)
        .then(res => {
            console.log(res)
            window.location.href = res.data;
        })
        .catch(err => {
            console.log(err.response.status)
            toast('Instructor registration failed. Try again.')
            setLoading(false)
        })
    }


    return (
        <>
            <h1 className='jumbotron text-center square'>Become Instructor</h1>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 offset-md-3 text-center'>
                        <div className='pt-4'>
                            <UserSwitchOutlined className='display-1 pb-3'/>
                            <br/>
                            <h2>Become an Instructor and Publish Courses</h2>
                            <Button className='mb-3' type='primary' block shape='round' icon={loading ? <LoadingOutlined/> : <SettingOutlined/>} size='large'
                            onClick={becomeInstructor}
                            disabled={(user && user.role && user.role.includes('Instructor')) ||
                                        loading
                                    }
                            >
                                {loading ? 'Processing' : 'Instructor Setup'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BecomeInstructor;