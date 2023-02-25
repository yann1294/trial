import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  CarryOutOutlined,
  TeamOutlined,
  EditOutlined
} from "@ant-design/icons";
import { Context } from "../../context";
import axios from "../../api/axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";


const { Item, SubMenu, ItemGroup } = Menu;



const DefaultNav = () =>{
    const [current, setCurrent] = useState("");

    const { state, dispatch } = useContext(Context);
    const { user } = state;

    const router = useRouter();

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    const logout = async () => {
        dispatch({ type: "LOGOUT" });
        window.localStorage.removeItem("user");
        const { data } = await axios.get(`/logout`);
        toast(data.message);
        router.push("/login");
    };

    return (
        <>
        <Menu mode="horizontal" selectedKeys={[current]} className='mb-2'>
        {/* <Item
            key="/"
            onClick={(e) => setCurrent(e.key)}
            icon={<AppstoreOutlined />}
        >
            <Link href="/">
            <a>Home</a>
            </Link>
        </Item> */}

        {user === null && (
            <>
            <Item
                key="/login"
                onClick={(e) => setCurrent(e.key)}
                icon={<LoginOutlined />}
            >
                <Link href="/login">
                <a>Login</a>
                </Link>
            </Item>

            {/* <Item
                key="/register"
                onClick={(e) => setCurrent(e.key)}
                icon={<UserAddOutlined />}
            >
                <Link href="/register">
                <a>Register</a>
                </Link>
            </Item> */}
            </>
        )}

{user && user.role && user.role.includes('Instructor') && (
        <Item
        key="/instructor/course/create"
        onClick={(e) => setCurrent(e.key)}
        icon={<CarryOutOutlined />}
      >
        <Link href="/instructor/course/create">
          <a>Create Course</a>
        </Link>
      </Item>
)}
{user && user.role && user.role.includes('Admin') && (
        <Item
        key="/admin/instructor/create-instructor"
        onClick={(e) => setCurrent(e.key)}
        icon={<EditOutlined />}
      >
        <Link href="/admin/instructor/create-instructor">
          <a>Create Insructor</a>
        </Link>
      </Item>
)}
{user && user.role && user.role.includes('Admin') && (
        <Item
        key="/admin/student/create-student"
        onClick={(e) => setCurrent(e.key)}
        icon={<EditOutlined />}
      >
        <Link href="/admin/student/create-student">
          <a>Create Student</a>
        </Link>
      </Item>
)}


{user !== null && (
        <SubMenu
          icon={<CoffeeOutlined />}
          title={user && user.name}
          className="float-right"
          style={{marginLeft: 'auto'}}
        >
          <ItemGroup>
            {/* <Item key="/user" icon={<DashboardOutlined/>}>
              <Link href="/user">
                <a>Dashboard</a>
              </Link>
            </Item> */}
            <Item onClick={logout} icon={<LogoutOutlined/>}>Logout</Item>
          </ItemGroup>
        </SubMenu>
      )}
      {
          user && user.role && user.role.includes('Instructor') &&(
            <Item
            key="/instructor"
            onClick={(e) => setCurrent(e.key)}
            icon={<TeamOutlined />}
            className='float-right'
          >
            <Link href="/instructor">
              <a>Instructor</a>
            </Link>
          </Item>
          )
        }
         {
          user && user.role && user.role.includes('Admin') &&(
            <Item
            key="/admin"
            onClick={(e) => setCurrent(e.key)}
            icon={<TeamOutlined />}
            className='float-right'
          >
            <Link href="/admin">
              <a>Admin</a>
            </Link>
          </Item>
          )
        }
         {
          user && user.role && user.role.includes('Subscriber') &&(
            <Item
            key="/user"
            onClick={(e) => setCurrent(e.key)}
            icon={<TeamOutlined />}
            className='float-right'
          >
            <Link href="/user">
              <a>Student</a>
            </Link>
          </Item>
          )
        }
        </Menu>
        </>
    );
}

export default DefaultNav;
