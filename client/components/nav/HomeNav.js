import { Menu} from "antd";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context";
import axios from "../../api/axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {
    AppstoreOutlined,
    CoffeeOutlined,
    LoginOutlined,
    LogoutOutlined,
    UserAddOutlined,
    DashboardOutlined,
    CarryOutOutlined,
    TeamOutlined,
  } from "@ant-design/icons";

const { Item, SubMenu, ItemGroup } = Menu;

const HomeNav = () =>{
    const [current, setCurrent] = useState("");

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);


    return (
        <>
        <Menu mode="horizontal" selectedKeys={[current]} className='mb-2' >

                {/* <Item
                key="/"
                onClick={(e) => setCurrent(e.key)}
                icon={<AppstoreOutlined />}
            >
                <Link href="/">
                <a>Home</a>
                </Link>
            </Item>

            <Item
                key="/#about"
                onClick={(e) => setCurrent(e.key)}
            >
                <Link href="/#about">
                <a>About Us</a>
                </Link>
            </Item>

            <Item
                key="/#testimonial"
                onClick={(e) => setCurrent(e.key)}
            >
                <Link href="/#testimonial">
                <a>Testimonials</a>
                </Link>
            </Item>

            <Item
            key="/#contact"
            onClick={(e) => setCurrent(e.key)}
            >
                <Link href="/#contact">
                <a>Contact Us</a>
                </Link>
            </Item> */}

               <Item
                key="/login"
                onClick={(e) => setCurrent(e.key)}
                icon={<LoginOutlined />}
                className='float-right'
                style={{marginLeft: 'auto'}}
            >
                <Link href="/login">
                <a>Login</a>
                </Link>
            </Item>
        </Menu>
        </>
    );
}

export default HomeNav;
