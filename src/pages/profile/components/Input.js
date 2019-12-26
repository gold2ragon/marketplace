import React, {useState} from 'react'

export default ({callback = ()=>{}, placeholder, type = 'text', margin = '15px 0', width = '40%' }) => {
const [value, setValue] = useState('')
  const style = {
    margin,
    width
  }


 return (
   <input
     className='form-control'
     type={type} placeholder={placeholder}
     style={style}
     value={value}
     onChange={(e) => setValue(e.target.value)}
     onBlur={() => callback(value, placeholder)}
   />
 )
}
