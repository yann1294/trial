import {Badge, Modal, Button} from 'antd'
import ReactPlayer from 'react-player'
import {LoadingOutlined, SafetyOutlined} from '@ant-design/icons'

const SingleCourseJumbotron = ({
    course,
    showModal,
    setShowModal,
    preview,
    setPreview,
    loading,
    user,
    handleFreeEnrollment,
    enrolled,
    setEnrolled,
}) =>{
    // destructuring
    const {name, description, instructor, updatedAt, lessons, image, category, free} = course
    return (
        <div className='jumbotron bg-primary square'>
                            <div className='row'>
                                <div className='col-md-8'>
                                    {/* {title} */}
                                    <h1 className='text-light font-weight-bold'>
                                        {name}
                                    </h1>
                                    {/* {description} */}
                                    <p className='lead'>
                                        {description && description.substring(0,160)}...
                                    </p>
                                    {/* {category} */}
                                    <Badge 
                                    count={category}
                                    className='pb-4 mr-2'
                                    />
                                    {/* {author} */}
                                    <p>Created by {instructor?.name}</p>
                                    {/* {updated at} */}
                                    <p>Last updated {new Date (updatedAt).toLocaleDateString()}</p>
                                </div>
                                <div className='col-md-4'>
                                    {/* {show video preview or course image} */}

                                    {
                                        lessons[0].video && lessons[0].video.Location ?
                                        (
                                        <div onClick={ 
                                            () => {
                                                setPreview(lessons[0].video.Location)
                                                setShowModal(!showModal)
                                            }
                                        }>
                                            <ReactPlayer 
                                            className='react-player-div'
                                            url={lessons[0].video?.Location}
                                            light={image?.Location}
                                            width='100%'
                                            height='225px'
                                            />
                                        </div>
                                        ) :
                                        (
                                            <>
                                                <img 
                                                src={image.Location}
                                                alt={name}
                                                className='img img-fluid'
                                                />
                                            </>
                                        )}
                                    
                                    {/* {enroll button} */}
                                    {
                                        loading ? (
                                            <div className='d-flex justify-content-center'>
                                                <LoadingOutlined className='h1 text-danger'/>
                                            </div>
                                        ) : (
                                            <Button
                                                className='mb-3 mt-3'
                                                type='danger'
                                                block
                                                shape='round'
                                                icon={<SafetyOutlined/>}
                                                size='large'
                                                disabled={loading}
                                                onClick={handleFreeEnrollment}
                                            >
                                                {
                                                    user 
                                                    // ? enrolled.status 
                                                    ?'Go to course'
                                                    //  :'Enroll'
                                                     :'Login to enroll'
                                                }
                                            </Button>
                                        )}
                                </div>
                        </div>
                   </div>
    )
}

export default SingleCourseJumbotron