import SidebarMenu from "../../../components/sidebarMenu";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";

const token = Cookies.get("token");

export default function UsersEdit() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validation, setVAlidation] = useState([]);

  const fetchDetailUser = async () => {
    await api.get(`/api/admin/users/${id}`).then((response) => {
      setName(response.data.data.name);
      setEmail(response.data.data.email);
    });
  };

  useEffect(() => {
    fetchDetailUser();
  }, []);

  const updateUser = async (e) => {
    e.preventDefault();

    api.defaults.headers.common["Authorization"] = token;
    await api
      .put(`/api/admin/users/${id}`, {
        name: name,
        email: email,
        password: password,
      })
      .then(() => {
        navigate("/admin/users");
      })
      .catch((error) => {
        setVAlidation(error.response.data);
      });
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-3">
          <SidebarMenu />
        </div>
        <div className="col-md-9">
          <div className="card border-0 rounded shadow-sm">
            <div className="card-header">UPDATE USER</div>
            <div className="card-body">
              {validation.errors && (
                <div className="alert alert-danger mt-2 pb-0">
                  {validation.errors.map((error, index) => (
                    <p key={index}>
                      {error.path} : {error.msg}
                    </p>
                  ))}
                </div>
              )}
              <form onSubmit={updateUser}>
                <div className="form-group mb-3">
                  <label className="mb-1 fw-bold">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    placeholder="Full Name"
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="mb-1 fw-bold">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Email Address"
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="mb-1 fw-bold">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Password"
                  />
                </div>

                <button type="submit" className="btn btn-sm btn-primary">
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
