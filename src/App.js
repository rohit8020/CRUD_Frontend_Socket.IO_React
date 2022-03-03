import React from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import Post from "./post";
import Form from "./Form"
import { Container,Header,Button,Item,Modal} from 'semantic-ui-react'

function App() {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posts, setPosts] = useState([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formType, setFormType] = useState("");
  const [images, setImages] = useState([]);
  const [pickImages, setPickImages] = useState([]);
  const [postId, setPostId] = useState("");

  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    const socket = io.connect("https://boiling-badlands-66933.herokuapp.com/", {
      transports: ["websocket"],
    });
    socket.on("post", (data) => {
      if (data.action === "post") {
        // console.log(data.post);
        setPosts((prevPost) => {
          return [...prevPost, data.post];
        });
      }else if (data.action === "update"){
         let postId=data.postId
         const updatedPost=data.updatedPost
         setPosts((prevPosts)=>{
           let psts= prevPosts.filter(post=>post._id !== postId)
           return [...psts,updatedPost]
         })
      }else if(data.action === 'delete'){
        let postId = data.postId
        // console.log(postId)
        setPosts((prevPosts)=>{
          let psts=prevPosts.filter(post=>{
            return post._id !== postId
          })
          return psts
        })
      }
    });

    axios
      .get("https://boiling-badlands-66933.herokuapp.com/posts")
      .then((response) => {
        // console.log(response.data)
        setPosts((prevPost) => {
          return [...prevPost, ...response.data.posts];
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const inputImagesChangeHandler = useCallback(
    (e) => {
      var src;
      setFiles((prevFiles) => {
        const image = e.target.files[0];
        src = URL.createObjectURL(e.target.files[0]);
        // console.log(src);
        // console.log(pickImages);
        // console.log(image)
        return [...prevFiles, image];
      });

      setPickImages((prevImages) => {
        return [...prevImages, src];
      });
    },
    []
  );

  const inputTitleChangeHandler = (e) => {
    setTitle(e.target.value);
  };

  const inputDescriptionChangeHandler = (e) => {
    setDescription(e.target.value);
  };

  const submitForm = useCallback(
    (data) => {
      const formData = new FormData();

      for (const name in files) {
        formData.append("images", files[name]);
      }

      formData.append("title", title);
      formData.append("description", description);
      // console.log(title, description, files, images);
      // console.log("hhh");

      // console.log(formData.values());
      if (formType === "editing") {
        for (const i in images) {
          formData.append("imgs", images[i]);
        }
        axios
          .put(`https://boiling-badlands-66933.herokuapp.com/post/${data}`, formData)
          .then(() => {
            // console.log(response);
          })
          .catch(() => {
            // console.log(error);
          });
      }

      if (formType === "creating") {
        axios
          .post("https://boiling-badlands-66933.herokuapp.com/newpost", formData)
          .then(() => {
            // console.log(response);
          })
          .catch(() => {
            // console.log(error);
          });
      }
      setEditing(false)
      setCreating(false)
      setImages([])
      setFiles([])
      setDescription("")
      setTitle("")
      setPickImages([])
    },
    [files, formType, images, title, description]
  );

  const createPostHandler = () => {
    setCreating(true);
    setFormType("creating");
    setEditing(false);
  };

  const editPostHandler = (postData) => {
    setEditing(true);
    setCreating(false);
    setFormType("editing");
    setTitle(postData.title);
    setDescription(postData.description);
    setImages(() => {
      return [...postData.images];
    });
    setPostId(postData.id);
  };

  const deletePostHandler = (data)=>{
    axios.delete(`https://boiling-badlands-66933.herokuapp.com/post/${data}`)
    .then(() => {
      // console.log(response)
    })
    .catch(() => {
      // console.log(err)
    })
  }

  const imagesChangeHandler = (img) => {
    // console.log("clicked");
    if(images.length===1){
      return
    }else{
      setImages(() => {
        return [...images.filter((image) => image !== img)];
      });
    }
  };

  const showModalHandler=(modal)=>{
    if(modal){
      setOpen(true)
    }else{
      setOpen(false)
    }
  }

  let renderPosts = posts.map((post) => {
    // console.log(post._id)
    return (
      <Post
        deletePostHandler={deletePostHandler}
        editPostHandler={editPostHandler}
        key={Math.random().toString()}
        id={post._id}
        title={post.title}
        description={post.description}
        images={post.images}
        showModalHandler={showModalHandler}
      />
    );
  });

  let form;
  if (formType === "editing") {
    form = (
      <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      >
      <Modal.Content>
        <Modal.Description>
          <Header>{formType} Post</Header>
        </Modal.Description>
        <Form
        formType={formType}
        title={title}
        description={description}
        inputDescriptionChangeHandler={inputDescriptionChangeHandler}
        inputTitleChangeHandler={inputTitleChangeHandler}
        inputImagesChangeHandler={inputImagesChangeHandler}
        submitForm={submitForm}
        previewImages={images}
        pickImages={pickImages}
        imagesChangeHandler={imagesChangeHandler}
        id={postId}
        showModalHandler={showModalHandler}
      />
      </Modal.Content>
    </Modal>
    );
  }

  if (formType === "creating") {
    form = (

      <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      >
      <Modal.Content>
        <Modal.Description>
          <Header>{formType} Post</Header>
        </Modal.Description>
        <Form
        formType={formType}
        title={title}
        description={description}
        inputDescriptionChangeHandler={inputDescriptionChangeHandler}
        inputTitleChangeHandler={inputTitleChangeHandler}
        inputImagesChangeHandler={inputImagesChangeHandler}
        submitForm={submitForm}
        previewImages={pickImages}
        showModalHandler={showModalHandler}
      />
      </Modal.Content>
    </Modal>
    );
  }

  return (
    <Container>
        <Container textAlign='center'><Header as='h1'>CRUD Operation Scoket.IO</Header></Container>
        <Button  onClick={()=>{createPostHandler()
        setOpen(true)
        }}>Create Post</Button>
        {editing ? form : null}
        {creating ? form : null}
        <Item.Group>{renderPosts}</Item.Group>
    </Container>
  );
}

export default App;
