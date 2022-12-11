import React from 'react'
import ImageContainer from './ImageContainer'
import { Form, TextArea, Button,Input,Container } from 'semantic-ui-react'

function form(props) {

  let imagePreview,imagePreview2
  let data
  if(props.formType === 'editing'){
    imagePreview=props.previewImages.map(img=>{
      return (
        <ImageContainer
        imagesChangeHandler={props.imagesChangeHandler}
        key={Math.random().toString()}
        imagePath={img}
        />
      )
    })

    imagePreview2=props.pickImages.map(img=>{
      return (
        <ImageContainer
        key={Math.random().toString()}
        imagePath={img}
        />
      )
    })
    data=props.id
  }
  
  
  if(props.formType === 'creating'){
    data='creating'
    imagePreview=props.previewImages.map(src=>{
      return (
        <ImageContainer
          key={Math.random().toString()}
          imagePath={src}
        />
      )
    })
  }

  return (
    <Container>
      <Form>
        <Input style={{marginTop: '20px'}} fluid type="file" multiple onChange={(e)=>{props.inputImagesChangeHandler(e)}} required/>
        <Input placeholder='title' style={{marginTop: '20px'}} fluid type="text" value={props.title} name="title" onChange={(e)=>{props.inputTitleChangeHandler(e)}} required/>
        <TextArea placeholder='description' style={{marginTop: '20px'}} type="text" value={props.description} name="description" onChange={(e)=>{props.inputDescriptionChangeHandler(e)}} required/>
        {(props.formType==='editing')?(
        <Container style={{marginTop: '20px'}} >
          <Container className="pickedImages">{imagePreview2}</Container>
          <Container className="postImages">{imagePreview}</Container>
        </Container>
        ):null}
        {(props.formType==='creating')?imagePreview:null}
        <div style={{display: 'flex',justifyContent: 'flex-end'}}>
        <Button type='button' style={{marginTop: '20px'}} inverted color='green' onClick={()=>{props.submitForm(data)
        props.showModalHandler(false)
        }}>Submit</Button>
        </div>
      </Form>
    </Container>
    
  )
}

export default form