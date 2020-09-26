import React, {useState, useEffect} from 'react'
import './App.css';
import Posts from './components/Posts'
import { db, auth } from './components/firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [openSignIn, setOpenSignIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser)
      } else {
        // user has logged out...
        setUser(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({id: doc.id, post: doc.data()})))
    })
  }, [])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const signUp = e => {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => {
          authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch(error => alert(error.message))
  }

  const signIn = e => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => alert(error.message))
    setOpenSignIn(false)
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form className='app__signup'>
        <center>
          <img
            className='app__headerImage'
            src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
            alt=''
          />
        </center>
        <Input
          placeholder='username'
          type='username'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <Input
          placeholder='email'
          type='text'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          placeholder='password'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type='submit' onClick={signUp}>Sign up</Button>
      </form>
    </div>
  )
  const body2 = (
    <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt=''
              />
            </center>
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>Sign up</Button>
          </form>
    </div>
  )

  return (
    <div className="App">
      <div className='app__header'>
        <Modal
          open={open}
          onClose={handleClose}
        >
          {body}
        </Modal>
        <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(true)}
        >
        {body2}
        </Modal>
        <img
          className='app__headerImage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt=''
        />
        {user ?
        (<Button onClick={() => auth.signOut()}>Logout</Button>)
        : (
            <div>
              <Button type='submit' onClick={() => setOpenSignIn(true)}>Sign in</Button>
              <Button type='submit' onClick={handleOpen}>Sign up</Button>
            </div>
          )
        }
      </div>
      <div className='app__post'>
        <div className='app__postsRight'>
          {
            posts.map(({id, post}) => (
              <Posts user={user} postId={id} key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className='app__postsLeft'>
        <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
