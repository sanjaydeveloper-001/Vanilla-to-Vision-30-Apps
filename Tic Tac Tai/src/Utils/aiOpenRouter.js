const getAIMoveGoogleAI = async (board) => {

  const systemPrompt = `
      You are a smart Tic Tac Toe AI playing as "O".
      Play like a Pro Tic Tac Toe player!

      Rules:
      1. Win if possible.
      2. Block opponent if they are about to win.
      3. Otherwise: choose center > corner > side.
      
      Only return ONE number (0-8). Do not explain.
    `;
  const userPrompt = `
    Current board: ${JSON.stringify(board)}

      Indexing:
      [0][1][2]
      [3][4][5]
      [6][7][8]

      "O" = AI
      "X" = human
      null = empty
      What is your move?
  `

  const getAiMover = async () => {

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions" , {
      method :"POST",
      headers:{
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        model:"deepseek/deepseek-r1",
        temperature:0.9,
        messages:[
          {role:"system" , content:systemPrompt},
          {role:"user" , content:userPrompt},
        ]
      })
    })

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    const match = text.match(/\d+/);
    return match;
    
  }

  try {
    let move = await getAiMover(board);
    return move;
  } catch (error) {
    console.error("Error in Gemini Move:", error);

    // Fallback move
    const preferredOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    return preferredOrder.find(i => board[i] === null) ?? null;
  }
};

export default getAIMoveGoogleAI;
