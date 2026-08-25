# SuppportDesk
A CRM support system that manage customers tickets

### Installation & Set up 

#### For backend
create python enviremnet
code

<code>
cd backend &&
python3 -m venv your-env-name &&
source your-env-name/bin/activate
</code>

install requied libraries 

<code>
pip install -r requirements.txt</code>

#

run the test

<code>
uvicorn main:app --reload
</code>

##


Tips

if you want to run file like a normal python eg: python3 main.py

Add this code this code at the very bottom 


import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0",port=8634, reload=True)    


#### For frontend

cd frontend

run
<code>
npm install
</code> 

thats it 

if error still ocour in front end
then run thses

<code>
npm install react-router-dom lucide-react</code>


## 

make sure to check the CORS 

frotend UI cannot fetch due to CORS restriction 

solution:

copy your front URL and past it on allow_origins
ins



app.add_middleware(
    
    CORSMiddleware,
    allow_origins=(" your front URL goes here "), 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"] 
)
