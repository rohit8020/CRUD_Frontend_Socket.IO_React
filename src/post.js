import React from 'react'
import ImageContainer from './ImageContainer'
import {Item,Container, Button} from 'semantic-ui-react'

function post(props) {
  
  const imgs=props.images.map(img =>{
    return (
      <ImageContainer
      key={Math.random().toString()}
      imagePath={'https://boiling-badlands-66933.herokuapp.com/'+img}
      />
    )
  })

  return (
    <Item style={{border: '2px solid rgba(42,1,34,.2)', padding: '20px', borderRadius: '5px'}}>
      <Item.Content style={{width:'100%'}}>
      <div>
      <Item.Header>Title : {props.title}</Item.Header>
      <Item.Meta>Description : {props.description}</Item.Meta>
      <Container>
        {imgs}
      </Container>
      </div>

      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      <Button inverted color='blue' onClick={()=>{props.editPostHandler(props)
      props.showModalHandler(true)
      }}>Edit</Button>
      <Button inverted color='red' onClick={()=>{props.deletePostHandler(props.id)}}>Delete</Button>
      </div>
      </Item.Content>
      {/* <Item.Extra> */}
      
      {/* </Item.Extra> */}
    </Item>
  )
}

export default post