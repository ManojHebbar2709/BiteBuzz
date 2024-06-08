import { useState, useEffect } from "react";
import Header from "../Components/homepage/Header";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { json, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../store/Studentuser";
import { userActions as canteenActions } from "../store/CanteenUser";

function Login() {
  const dispatch = useDispatch();
  const [student, setStudent] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigator = useNavigate();

  function handleClick() {
    navigator("..");
  }
  useEffect(() => {
    if (error)
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    setError(() => null);
    setLoading(() => false);
  }, [error]);

  async function LoginAction(e) {
    e.preventDefault();
    setLoading(() => true);
    if (student) {
      const result = {
        USN: username,
        password: password,
      };

      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });
      if (response.status == 400) {
        const data = await response.json();
        setError({ message: data.message });
        setLoading(() => false);
        return;
      }

      if (!response.ok) {
        setLoading(() => false);
        throw new json(
          { message: "Server error" },
          { status: 500, statusText: "An error occurred" && response.message }
        );
      }

      const userData = await response.json();
      console.log(userData);
      dispatch(userActions.setUser(userData.body));
      console.log(userData.body._id);
      localStorage.setItem("user", userData.body._id);
      setLoading(() => false);
      return navigator("/");
    }

    const result = {
      phoneNo: username,
      password: password,
    };

    const response = await fetch("http://localhost:5000/api/canteen/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    });
    if (response.status == 400) {
      const data = await response.json();
      setError({ message: data.message });
      setLoading(() => false);
      return;
    }

    if (!response.ok) {
      setLoading(() => false);
      throw new json(
        { message: "Server error" },
        { status: 500, statusText: "An error occurred" && response.message }
      );
    }

    const userData = await response.json();
    console.log(userData);
    dispatch(canteenActions.setUser(userData.user));
    console.log(userData.user._id);
    localStorage.setItem("user", userData.user._id);
    setLoading(() => false);
    return navigator("/canteen");
  }

  return (
    <>
      <Header />
      <ToastContainer limit={5} />
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          className="flex flex-col items-center border-2 border-gray-800 rounded-md bg-white p-8 shadow-lg relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <motion.button
            className="absolute right-0 top-0 p-2  border-l-2 border-b-2 border-stone-900 rounded-sm"
            whileHover={{ backgroundColor: "lightgreen" }}
            transition={{ type: "spring", duration: 1 }}
            onClick={handleClick}
          >
            X
          </motion.button>
          <div className="flex mb-4">
            <button
              className={`px-8 py-2 mr-2 rounded-l-md ${
                student
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-800 border-gray-800"
              }`}
              onClick={() => setStudent(true)}
              disabled={student}
            >
              Student
            </button>
            <button
              onClick={() => setStudent(false)}
              disabled={!student}
              className={`px-8 py-2 ml-2 rounded-r-md ${
                !student
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-800 border-gray-800"
              }`}
            >
              Canteen
            </button>
          </div>
          <form className="flex flex-col" method="post" onSubmit={LoginAction}>
            <input
              name="USN"
              type="text"
              placeholder="USN"
              className="mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username"
              required
              minLength={10}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              required
              // minLength={10}
            />
            <input
              type="text"
              name="userType"
              defaultValue={student ? "student" : "canteen"}
              className=" hidden"
            />
            <button
              type="submit"
              className="bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
              disabled={loading}
            >
              {`${loading ? "Validating..." : "Login"}`}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default Login;
