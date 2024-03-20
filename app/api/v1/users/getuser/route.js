import {
    getKindeServerSession,
  } from "@kinde-oss/kinde-auth-nextjs/server";
  import User from "@/models/User";
  import connectDB from "@/utils/db";
  
  export async function GET(request) {
      try {
      // console.log("in get user***********************************************", request);
    const emailFromClient = "nandantyagi@gmail.com";
    const session = getKindeServerSession(request);
    const user = await session.getUser();
    connectDB();
    // console.log("in get user", user);
   
    const existingUser = await User.findOne({ email: user.email || emailFromClient })
          if (!existingUser) {
              return new Response(JSON.stringify({ message: "User not found" }), {
                  status: 404,
              });
          }
            return new Response(JSON.stringify(existingUser), {
                status: 200,
            });
    

  } catch (error) {
    console.error("Get User operation failed", error);
    return new Response(JSON.stringify({ message: "Error" }), {
        status: 500,
      });
  }
   
  }