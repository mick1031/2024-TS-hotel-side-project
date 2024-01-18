import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Maybe } from "@/types/helpers";
import Input from "@components/atoms/Input";
import Button from "@components/atoms/Button";
import { useState } from "react";

type LoginFormValues = {
  email: string;
  password: string;
};

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const [resErrorMsg, setResErrorMsg] = useState<Maybe<string>>(null);

  const onSubmit = async (data: LoginFormValues) => {
    const response = await fetch("/api/v1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const jsonData = await response.json();
    // if error happen
    if (!jsonData.status) {
      setResErrorMsg(jsonData.message);
    }
    // success
    localStorage.setItem("token", jsonData.token);
    navigate("/user");
  };

  return (
    <div className="login-bg">
      <div className="container">
        <div className="d-flex  align-items-center">
          <div className="col-12 col-md-4 offset-md-7">
            <div className="mb-4">
              <p className="h6 text-primary">享樂酒店，誠摯歡迎</p>
              <h1>立即開始旅程</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
              <Input
                name="email"
                displayName="電子信箱"
                placeholder="請輸入信箱"
                errors={errors}
                register={register}
                rules={{
                  required: "必填欄位",
                  pattern: { value: /^\S+@\S+$/i, message: "格式不對" },
                }}
                type="text"
              />
              <Input
                name="password"
                placeholder="請輸入密碼"
                displayName="密碼"
                errors={errors}
                register={register}
                rules={{ required: "必填欄位" }}
                type="password"
              />

              <div className="d-flex justify-content-between">
                <div className="form-check ">
                  <label className="form-check-label" htmlFor="RememberMe">
                    記住帳號
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="RememberMe"
                    value="true"
                  />
                </div>
                <p className="text-primary  text-end">忘記密碼</p>
              </div>
              {resErrorMsg && <p className="text-danger">{resErrorMsg}</p>}
              <Button displayName="會員登入" type="submit" />
            </form>
            <div className="col">
              <p>
                沒有會員嗎？{" "}
                <Link className="nav-link text-primary d-inline" to="/signup">
                  前往註冊
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
