import React from 'react';
import styled from 'styled-components';
import {
  Window,
  WindowContent,
  WindowHeader,
  Button,
  Toolbar,
  Avatar,
  Fieldset,
  TextField
} from 'react95';

const Wrapper = styled.div`
  padding: 5rem;
  background: ___CSS_0___;
  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: '';
      position: absolute;
      background: ___CSS_1___;
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .window {
    width: 600px;
    min-height: 400px;
  }
  .window:nth-child(2) {
    margin: 2rem;
  }
  .footer {
    display: block;
    margin: 0.25rem;
    height: 31px;
    line-height: 31px;
    padding-left: 0.25rem;
  }
  input {
    padding: 15px;
    font-size: 3rem;
  }
`;
export const Default = () => (
  <Wrapper>
    <Window className='window'>
      <WindowHeader className='window-header'>
        <span>exchange.exe</span>
        <Button>
          <span className='close-icon' />
        </Button>
      </WindowHeader>
      <Toolbar>
        <Button variant='menu' size='sm'>
          Settings
        </Button>
        <Button variant='menu' size='sm'>
          Wallet
        </Button>
      </Toolbar>
      <WindowContent>
      <Fieldset label="Byt">
      <div>
        <TextField fullWidth/>
        
        <Button style={{"position":"absolute","z-index":"500","margin-top": "-65px","right": "40px","font-size":"1.2rem","padding":"10px"}}> ETH </Button>
        <Avatar size={50} style={{"z-index":"500","font-size":"2rem","position":"absolute","margin-left":"auto","margin-right":"auto","left":"0","right":"0","margin-top": "-10px" }}>
          ▼
        </Avatar>
        </div>
        <br/>
        <div>
        <TextField fullWidth/>
        <Button style={{"position":"absolute","z-index":"500","margin-top": "-65px","right": "40px","font-size":"1.2rem","padding":"10px"}}> Välj token </Button>
        </div>
        <br/>
        <Button style={{"height":"60px","font-size":"1.5rem"}} fullWidth> Anslut plånbok </Button>
        </Fieldset>
      </WindowContent>
    </Window>
  </Wrapper>
);

Default.story = {
  name: 'default'
};