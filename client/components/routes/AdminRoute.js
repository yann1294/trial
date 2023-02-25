import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import AdminNav from "../nav/AdminNav"

const AdminRoute = ({children}) => {

    // state
  const [ok, setOk] = useState(false);
  // router
  const router = useRouter();

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const { data } = await axios.get(`/current-admin`);
      console.log("ADMIN ROUTE => ", data);
      if (data.ok) setOk(true);
    } catch (err) {
      console.log(err);
      setOk(false);
      router.push("/admin");
    }
  };

    return (
        <>
      {!ok ? (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-primary p-5"
        />
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <AdminNav />
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
       )} 
    </>
    )
}

export default AdminRoute