export const dynamic = "force-dynamic";
import Board from "../../../../models/StreakerBoard";
import connectDB from "../../../../utils/db";

// Connect to the database once for all routes
connectDB();

export const GET = async () => {
  try {
    const boards = await Board.find({});
    return new Response(JSON.stringify(boards), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Board operation failed', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST = async (req) => {
  const { boardUser, ...boardDetails } = await req.json();
  
  try {
    const existingBoard = await Board.findOne({ boardUser }).exec();
    
    if (existingBoard) {
      // Update existing board
      await Board.updateOne({ boardUser }, boardDetails);
      return new Response(JSON.stringify({ board: existingBoard,  message: 'Board updated' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      console.log('BLOCKED FOR TESTING');
      return new Response(JSON.stringify({ error: 'BLOCKED FOR TESTING' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Board operation failed', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};





// export const dynamic = "force-dynamic";
// import { NextResponse } from "next/server";
// import Board from "../../../../models/StreakerBoard";
// import connectDB from "../../../../utils/db";

// export const GET = async (req, res) => {
//   await connectDB();
//   try {
//     const boards = await Board.find({});
//     return new NextResponse(JSON.stringify(boards), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Board operation failed", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Internal Server Error" }),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
// };

// export const POST = async (req, res) => {
//   const {
//     _id,
//     boardId,
//     goalToAchieve,
//     habitsNames,
//     habitsValues,
//     days,
//     cells,
//     boardUser,
//   } = await req.json();

//   await connectDB();

//   try {
//     console.log("Board USER", boardUser);
//     const existingBoard = await Board.find({"boardUser": boardUser}).exec();
    
//     console.log("Board EXISTING BOARD", existingBoard);
//     if (existingBoard.length) {
//       // Update existing board
//       const update = {
//         goalToAchieve: goalToAchieve,
//         habitsNames: habitsNames,
//         habitsValues: habitsValues,
//         days: days,
//         cells: cells,
//       };
//       await Board.updateOne({ "boardUser": boardUser }, update);
      
//       console.log("Board updated", existingBoard);
//       return new NextResponse("Board updated", { status: 200 });
//     }
    
//     console.log("Createing new _Id", _id);
//     console.log("Createing new board Id", boardId);
//     console.log("Createing new goal", goalToAchieve);
//     console.log("Createing new names", habitsNames);
//     console.log("Createing new values", habitsValues);
//     console.log("Createing new days", days);
//     // console.log("Createing new cells", cells);
//     console.log("Createing new user", boardUser);
//       // Create new board
//       const newBoard = new Board({
//         _id: _id,
//         boardId: boardId,
//         goalToAchieve:goalToAchieve,
//         habitsNames: habitsNames,
//         habitsValues: habitsValues,
//         days: days,
//         cells: cells ,
//         boardUser: boardUser,
//       });

//       await Board.create(newBoard);

//       return new NextResponse("Board created", { status: 201 });

//   } catch (error) {
//     console.error("Board operation failed", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Internal Server Error" }),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
// };

// export const dynamic = "force-dynamic"; // defaults to force-static
// import { NextResponse } from "next/server";
// import Board from "../../../../models/StreakerBoard";
// import connectDB from "../../../../utils/db";
// import generateUUID from "@/utils/generateUUID";

// export const GET = async (req, res) => {
//   await connectDB();
//   const boards = await Board.find({});
//   return new NextResponse(JSON.stringify(boards), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };

// export const POST = async (req, res) => {
//   const { boardId, goalToAchieve, habitsNames, habitsValues, days, cells, boardUser } =
//     await req.json();

//   await connectDB();

//   const userSpecificBoards = await Board.find({ boardUser: boardUser }).exec();
// if(userSpecificBoards.length > 0) {
//   console.log('userSpecificBoards', userSpecificBoards)
//   const filter = { boardUser: boardUser };
//   const update = { goalToAchieve: goalToAchieve, habitsNames: habitsNames, habitsValues: habitsValues, days: days, cells: cells };
//   const boardExists = await Board.findOneAndUpdate(filter, update);
//   if (boardExists) {
//     console.log("Board updated", boardExists);
//     return new NextResponse("Board updated", { status: 200 });
//   }
// }else {
//   const newBoard = new Board({
//     boardId: generateUUID(),
//     goalToAchieve: goalToAchieve,
//     habitsNames: habitsNames,
//     habitsValues: habitsValues,
//     days: days,
//     cells: cells,
//     boardUser: boardUser
//   });

//   try {
//     await Board.create(newBoard);
//     return new NextResponse("Board created", { status: 201 });
//   } catch (error) {
//     console.log("Bord faild", error);
//     return new NextResponse.error(error);
//   }
// }
// const filter = { boardUser: boardUser };
// const update = { goalToAchieve: goalToAchieve, habitsNames: habitsNames, habitsValues: habitsValues, days: days, cells: cells };

// const boardExists = await Board.findOneAndUpdate({
//   boardId: boardId,
//   goalToAchieve: goalToAchieve,
//   habitsNames: habitsNames,
//   habitsValues: habitsValues,
//   days: days,
//   cells: cells,
//   boardUser: boardUser
// });
// const boardExists = await Board.findOneAndUpdate(filter, update);
// if (boardExists) {
//   console.log("Board updated", boardExists);
//   return new NextResponse("Board updated", { status: 200 });
// }

// const newBoard = new Board({
//   boardId: boardId,
//   goalToAchieve: goalToAchieve,
//   habitsNames: habitsNames,
//   habitsValues: habitsValues,
//   days: days,
//   cells: cells,
//   boardUser: boardUser
// });

// try {
//   await Board.create(newBoard);
//   return new NextResponse("Board created", { status: 201 });
// } catch (error) {
//   console.log("Bord faild", error);
//   return new NextResponse.error(error);
// }
// };
