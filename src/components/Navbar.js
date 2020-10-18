import React from 'react'
import { Menu, Button } from 'antd'
import { BookOutlined, SettingOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'

const Navbar = ({ user, handleSignout }) => (
  <Menu
    style={{ display: 'flex', justifyContent: 'space-between' }}
    mode='horizontal'
  >
    <Menu.Item key='1'>
      <NavLink to='/' className='nav-link'>
        <span className='app-title'>
          <BookOutlined style={{ fontSize: '2rem' }} />
          BookMart
        </span>
      </NavLink>
    </Menu.Item>
    <Menu.Item disabled key='2'>
      <span className='app-user'>Hello, {user.attributes.email}</span>
    </Menu.Item>
    <Menu.Item key='3' icon={<SettingOutlined />}>
      <NavLink to='/profile' className='nav-link'>
        Profile
      </NavLink>
    </Menu.Item>
    <Menu.Item key='4'>
      <Button onClick={handleSignout} type='warning'>
        Sign Out
      </Button>
    </Menu.Item>
  </Menu>
)

export default Navbar
