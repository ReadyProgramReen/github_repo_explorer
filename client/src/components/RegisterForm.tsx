import { useState } from "react";
import "./RegisterForm.css"



export default function RegisterForm(){

    //email and password state 
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    //When user clicks handleSubmt button

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
        //prevent default
        e.preventDefault()

        //fetch the registeration data
        try {

         const response = await fetch("http://localhost:9000/auth/register", {
            method:"POST",
            headers:{
                "content-Type" : "application/json"
            },
            body: JSON.stringify({email,password})
         });
         //parse through the response
         const data = await response.json();

         //Reset the email and password field
         setEmail('');
         setPassword('');
         
         //check if the response is not ok (a http built in property )
         if(!response.ok){
            alert(data.error || "Registration failed")
            return;
         }
         
         //if the response is ok 
         console.log("Registration successful", data)
        
         //catch error 
        } catch (error) {
            console.error("Error submitting form",error)
            alert("An error occured during registration.")
        }
        
    }


    return(
        <form onSubmit={handleSubmit} className="register-form-container" action="">
            <h2>Registration</h2>

            {/* //email input field */}
            <input 
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"
            required
             />
            {/* //Password input field */}
            <input
             type="password"
             value={password}
             onChange={(e)=>setPassword(e.target.value)}
             placeholder="password"
             required
             />

             {/* Submit button */}
             <button type="submit" >Register</button>

        </form>
    )
}