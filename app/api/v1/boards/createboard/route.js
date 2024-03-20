export const POST = async (req) => {
    const { boardUser, ...boardDetails } = await req.json();
    
    try {
      const existingBoard = await Board.findOne({ boardUser }).exec();
      
      if (existingBoard) {
        // Update existing board
        // await Board.updateOne({ boardUser }, boardDetails);
        return new Response(JSON.stringify({ board: existingBoard,  message: 'Board exists' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        // Create new board
        const newBoard = new Board({ boardUser, ...boardDetails });
        await newBoard.save();
        return new Response(JSON.stringify({ board:newBoard, message: 'Board created' }), {
          status: 201,
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
  