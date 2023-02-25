import { useState, useEffect, useContext } from "react";
import { Context } from "../context";
import DefaultNav from "./nav/DefaultNav";
import HomeNav from "./nav/HomeNav";


const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  return (
    <>
    {user === null ? <HomeNav/> : <DefaultNav/>}
    </>
  );
};

export default TopNav;
