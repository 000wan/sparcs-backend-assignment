import React, {useState, useEffect} from "react";

const SingleFeed = ({ val, i, deletePost, editPost }) => {
  const [ isEditing, setIsEditing ] = useState(false);
  const [ ID, setID ] = useState(val.id);
  const [ postTitle, setPostTitle ] = useState(val.title);
  const [ postContent, setPostContent ] = useState(val.content);

  if( val.id !== ID ) {
    setID(val.id);
    setIsEditing(false);
    setPostTitle(val.title);
    setPostContent(val.content);
  }

  useEffect(() => {
    if( !isEditing ) { 
      editPost(ID, postTitle, postContent);
    } // eslint-disable-next-line
  }, [ isEditing ]);

  return (
    isEditing ?
    (<div key={i} className={"feed-item"}>
      <div className={"delete-item"} onClick={(e) => deletePost(`${ID}`)}>ⓧ</div>
      <button className={"edit-item"} onClick={(e) => setIsEditing(!isEditing)}>Save</button>
      <h3>
        <input className={"feed-title"} type={"text"} value={postTitle} onChange={(e) => setPostTitle(e.target.value)}/>
      </h3>
      <p>
        <input className={"feed-body"} type={"text"} value={postContent} onChange={(e) => setPostContent(e.target.value)}/>
      </p>
    </div>) :
    (<div key={i} className={"feed-item"}>
      <div className={"delete-item"} onClick={(e) => deletePost(`${ID}`)}>ⓧ</div>
      <button className={"edit-item"} onClick={(e) => setIsEditing(!isEditing)}>Edit</button>
      <h3 className={"feed-title"}>{ val.title }</h3>
      <p className={"feed-body"}>{ val.content }</p>
    </div>)
  )
}

export default SingleFeed;