import {useState, useEffect, useContext} from 'react'
import axios from "../../api/axios";
import {useRouter} from 'next/router'
import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron'
import PreviewModal from '../../components/modal/PreviewModal'
import SingleCourseLessons from '../../components/cards/SingleCourseLessons'
import {Context} from '../../context'
import {toast} from 'react-toastify'

const SingleCourse = ({course}) => {

    // state

    const [showModal, setShowModal] = useState(false)
    const [preview, setPreview] = useState('')
    const [loading, setLoading] = useState(false)
    const [enrolled, setEnrolled] = useState({})

    // context
    const {
        state: {user}
    } = useContext(Context)

    useEffect(()=>{
        if(user && course) checkEnrollment()
    },[user, course])

    const checkEnrollment = async () => {
        const {data} = await axios.get(`/check-enrollment/${course._id}`, {
            withCredentials: true,
      })
        console.log('CHECK ENROLLMENT', data)
        setEnrolled(data)
    }

    const router = useRouter()
    const {slug} = router.query

    const handleFreeEnrollment = async (e) => {
        // console.log('handle free enrollment')
        e.preventDefault()
        try{
            // check if user is logged in
            if(!user) router.push('/login')
            // check if already enrolled
            if(enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`)
            setLoading(true)
            const {data} = await axios.post(`/free-enrollment/${course._id}`)
            toast(data.message)
            setLoading(false)
            router.push(`/user/course/${data.course.slug}`)
        }catch(err){
            toast('Enrollment failed. try again')
            console.log(err)
            setLoading(false)
        }
    }

    return (
        <>
                   {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
                <SingleCourseJumbotron
                    course={course}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    preview={preview}
                    setPreview={setPreview}
                    user={user}
                    loading={loading}
                    handleFreeEnrollment={handleFreeEnrollment}
                    enrolled={enrolled}
                    setEnrolled={setEnrolled}
                />
                  <PreviewModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    preview={preview}
                  />

                  {course.lessons && (
                      <SingleCourseLessons
                        lessons={course.lessons}
                        setPreview={setPreview}
                        showModal={showModal}
                        setShowModal={setShowModal}
                      />
                  )}
        </>
    )
}

export async function getServerSideProps({query}) {
    const {data} = await axios.get(`/course/${query.slug}`)
    return {
        props: {
            course: data
        },
    }
}

export default SingleCourse

