import React from 'react';
import { Link ,useLocation} from 'react-router-dom';
import Img5 from '../assets/img5.png';
import Btn from '../components/HomePage/btn';
import { apiConnector } from '../service/apiconnector';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail } from '../slices/otpSlice';
import './signin.css';
import OtpInput from 'react-otp-input';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BiShowAlt, BiHide } from 'react-icons/bi';

const Signup = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [otp, setOtp] = React.useState('');
  const { email } = useSelector((state) => state.otp);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    confirmPassword: '',
    password: '',
  });
  const { password, confirmPassword } = formData;
  const logo = 'PROMPTa';
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);

  const changeHandler = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const toggleHandler1 = () => {
    setShowPassword1(!showPassword1);
  };

  const toggleHandler2 = () => {
    setShowPassword2(!showPassword2);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    formData.otp = otp;
    formData.email = email;

    if (
      !formData.otp === '' ||
      formData.email === '' ||
      formData.password === '' ||
      formData.confirmPassword === ''
    ) {
      toast.error('All fields are required');
    } else if (formData.password !== formData.confirmPassword) {
      toast.error('Password and Confirm Password do not match');
    } else if (formData.password.length < 7) {
      toast.error('Password should be more than 8 characters');
    } else {
      try {
        setLoading(true);
        const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL +'/api/signup', formData);

        if (!result.data.success) {
          toast.error('Failed to sign up');
          throw new Error(result.data.message);
        }

        if (result.data.success) {
          navigate('/login');
          toast.success('Sign up successful');
        }
        dispatch(setEmail(null));
        setLoading(false);
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error(error.response?.data?.message || "Failed to sign up");

        setLoading(false);
      }
    }
  };

  const submitHandler1 = async (event) => {
    event.preventDefault();
    formData.otp = otp;
    formData.email = email;

    if (
      !formData.otp === '' ||
      formData.email === '' ||
      formData.password === '' ||
      formData.confirmPassword === ''
    ) {
      toast.error('All fields are required');
    } else if (formData.password !== formData.confirmPassword) {
      toast.error('Password and Confirm Password do not match');
    } else if (formData.password.length < 7) {
      toast.error('Password should be more than 8 characters');
    } else {
      try {
        setLoading(true);
        const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL +'/api/change_password', formData);

        if (!result.data.success) {
          toast.error('Failed to Change Password');
          throw new Error(result.data.message);
        }

        if (result.data.success) {
          navigate('/login');
          toast.success('Password Changed successfully');
        }
        dispatch(setEmail(null));
        setLoading(false);
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error(error.response?.data?.message || "Failed to Change Password");

        setLoading(false);
      }
    }
  };


  return (
    <>
      {loading ? (
        <div className='flex justify-center items-center h-[100vh] sm:signinbg'>
          <div className='spinner'></div>
        </div>
      ) : (
        <div className='max-w-8/12 Signup-bg mb-0 font-almarai signinbg'>
          <div>
            <div className='p-4'>
              <ul className='flex justify-end gap-2 pr-4 text-richblue-900 font-[400] text-lg'>
                <li>Already a member?</li>
                <li className='text-richblue-300'>
                  <Link to='/login'>Log in</Link>
                </li>
              </ul>
            </div>

            <div className='flex flex-col jusitfy-center items-center m-0'>
            <div className='mb-2 text-richblue-900 font-normal text-start'>
    <h1 className='text-4xl font-semibold'>
      {location.pathname === '/change_password'
        ? 'Change your'
        : 'Create your'}
      <br />
      <span className='text-richblue-300 font-bold'>{logo}</span>
      {location.pathname === '/change_password'
        ? ' Password'
        : ' Account'}
    </h1>
  </div>


              <div className='flex flex-wrap-reverse w-8/12 justify-center items-center mx-auto '>
                <div className='m-10 text-richblue-900 '>
                  <form onSubmit={ location.pathname === '/change_password' ? submitHandler1 :submitHandler} className='flex flex-col text-lg font-[400] relative'>
                    <label htmlFor='passwordInput'>Password</label>
                    <input
                      type={showPassword1 ? 'text' : 'password'}
                      className='border-[1px] rounded-md p-2 w-72 focus:outline-0'
                      placeholder='Password'
                      name='password'
                      value={password}
                      onChange={changeHandler}
                    />
                    {showPassword1 ? (
                      <BiHide className='absolute top-[42px] left-[255px]' onClick={toggleHandler1} />
                    ) : (
                      <BiShowAlt className='absolute top-[42px] left-[255px]' onClick={toggleHandler1} />
                    )}

                    <label htmlFor='passwordInput'>Confirm password</label>
                    <input
                      type={showPassword2 ? 'text' : 'password'}
                      className='border-[1px] rounded-md p-2 w-72 focus:outline-0'
                      placeholder='Confirm Password'
                      name='confirmPassword'
                      value={confirmPassword}
                      onChange={changeHandler}
                    />
                    {showPassword2 ? (
                      <BiHide className='absolute top-[115px] left-[255px]' onClick={toggleHandler2} />
                    ) : (
                      <BiShowAlt className='absolute top-[115px] left-[255px]' onClick={toggleHandler2} />
                    )}

                    <div className='flex flex-col justify-center items-center mt-4'>
                      <p>Enter OTP</p>
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        separator={<span>-</span>}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                        inputStyle={{
                          border: '1px solid #000',
                          borderRadius: '4px',
                          width: '2.5rem',
                          height: '2.5rem',
                          margin: '0 0.5rem',
                          fontSize: '1.5rem',
                          textAlign: 'center',
                        }}
                      />
                    </div>

                    <div className='flex items-center justify-center mt-8'>
                      <Btn>Next</Btn>
                    </div>
                  </form>
                </div>

                <div className='w-80 mt-10'>
                  <img src={Img5} alt='' />
                </div>
              </div>
            </div>
          </div>

          <div className='flex gap-2 justify-center mt-10'>
            <p>Terms of Use</p>
            <p>|</p>
            <p>Privacy Policy</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;
