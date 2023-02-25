import Link from 'next/link';
import {useState, useEffect} from 'react';

const AdminNav = () => {

    const [current, setCurrent] = useState('')


    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
      }, [process.browser && window.location.pathname]);

    return (
        <div className="nav flex-column nav-pills">
            <Link href='/admin'>
                <a className={`nav-link ${current === '/admin' && 'active'}`}>Dashboard</a>
            </Link>
            <Link href='/admin/instructor/create-instructor'>
                <a className={`nav-link ${current === '/admin/instructor/create-instructor' && 'active'}`}>Create Instructor</a>
            </Link>    
            <Link href='/admin/student/create-student'>
                <a className={`nav-link ${current === '/admin/student/create-student' && 'active'}`}>Create Student</a>
            </Link>    
        </div>
    )
}

export default AdminNav