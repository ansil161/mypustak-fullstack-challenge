from fastapi.middleware.cors import CORSMiddleware   

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import HTTPException
app = FastAPI()

app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_methods=["*"],allow_headers=["*"],allow_credentials=True)


class PostCreate(BaseModel):
    title: str
    body: str

posts = []

@app.post("/posts",status_code=201)
def create_post(post: PostCreate):
    post_dic=post.dict()
    post_dic['id']=len(posts)+1
    posts.append(post_dic)
    return {
        'message': 'Post created successfully',
        'post': post_dic
    }

@app.get('/get_post',status_code=200)
def get_all_post():
    return posts    

@app.delete('delete_post/{id}',status_code=200)
def delete_post(id:int):
    for post in posts:
        if post['id']==id:
            posts.remove(post)
            return {
                'message': 'Post deleted successfully',
                'post': post
            }
        raise HTTPException(status_code=404,detail='Post not found')