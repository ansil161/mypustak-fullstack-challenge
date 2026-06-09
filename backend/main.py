from fastapi.middleware.cors import CORSMiddleware   
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

class PostCreate(BaseModel):
    title: str = Field(..., min_length=1)
    body: str = Field(..., min_length=1)

posts = []
next_post_id = 1

@app.post("/posts", status_code=201)
def create_post(post: PostCreate):
    global next_post_id

    if not post.title.strip() or not post.body.strip():
        raise HTTPException(status_code=422, detail="Title and body cannot be empty or only whitespace")
    
    post_dic = post.dict()
    post_dic['id'] = next_post_id
    next_post_id += 1
    posts.append(post_dic)
    return {
        'message': 'Post created successfully',
        'post': post_dic
    }

@app.get('/posts', status_code=200)
def get_all_posts():
    return posts    

@app.delete('/posts/{id}', status_code=200)
def delete_post(id: int):
    for post in posts:
        if post['id'] == id:
            posts.remove(post)
            return {
                'message': 'Post deleted successfully',
                'post': post
            }
    raise HTTPException(status_code=404, detail='Post not found')
