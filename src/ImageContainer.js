import React from 'react'
import {Image} from 'semantic-ui-react'
function ImageContainer(props) {
  let img
  if(props.imagesChangeHandler){
      img=(<Image floated='left' onClick={()=>{props.imagesChangeHandler(props.imagePath)}} src={`${process.env.REACT_APP_BACKEND_URL}/`+props.imagePath} style={{height:'50px', width:'50px'}} alt="😃"/>)
  }else{
    img=(<Image floated='left' src={props.imagePath} style={{height:'50px', width:'50px'}} alt="😃"/>)
  }

  return (
    <Image.Group size='small'>
        {img}
    </Image.Group>
  )
}

export default ImageContainer