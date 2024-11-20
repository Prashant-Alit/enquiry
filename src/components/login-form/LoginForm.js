import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
  EmailRule
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import { useAuth } from '../../contexts/auth';

import './LoginForm.scss';

export default function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const formData = useRef({ UserName: '', Password: '' });

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { UserName, Password } = formData.current;
    setLoading(true);

    const result = await signIn(UserName, Password);
    if (!result.isOk) {
      setLoading(false);
      notify(result.message, 'error', 2000);
    }
  }, [signIn]);

  const onCreateAccountClick = useCallback(() => {
    navigate('/create-account');
  }, [navigate]);

  return (
    <div className='login-container'>
       <div className='image-container'>
        <img className='image' style={{width:"200px", height:"350px"}} src='https://plus.unsplash.com/premium_photo-1683120966127-14162cdd0935?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='logo '/>
      </div> 
      <div className='form-container'>
    <form className={'login-form'} onSubmit={onSubmit}>
      <Form formData={formData.current} disabled={loading}>
        <Item
          className="formItem"
          dataField={'UserName'}
          editorType={'dxTextBox'}
          editorOptions={emailEditorOptions}
        >
          <RequiredRule message="Email is required" />
          <EmailRule message="Email is invalid" />
          <Label visible={false} />
        </Item>
        <Item
        className="formItem"
          dataField={'Password'}
          editorType={'dxTextBox'}
          editorOptions={passwordEditorOptions}
        >
          <RequiredRule message="Password is required" />
          <Label visible={false} />
        </Item>
        {/* <Item
          dataField={'rememberMe'}
          editorType={'dxCheckBox'}
          editorOptions={rememberMeEditorOptions}
        >
          <Label visible={false} />
        </Item> */}
         {/* <ButtonItem className="formItem">  */}
          {/* <ButtonOptions
            width={'100%'}
            type={'default'}
            useSubmitBehavior={true}
          >
            <span className="dx-button-text">
              {
                loading
                  ? <LoadIndicator width={'24px'} height={'24px'} visible={true} />
                  : 'Sign In'
              }
            </span>
          </ButtonOptions> */}
        {/* </ButtonItem>  */}
        <Item>
          <div className={'link'}>
            <Link to={'/reset-password'}>Forgot password?</Link>
          </div>
        </Item>
        <ButtonItem className="formItem">
          <ButtonOptions
            text={'Submit'}
            width={'100%'}
            useSubmitBehavior={true}
          />
        </ButtonItem>
      </Form>
    </form>
    </div>
    </div>
  );
}

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Email', mode: 'email' };
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Password', mode: 'password' };
const rememberMeEditorOptions = { text: 'Remember me', elementAttr: { class: 'form-text' } };
