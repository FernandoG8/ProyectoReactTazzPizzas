import React, { useState } from "react";
import "../../assets/css/AuthForm.css";
import { useNavigate } from "react-router-dom";
const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const toggleForm = () => setIsLogin(!isLogin);
const navigate = useNavigate();

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "450px", width: "100%" }}>
                <h2 className="text-center mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
                    {isLogin ? "Iniciar Sesión 🔐" : "Registrarse 📝"}
                </h2>

                <div className="d-flex justify-content-center mb-4">
                    <button
                        className={`btn me-2 ${isLogin ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        className={`btn ${!isLogin ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => {
                            setIsLogin(false);
                            navigate("/home");
                        }}
                    >
                        Registrarse
                    </button>
                </div>

                <form>
                    {!isLogin && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" className="form-control" placeholder="Tu nombre completo" />
                            </div>
                        </>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Teléfono</label>
                        <input type="tel" className="form-control" placeholder="Ingresa tu número" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="form-control" placeholder="••••••••" />
                    </div>

                    <button type="submit" className={`btn w-100 ${isLogin ? "btn-primary" : "btn-success"}`}>
                        {isLogin ? "Entrar" : "Crear Cuenta"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
