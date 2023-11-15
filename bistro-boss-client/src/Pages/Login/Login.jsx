// import React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { AuthContext } from '../../Provider/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const Login = () => {
    const captchRef = useRef(null);
    const [disabled, setDisabled] = useState(true);
    const {signInUser} = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || "/";
    

    useEffect(() => {
        loadCaptchaEnginge(6); 
    }, []);

    const handleLogin = e => {
        e.preventDefault();

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        // console.log(email, password);

        signInUser(email, password)
            .then(result => {
                const user = result.user;
                console.log("Right After Sign In: ", user);
                Swal.fire({
                    title: "Login SUccessful",
                    showClass: {
                      popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster
                      `
                    },
                    hideClass: {
                      popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster
                      `
                    }
                  });

                //   navigate(location?.state ? location?.state : "/");
                  navigate(from, {replace: true});
                  
            })
            .catch(err => console.log("Error while signing in: ", err))
    }

    const handleValidateCaptcha = () => {
        const user_captcha_value = captchRef.current.value;
        // console.log("Captch value: ", user_captcha_value);

        if(validateCaptcha(user_captcha_value) == true){
            setDisabled(false);
        }
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleLogin}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name="email" placeholder="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name="password" placeholder="password" className="input input-bordered" required />
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>

                        {/* Captcha below */}
                        <div className="form-control">
                            <label className="label">
                                <LoadCanvasTemplate />
                            </label>
                            {/* Add required below for recaptcha */}
                            <input type="text" ref={captchRef} name="captch" placeholder="Captcha" className="input input-bordered" />
                            <button type='button' onClick={handleValidateCaptcha} className='btn btn-outline btn-neutral btn-xs'>Validate</button>
                        </div>


                        <div className="form-control mt-6">
                            {/* TODO: apply the state: disabled instead of false on recpatch */}
                            <input disabled={false} type="submit" value={'Login'} className={`btn btn-neutral`}  />
                        </div>
                    </form>
                    <p className='text-center mb-4'><small>New here? <Link to={'/signup'} className='text-blue-400 hover:text-blue-600'>Sign Up</Link></small></p>
                </div>
            </div>
        </div>
    );
};

export default Login;